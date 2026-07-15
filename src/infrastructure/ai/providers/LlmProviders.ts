import {err, ok, type Result} from '@shared/lib';

import {HttpStatusError, withRetry} from '../resilience/RetryStrategy';
import {secureFetch} from '../security/ApiSecurity';
import {tokenManager} from '../security/TokenManager';
import type {
  AiProviderId,
  LlmGenerateResponse,
  LlmMessage,
  LlmProvider,
} from '../types';

type ProxyProviderConfig = {
  readonly id: AiProviderId;
  readonly proxyUrl: string;
};

async function callProxy(
  config: ProxyProviderConfig,
  messages: readonly LlmMessage[],
  options?: {maxTokens?: number; temperature?: number},
): Promise<Result<LlmGenerateResponse>> {
  if (!config.proxyUrl) {
    return err(new Error(`${config.id} proxy URL is not configured`));
  }

  try {
    const accessToken = await tokenManager.refreshIfNeeded();
    const response = await withRetry(async () => {
      const res = await secureFetch(config.proxyUrl, {
        method: 'POST',
        accessToken,
        idempotencyKey: `${config.id}_${Date.now()}`,
        body: {
          provider: config.id,
          messages,
          maxTokens: options?.maxTokens ?? 120,
          temperature: options?.temperature ?? 0.4,
        },
      });
      if (!res.ok) {
        throw new HttpStatusError(res.status, await res.text());
      }
      return res;
    });

    const json = (await response.json()) as {
      text?: string;
      message?: string;
      usage?: {promptTokens?: number; completionTokens?: number};
    };
    const text = json.text ?? json.message;
    if (!text) {
      return err(new Error(`${config.id} proxy returned empty text`));
    }
    return ok({
      text,
      provider: config.id,
      cached: false,
      usage: json.usage,
    });
  } catch (error) {
    return err(
      error instanceof Error ? error : new Error(`${config.id} request failed`),
    );
  }
}

export function createOpenAiProvider(proxyUrl: string): LlmProvider {
  return {
    id: 'openai',
    isAvailable: () => Boolean(proxyUrl),
    generate: (messages, options) =>
      callProxy({id: 'openai', proxyUrl}, messages, options),
  };
}

export function createGeminiProvider(proxyUrl: string): LlmProvider {
  return {
    id: 'gemini',
    isAvailable: () => Boolean(proxyUrl),
    generate: (messages, options) =>
      callProxy({id: 'gemini', proxyUrl}, messages, options),
  };
}
