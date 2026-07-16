import {ok} from '@shared/lib';

import {createAiGateway} from '../AiGateway';
import {createCoachPort} from '../CoachPortAdapter';
import {aiService} from '../composition/createAIService';
import {assertNoVendorSecretsInEnv} from '../security/ApiSecurity';
import {promptManager} from '../prompts/PromptManager';
import {offlineFallbackText} from '../resilience/OfflineFallback';
import {RateLimiter} from '../resilience/RateLimiter';
import {HttpStatusError, withRetry} from '../resilience/RetryStrategy';
import type {LlmProvider} from '../types';

describe('PromptManager', () => {
  it('renders coach hint variables', () => {
    const rendered = promptManager.render('coach.hint', {
      locale: 'ta',
      age: 6,
      lesson: 'chess',
      context: 'pawn',
    });
    expect(rendered.user).toContain('Locale: ta');
    expect(rendered.user).toContain('Age: 6');
    expect(rendered.system.length).toBeGreaterThan(10);
  });
});

describe('OfflineFallback', () => {
  it('returns Tamil coach lines', () => {
    const result = offlineFallbackText('coach.greet', 'ta');
    expect(result.provider).toBe('offline');
    expect(result.text).toContain('வணக்கம்');
  });
});

describe('RateLimiter', () => {
  it('blocks when capacity exhausted', () => {
    const limiter = new RateLimiter(2, 0);
    expect(limiter.tryRemove()).toBe(true);
    expect(limiter.tryRemove()).toBe(true);
    expect(limiter.tryRemove()).toBe(false);
  });
});

describe('RetryStrategy', () => {
  it('retries then succeeds', async () => {
    let attempts = 0;
    const value = await withRetry(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw new HttpStatusError(503, 'busy');
        }
        return 'ok';
      },
      {retries: 3, baseDelayMs: 1, maxDelayMs: 2},
    );
    expect(value).toBe('ok');
    expect(attempts).toBe(3);
  });
});

describe('ApiSecurity', () => {
  it('rejects vendor secrets in client env', () => {
    expect(() =>
      assertNoVendorSecretsInEnv({OPENAI_API_KEY: 'sk-test'}),
    ).toThrow(/proxy/);
  });
});

describe('AiGateway', () => {
  it('falls back offline when no proxies are configured', async () => {
    const gateway = createAiGateway({
      openAiProxyUrl: '',
      geminiProxyUrl: '',
      ttsProxyUrl: '',
    });

    const result = await gateway.generateText({
      promptId: 'coach.praise',
      locale: 'en',
      conversationId: 'test-convo',
      variables: {
        locale: 'en',
        age: 6,
        context: 'captured a piece',
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.provider).toBe('offline');
      expect(result.value.text.length).toBeGreaterThan(0);
    }
    expect(gateway.getConversationHistory('test-convo').length).toBe(2);
  });

  it('uses LLM provider when available and caches', async () => {
    const fake: LlmProvider = {
      id: 'openai',
      isAvailable: () => true,
      generate: async () =>
        ok({
          text: 'Nice move!',
          provider: 'openai',
          cached: false,
        }),
    };

    const gateway = createAiGateway({
      openAiProxyUrl: 'https://proxy.example/openai',
      geminiProxyUrl: '',
      ttsProxyUrl: '',
      openAi: fake,
    });

    const first = await gateway.generateText({
      promptId: 'coach.explain',
      locale: 'en',
      variables: {locale: 'en', age: 6, move: 'e2e4', context: 'opening'},
    });
    expect(first.ok && first.value.text).toBe('Nice move!');
    expect(first.ok && first.value.cached).toBe(false);

    const second = await gateway.generateText({
      promptId: 'coach.explain',
      locale: 'en',
      variables: {locale: 'en', age: 6, move: 'e2e4', context: 'opening'},
    });
    expect(second.ok && second.value.cached).toBe(true);
    expect(second.ok && second.value.text).toBe('Nice move!');
  });

  it('synthesizes offline TTS pack without proxy', async () => {
    const gateway = createAiGateway({
      openAiProxyUrl: '',
      geminiProxyUrl: '',
      ttsProxyUrl: '',
    });
    const result = await gateway.synthesizeTamilSpeech({
      text: 'வணக்கம்',
      locale: 'ta',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.provider).toBe('offline_pack');
      expect(result.value.audioUri).toContain('offline://tts/');
    }
  });
});

describe('CoachPortAdapter', () => {
  it('maps hint requests through aiService', async () => {
    const coach = createCoachPort(aiService);
    const result = await coach.requestHint({
      moduleId: 'chess',
      context: 'stuck on pawn move',
      childAgeYears: 6,
      locale: 'ta',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.difficulty).toBe('gentle');
      expect(result.value.message.length).toBeGreaterThan(0);
    }
  });
});
