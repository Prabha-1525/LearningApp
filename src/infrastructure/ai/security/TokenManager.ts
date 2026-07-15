import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

/**
 * Manages short-lived access tokens used to call AI proxies.
 * Vendor API keys never live here — only app/session tokens.
 */
export type AccessTokenSet = {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresAtMs: number;
};

const ACCESS_KEY = StorageKeys.module('ai', 'accessToken');
const REFRESH_KEY = StorageKeys.module('ai', 'refreshToken');
const EXPIRY_KEY = StorageKeys.module('ai', 'expiresAtMs');

export class TokenManager {
  setTokens(tokens: AccessTokenSet): void {
    mmkvStorage.setString(ACCESS_KEY, tokens.accessToken);
    if (tokens.refreshToken) {
      mmkvStorage.setString(REFRESH_KEY, tokens.refreshToken);
    }
    mmkvStorage.setNumber(EXPIRY_KEY, tokens.expiresAtMs);
  }

  clear(): void {
    mmkvStorage.delete(ACCESS_KEY);
    mmkvStorage.delete(REFRESH_KEY);
    mmkvStorage.delete(EXPIRY_KEY);
  }

  getAccessToken(): string | null {
    const token = mmkvStorage.getString(ACCESS_KEY);
    const expiresAt = mmkvStorage.getNumber(EXPIRY_KEY);
    if (!token) {
      return null;
    }
    if (expiresAt != null && Date.now() >= expiresAt - 30_000) {
      return null;
    }
    return token;
  }

  /**
   * Placeholder refresh — real impl calls backend /auth/refresh.
   * Returns null when offline or refresh unavailable.
   */
  async refreshIfNeeded(
    refreshFn?: (refreshToken: string) => Promise<AccessTokenSet | null>,
  ): Promise<string | null> {
    const current = this.getAccessToken();
    if (current) {
      return current;
    }
    const refresh = mmkvStorage.getString(REFRESH_KEY);
    if (!refresh || !refreshFn) {
      return null;
    }
    const next = await refreshFn(refresh);
    if (!next) {
      return null;
    }
    this.setTokens(next);
    return next.accessToken;
  }
}

export const tokenManager = new TokenManager();
