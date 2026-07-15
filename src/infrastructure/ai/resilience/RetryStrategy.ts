export type RetryOptions = {
  readonly retries?: number;
  readonly baseDelayMs?: number;
  readonly maxDelayMs?: number;
  readonly retryOn?: (error: unknown) => boolean;
};

const defaultRetryOn = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return true; // network
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return true;
  }
  if (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    typeof (error as {status: unknown}).status === 'number'
  ) {
    const status = (error as {status: number}).status;
    return status === 408 || status === 429 || status >= 500;
  }
  return false;
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with jitter for AI proxy calls.
 */
export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 400;
  const maxDelayMs = options.maxDelayMs ?? 4_000;
  const retryOn = options.retryOn ?? defaultRetryOn;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !retryOn(error)) {
        break;
      }
      const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      const jitter = Math.floor(Math.random() * 120);
      await sleep(exp + jitter);
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('AI request failed after retries');
}

export class HttpStatusError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpStatusError';
  }
}
