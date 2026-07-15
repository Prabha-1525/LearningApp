import {err, ok, type Result} from '@shared/lib';
import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import {HttpStatusError, withRetry} from '../resilience/RetryStrategy';
import {secureFetch} from '../security/ApiSecurity';
import {tokenManager} from '../security/TokenManager';
import type {
  TtsProvider,
  TtsSynthesizeRequest,
  TtsSynthesizeResponse,
} from '../types';

function cacheKey(text: string, voiceId: string, rate: number): string {
  const fingerprint = `${voiceId}|${rate}|${text}`;
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i += 1) {
    hash = (hash * 31 + fingerprint.charCodeAt(i)) >>> 0;
  }
  return StorageKeys.module('ai', `tts.${hash.toString(16)}`);
}

/**
 * Tamil TTS via backend proxy + local URI cache.
 * Device TTS can be plugged later behind the same port.
 */
export function createTamilTtsProvider(proxyUrl: string): TtsProvider {
  return {
    isAvailable: () => true,
    async synthesize(
      request: TtsSynthesizeRequest,
    ): Promise<Result<TtsSynthesizeResponse>> {
      const voiceId = request.voiceId ?? 'ta-IN-warm';
      const speechRate = request.speechRate ?? 0.9;
      const key = cacheKey(request.text, voiceId, speechRate);
      const cachedUri = mmkvStorage.getString(key);
      if (cachedUri) {
        return ok({
          audioUri: cachedUri,
          durationMs: null,
          cached: true,
          provider: 'proxy',
        });
      }

      if (!proxyUrl) {
        // Offline pack placeholder — UI may show caption + soft chime.
        const offlineUri = `offline://tts/${encodeURIComponent(request.text)}`;
        return ok({
          audioUri: offlineUri,
          durationMs: null,
          cached: false,
          provider: 'offline_pack',
        });
      }

      try {
        const accessToken = await tokenManager.refreshIfNeeded();
        const response = await withRetry(async () => {
          const res = await secureFetch(proxyUrl, {
            method: 'POST',
            accessToken,
            body: {
              text: request.text,
              locale: 'ta',
              voiceId,
              speechRate,
            },
          });
          if (!res.ok) {
            throw new HttpStatusError(res.status, await res.text());
          }
          return res;
        });

        const json = (await response.json()) as {
          audioUri?: string;
          url?: string;
          durationMs?: number;
        };
        const audioUri = json.audioUri ?? json.url;
        if (!audioUri) {
          return err(new Error('Tamil TTS proxy returned no audioUri'));
        }
        mmkvStorage.setString(key, audioUri);
        return ok({
          audioUri,
          durationMs: json.durationMs ?? null,
          cached: false,
          provider: 'proxy',
        });
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('Tamil TTS failed'),
        );
      }
    },
  };
}
