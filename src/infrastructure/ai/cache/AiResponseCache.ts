import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {LlmGenerateResponse} from '../types';

type CacheEntry = {
  readonly value: LlmGenerateResponse;
  readonly expiresAtMs: number;
};

/**
 * Content-addressed AI response cache (MMKV).
 * Keys hash prompt + variables so identical coach turns reuse results.
 */
export class AiResponseCache {
  constructor(private readonly defaultTtlMs = 10 * 60_000) {}

  private key(promptId: string, fingerprint: string): string {
    return StorageKeys.module('ai', `cache.${promptId}.${fingerprint}`);
  }

  get(promptId: string, fingerprint: string): LlmGenerateResponse | null {
    const raw = mmkvStorage.getString(this.key(promptId, fingerprint));
    if (!raw) {
      return null;
    }
    try {
      const entry = JSON.parse(raw) as CacheEntry;
      if (Date.now() > entry.expiresAtMs) {
        mmkvStorage.delete(this.key(promptId, fingerprint));
        return null;
      }
      return {...entry.value, cached: true};
    } catch {
      return null;
    }
  }

  set(
    promptId: string,
    fingerprint: string,
    value: LlmGenerateResponse,
    ttlMs = this.defaultTtlMs,
  ): void {
    const entry: CacheEntry = {
      value: {...value, cached: false},
      expiresAtMs: Date.now() + ttlMs,
    };
    mmkvStorage.setString(
      this.key(promptId, fingerprint),
      JSON.stringify(entry),
    );
  }
}

export const aiResponseCache = new AiResponseCache();

export function fingerprintVariables(
  variables: Readonly<Record<string, string | number>>,
): string {
  return Object.keys(variables)
    .sort()
    .map(key => `${key}=${variables[key]}`)
    .join('&');
}
