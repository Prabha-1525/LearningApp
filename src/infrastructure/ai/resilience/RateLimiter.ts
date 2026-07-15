/**
 * Token-bucket style rate limiter for on-device AI traffic.
 * Protects child sessions from accidental burst spend / abuse.
 */
export class RateLimiter {
  private tokens: number;
  private lastRefillMs: number;

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number,
  ) {
    this.tokens = capacity;
    this.lastRefillMs = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefillMs) / 1000;
    if (elapsedSec <= 0) {
      return;
    }
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsedSec * this.refillPerSecond,
    );
    this.lastRefillMs = now;
  }

  tryRemove(cost = 1): boolean {
    this.refill();
    if (this.tokens < cost) {
      return false;
    }
    this.tokens -= cost;
    return true;
  }

  get availableTokens(): number {
    this.refill();
    return this.tokens;
  }
}

/** Default: ~20 LLM calls / minute burst capacity 8 */
export const llmRateLimiter = new RateLimiter(8, 20 / 60);

/** Default: ~30 TTS calls / minute burst capacity 10 */
export const ttsRateLimiter = new RateLimiter(10, 30 / 60);
