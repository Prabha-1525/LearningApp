import {env} from '@app/config/env';

import {createAiGateway} from './AiGateway';
import {aiService} from './composition/createAIService';
import {createCoachPort} from './CoachPortAdapter';

export type {AiGateway, AiProviderId, PromptId} from './types';
export type {AIService, LessonContext, AiModuleId} from '@core/ai';
export {createAiGateway} from './AiGateway';
export {createCoachPort} from './CoachPortAdapter';
export {aiService, conversationManager} from './composition/createAIService';
export {promptManager} from './prompts/PromptManager';
export {conversationHistoryStore} from './history/ConversationHistoryStore';
export {aiResponseCache} from './cache/AiResponseCache';
export {tokenManager} from './security/TokenManager';
export {assertNoVendorSecretsInEnv, secureFetch} from './security/ApiSecurity';
export {withRetry, HttpStatusError} from './resilience/RetryStrategy';
export {llmRateLimiter, ttsRateLimiter} from './resilience/RateLimiter';
export {offlineFallbackText} from './resilience/OfflineFallback';

/**
 * App-wide AI composition root.
 * Gemini SDK is primary when GEMINI_API_KEY is set; proxy URLs are fallback.
 */
export const aiGateway = createAiGateway({
  openAiProxyUrl: env.openAiProxyUrl,
  geminiProxyUrl: env.geminiProxyUrl,
  ttsProxyUrl: env.ttsProxyUrl,
  preferredProvider: env.preferredAiProvider,
});

export const coachPort = createCoachPort(aiService);
