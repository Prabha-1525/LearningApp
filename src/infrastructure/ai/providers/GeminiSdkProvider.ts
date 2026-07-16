import {GoogleGenerativeAI} from '@google/generative-ai';

import {err, ok} from '@shared/lib';
import type {AiGenerateResponse, AiMessage, AiProviderPort} from '@core/ai';

import {withRetry} from '../resilience/RetryStrategy';

export type GeminiSdkConfig = {
  readonly apiKey: string;
  readonly model?: string;
  readonly timeoutMs?: number;
};

function toPrompt(messages: readonly AiMessage[]): string {
  return messages
    .map(message => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n\n');
}

/**
 * Direct Gemini SDK provider (dev / trusted builds).
 * Production should prefer a backend proxy when possible.
 */
export function createGeminiSdkProvider(
  config: GeminiSdkConfig,
): AiProviderPort {
  const modelName = config.model ?? 'gemini-2.0-flash';

  return {
    id: 'gemini',
    isAvailable: () => Boolean(config.apiKey?.trim()),
    async generate(messages, options) {
      if (!config.apiKey?.trim()) {
        return err(new Error('Gemini API key is not configured'));
      }

      try {
        const client = new GoogleGenerativeAI(config.apiKey.trim());
        const model = client.getGenerativeModel({
          model: modelName,
          generationConfig: {
            maxOutputTokens: options?.maxTokens ?? 120,
            temperature: options?.temperature ?? 0.35,
          },
        });

        const prompt = toPrompt(messages);
        const response = await withRetry(
          async () => {
            const controller = new AbortController();
            const timer = setTimeout(
              () => controller.abort(),
              config.timeoutMs ?? 20_000,
            );
            try {
              const result = await model.generateContent(prompt);
              return result;
            } finally {
              clearTimeout(timer);
            }
          },
          {retries: 2, baseDelayMs: 400, maxDelayMs: 1200},
        );

        const text = response.response.text()?.trim();
        if (!text) {
          return err(new Error('Gemini returned empty text'));
        }

        return ok({
          text,
          provider: 'gemini',
          cached: false,
        } satisfies AiGenerateResponse);
      } catch (error) {
        return err(
          error instanceof Error
            ? error
            : new Error('Gemini SDK request failed'),
        );
      }
    },
  };
}
