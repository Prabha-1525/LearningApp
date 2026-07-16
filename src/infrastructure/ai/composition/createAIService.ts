import {
  ConversationManager,
  createAIService,
  type AiProviderPort,
  type AIService,
  AiProviderId,
} from '@core/ai';
import {env} from '@app/config/env';

import {aiResponseCache} from '../cache/AiResponseCache';
import {conversationHistoryStore} from '../history/ConversationHistoryStore';
import {
  createGeminiProvider,
  createOpenAiProvider,
} from '../providers/LlmProviders';
import {createGeminiSdkProvider} from '../providers/GeminiSdkProvider';
import {llmRateLimiter} from '../resilience/RateLimiter';

function proxyToAiProvider(
  proxy: ReturnType<typeof createGeminiProvider>,
): AiProviderPort {
  return {
    id: proxy.id as AiProviderId,
    isAvailable: () => proxy.isAvailable(),
    generate: (messages, options) => proxy.generate(messages, options),
  };
}

function orderedProviders(): AiProviderPort[] {
  const sdk = createGeminiSdkProvider({
    apiKey: env.geminiApiKey,
    model: env.geminiModel,
  });
  const geminiProxy = proxyToAiProvider(
    createGeminiProvider(env.geminiProxyUrl),
  );
  const openAiProxy = proxyToAiProvider(
    createOpenAiProvider(env.openAiProxyUrl),
  );

  const preferGemini = env.preferredAiProvider === 'gemini';
  const chain = preferGemini
    ? [sdk, geminiProxy, openAiProxy]
    : [sdk, geminiProxy, openAiProxy];

  return chain.filter(provider => provider.isAvailable());
}

const conversationManager = new ConversationManager({
  get: (conversationId, limit) =>
    conversationHistoryStore.get(conversationId, limit),
  appendExchange: input =>
    conversationHistoryStore.appendExchange({
      conversationId: input.conversationId,
      userContent: input.userContent,
      assistantContent: input.assistantContent,
      promptId: input.promptId,
      provider: input.provider as never,
    }),
  clear: conversationId => conversationHistoryStore.clear(conversationId),
});

export function createAppAIService(): AIService {
  return createAIService(
    {
      providers: orderedProviders(),
      getHistory: (conversationId, limit) =>
        conversationHistoryStore.get(conversationId, limit),
      appendExchange: input =>
        conversationHistoryStore.appendExchange({
          conversationId: input.conversationId,
          userContent: input.userContent,
          assistantContent: input.assistantContent,
          promptId: input.promptId as never,
          provider: input.provider as never,
        }),
      getCached: (promptId, fingerprint) => {
        const hit = aiResponseCache.get(promptId, fingerprint);
        return hit
          ? {
              text: hit.text,
              provider: hit.provider as AiProviderId,
              cached: hit.cached,
              usage: hit.usage,
            }
          : null;
      },
      setCached: (promptId, fingerprint, response) => {
        aiResponseCache.set(promptId, fingerprint, {
          text: response.text,
          provider: response.provider as never,
          cached: response.cached,
          usage: response.usage,
        });
      },
      tryConsumeLlmSlot: () => llmRateLimiter.tryRemove(),
    },
    conversationManager,
  );
}

export const aiService = createAppAIService();
export {conversationManager};
