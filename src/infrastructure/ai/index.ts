import {env} from '@app/config/env';

import {createAiGateway} from './AiGateway';
import {createCoachPort} from './CoachPortAdapter';

export type {AiGateway, AiProviderId, PromptId} from './types';
export {createAiGateway} from './AiGateway';
export {createCoachPort} from './CoachPortAdapter';
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
 * Secrets never live here — only proxy URLs from env.
 */
export const aiGateway = createAiGateway({
  openAiProxyUrl: env.openAiProxyUrl,
  geminiProxyUrl: env.geminiProxyUrl,
  ttsProxyUrl: env.ttsProxyUrl,
  preferredProvider: env.preferredAiProvider,
});

export const coachPort = createCoachPort(aiGateway);
