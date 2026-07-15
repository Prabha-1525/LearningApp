/**
 * API security policy for on-device AI clients.
 *
 * Invariants:
 * - Never embed OpenAI/Gemini secret API keys in the app binary.
 * - Call vendor APIs only through backend proxies.
 * - Attach short-lived access tokens (Firebase/session), not long-lived secrets.
 * - Strip PII from logs; do not persist raw auth headers.
 */

export type SecureRequestInit = {
  readonly method?: 'GET' | 'POST';
  readonly body?: unknown;
  readonly accessToken?: string | null;
  readonly idempotencyKey?: string;
  readonly timeoutMs?: number;
};

export function buildSecureHeaders(
  accessToken?: string | null,
  idempotencyKey?: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Client-App': 'LearningApp',
    'X-Requested-With': 'LearningApp',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  return headers;
}

export async function secureFetch(
  url: string,
  init: SecureRequestInit,
): Promise<Response> {
  if (!url) {
    throw new Error('AI proxy URL is not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    init.timeoutMs ?? 20_000,
  );

  try {
    return await fetch(url, {
      method: init.method ?? 'POST',
      headers: buildSecureHeaders(init.accessToken, init.idempotencyKey),
      body: init.body == null ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function assertNoVendorSecretsInEnv(
  values: Record<string, string>,
): void {
  const banned = [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'GOOGLE_API_KEY',
    'TTS_API_KEY',
  ];
  for (const key of banned) {
    if (values[key]) {
      throw new Error(
        `${key} must not ship in the mobile client. Use a backend proxy.`,
      );
    }
  }
}
