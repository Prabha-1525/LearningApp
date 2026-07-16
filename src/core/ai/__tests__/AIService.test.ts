import {ok} from '@shared/lib';

import {createAIService} from '../AIService';
import {ConversationManager} from '../ConversationManager';
import {promptManager} from '../PromptManager';
import {safetyFilter} from '../SafetyFilter';
import {responseParser} from '../ResponseParser';
import type {AiProviderPort} from '../types';

describe('core ai PromptManager', () => {
  it('renders math hint variables', () => {
    const rendered = promptManager.render('math.hint', {
      locale: 'ta',
      age: 6,
      lessonTitle: 'Counting',
      context: 'count 7 apples',
    });
    expect(rendered.user).toContain('Counting');
    expect(rendered.system).toContain(
      'English-speaking kindergarten math teacher',
    );
    expect(rendered.system).toContain('fun game');
  });
});

describe('SafetyFilter', () => {
  it('blocks unsafe words', () => {
    expect(safetyFilter.sanitize('hello friend')).toBe('hello friend');
    expect(safetyFilter.sanitize('talk about a weapon')).toBe('');
  });
});

describe('ResponseParser', () => {
  it('keeps short child-friendly text', () => {
    const parsed = responseParser.parse(
      '**Great!** You counted well.\n\nMore text.',
    );
    expect(parsed).toContain('Great!');
    expect(parsed.length).toBeLessThan(200);
  });
});

describe('AIService', () => {
  const fakeProvider: AiProviderPort = {
    id: 'gemini',
    isAvailable: () => true,
    generate: async () =>
      ok({
        text: 'சூப்பர்!',
        provider: 'gemini',
        cached: false,
      }),
  };

  it('generates hints through provider', async () => {
    const store = {
      turns: [] as Array<{
        conversationId: string;
        userContent: string;
        assistantContent: string;
        promptId: string;
        provider: string;
      }>,
      get: () => [],
      appendExchange: (input: {
        conversationId: string;
        userContent: string;
        assistantContent: string;
        promptId: string;
        provider: string;
      }) => {
        store.turns.push(input);
      },
      clear: () => {
        store.turns = [];
      },
    };
    const conversationManager = new ConversationManager(store);
    const cache = new Map<string, unknown>();
    const service = createAIService(
      {
        providers: [fakeProvider],
        getHistory: () => [],
        appendExchange: store.appendExchange,
        getCached: () => null,
        setCached: (promptId, fingerprint, response) => {
          cache.set(`${promptId}:${fingerprint}`, response);
        },
        tryConsumeLlmSlot: () => true,
      },
      conversationManager,
    );

    const result = await service.generateHint({
      context: {
        moduleId: 'math',
        lessonId: 'counting',
        lessonTitle: 'Counting',
        childAgeYears: 6,
        locale: 'ta',
      },
      situation: 'count balloons',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.text).toBe('சூப்பர்!');
    }
  });
});
