import {ok, type Result} from '@shared/lib';

import {aiResponseCache, fingerprintVariables} from './cache/AiResponseCache';
import {conversationHistoryStore} from './history/ConversationHistoryStore';
import {promptManager} from './prompts/PromptManager';
import {
  createGeminiProvider,
  createOpenAiProvider,
} from './providers/LlmProviders';
import {llmRateLimiter, ttsRateLimiter} from './resilience/RateLimiter';
import {offlineFallbackText} from './resilience/OfflineFallback';
import {createTamilTtsProvider} from './tts/TamilTtsProvider';
import type {
  AiGateway,
  AiProviderId,
  LlmGenerateRequest,
  LlmGenerateResponse,
  LlmMessage,
  LlmProvider,
  TtsProvider,
  TtsSynthesizeRequest,
  TtsSynthesizeResponse,
} from './types';

export type AiGatewayDeps = {
  readonly openAiProxyUrl: string;
  readonly geminiProxyUrl: string;
  readonly ttsProxyUrl: string;
  /** Prefer openai when both proxies are configured. */
  readonly preferredProvider?: 'openai' | 'gemini';
  readonly openAi?: LlmProvider;
  readonly gemini?: LlmProvider;
  readonly tts?: TtsProvider;
};

function orderedProviders(deps: AiGatewayDeps): LlmProvider[] {
  const openAi = deps.openAi ?? createOpenAiProvider(deps.openAiProxyUrl);
  const gemini = deps.gemini ?? createGeminiProvider(deps.geminiProxyUrl);
  const prefer = deps.preferredProvider ?? 'openai';
  return prefer === 'gemini'
    ? [gemini, openAi].filter(p => p.isAvailable())
    : [openAi, gemini].filter(p => p.isAvailable());
}

/**
 * Facade composing prompts, history, cache, rate limits, retry (in providers),
 * offline fallback, and Tamil TTS.
 */
export function createAiGateway(deps: AiGatewayDeps): AiGateway {
  const tts = deps.tts ?? createTamilTtsProvider(deps.ttsProxyUrl);

  return {
    async generateText(
      request: LlmGenerateRequest,
    ): Promise<Result<LlmGenerateResponse>> {
      const rendered = promptManager.render(
        request.promptId,
        request.variables,
      );
      const fingerprint = fingerprintVariables({
        ...request.variables,
        locale: request.locale,
        promptVersion: rendered.version,
      });

      const cached = aiResponseCache.get(request.promptId, fingerprint);
      if (cached) {
        return ok(cached);
      }

      if (!llmRateLimiter.tryRemove()) {
        return ok(offlineFallbackText(request.promptId, request.locale));
      }

      const historyMessages: LlmMessage[] = request.conversationId
        ? conversationHistoryStore.get(request.conversationId, 6).map(turn => ({
            role: turn.role === 'system' ? 'system' : turn.role,
            content: turn.content,
          }))
        : [];

      const messages: LlmMessage[] = [
        {role: 'system', content: rendered.system},
        ...historyMessages.filter(m => m.role !== 'system'),
        {role: 'user', content: rendered.user},
      ];

      const providers = orderedProviders(deps);

      for (const provider of providers) {
        const result = await provider.generate(messages, {
          maxTokens: request.maxTokens,
          temperature: request.temperature,
        });
        if (result.ok) {
          aiResponseCache.set(request.promptId, fingerprint, result.value);
          if (request.conversationId) {
            conversationHistoryStore.appendExchange({
              conversationId: request.conversationId,
              userContent: rendered.user,
              assistantContent: result.value.text,
              promptId: request.promptId,
              provider: result.value.provider,
            });
          }
          return result;
        }
      }

      const fallback = offlineFallbackText(request.promptId, request.locale);
      if (request.conversationId) {
        conversationHistoryStore.appendExchange({
          conversationId: request.conversationId,
          userContent: rendered.user,
          assistantContent: fallback.text,
          promptId: request.promptId,
          provider: 'offline' as AiProviderId,
        });
      }
      return ok(fallback);
    },

    async synthesizeTamilSpeech(
      request: TtsSynthesizeRequest,
    ): Promise<Result<TtsSynthesizeResponse>> {
      if (!ttsRateLimiter.tryRemove()) {
        return ok({
          audioUri: `offline://tts/${encodeURIComponent(request.text)}`,
          durationMs: null,
          cached: false,
          provider: 'offline_pack',
        });
      }
      return tts.synthesize(request);
    },

    getConversationHistory(conversationId, limit) {
      return conversationHistoryStore.get(conversationId, limit);
    },

    clearConversation(conversationId) {
      conversationHistoryStore.clear(conversationId);
    },
  };
}
