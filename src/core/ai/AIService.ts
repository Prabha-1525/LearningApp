import {ok, type Result} from '@shared/lib';

import {ConversationManager} from './ConversationManager';
import {promptManager} from './PromptManager';
import {responseParser} from './ResponseParser';
import {safetyFilter} from './SafetyFilter';
import type {
  AiGenerateRequest,
  AiGenerateResponse,
  AiMessage,
  AiPromptId,
  AiProviderId,
  AiServiceDeps,
  AIService,
  AnswerChildQuestionRequest,
  ComfortChildRequest,
  EncourageChildRequest,
  ExplainAnswerRequest,
  GenerateHintRequest,
  GenerateLessonRequest,
  GeneratePracticeQuestionsRequest,
  LessonContext,
  SessionMemory,
} from './types';

const OFFLINE_FALLBACKS: Record<AiPromptId, Record<'en' | 'ta', string>> = {
  'chess.hint': {
    ta: 'மெதுவாக பார். ஒரு காயைத் தொட்டு, பிறகு இலக்கைத் தொடு.',
    en: 'Look slowly. Tap a piece, then tap a target square.',
  },
  'chess.explain': {
    ta: 'நல்ல முயற்சி. அந்த காய் அவ்வளவு தூரம் நகர்ந்தது.',
    en: 'Nice try. That piece moved that far.',
  },
  'chess.praise': {
    ta: 'அருமை! நீ நன்றாக முயன்றாய்.',
    en: 'Awesome! You tried so well.',
  },
  'chess.comfort': {
    ta: 'பரவாயில்லை. மீண்டும் விளையாடலாம்.',
    en: 'That is okay. We can try again.',
  },
  'chess.greet': {
    ta: 'வணக்கம்! இன்று சதுரங்கத்தில் ஒரு சிறிய பாடம் கற்போம்.',
    en: 'Hello! Let us learn one small chess idea today.',
  },
  'chess.lesson': {
    ta: 'இன்று ஒரு சிறிய சதுரங்க பாடம். கவனமாக கேள்!',
    en: 'Today is a small chess lesson. Listen carefully!',
  },
  'math.hint': {
    ta: 'Count slowly. Tap each one.',
    en: 'Count slowly. Tap each one.',
  },
  'math.explain': {
    ta: 'Nice try! Look at the correct answer.',
    en: 'Nice try! Look at the correct answer.',
  },
  'math.praise': {
    ta: 'Great job! Well done!',
    en: 'Great job! Well done!',
  },
  'math.comfort': {
    ta: 'That is okay. Let us try again.',
    en: 'That is okay. Let us try again.',
  },
  'math.lesson': {
    ta: 'Hello! Today we play and learn math!',
    en: 'Hello! Today we play and learn math!',
  },
  'math.practice': {
    ta: 'Many kinds of questions will come. Practice as long as you like!',
    en: 'Many kinds of questions will come. Practice as long as you like!',
  },
  'parent.summary': {
    ta: 'இன்று குழந்தை நன்றாக பயிற்சி செய்தது.',
    en: 'Your child practiced well today.',
  },
  'reward.message': {
    ta: 'நட்சத்திரம் கிடைத்தது! அருமை!',
    en: 'You earned a star! Awesome!',
  },
  'general.qa': {
    ta: 'நல்ல கேள்வி! இது கற்றலுக்கான பயன்பாடு.',
    en: 'Good question! This app is for learning.',
  },
};

function fingerprint(
  promptId: AiPromptId,
  variables: Readonly<Record<string, string | number>>,
  locale: string,
  version: number,
): string {
  return JSON.stringify({promptId, variables, locale, version});
}

function baseVariables(
  context: LessonContext,
): Record<string, string | number> {
  return {
    locale: context.locale,
    age: context.childAgeYears,
    lessonTitle: context.lessonTitle,
    module: context.moduleId,
  };
}

function offlineResponse(
  promptId: AiPromptId,
  locale: 'en' | 'ta',
): AiGenerateResponse {
  return {
    text: OFFLINE_FALLBACKS[promptId][locale] ?? OFFLINE_FALLBACKS[promptId].en,
    provider: 'offline',
    cached: false,
  };
}

export function createAIService(
  deps: AiServiceDeps,
  conversationManager: ConversationManager,
): AIService {
  async function generate(
    request: AiGenerateRequest,
  ): Promise<Result<AiGenerateResponse>> {
    if (!safetyFilter.isEducationalContext(request.context.moduleId)) {
      return ok(offlineResponse(request.promptId, request.context.locale));
    }

    const rendered = promptManager.render(request.promptId, request.variables);
    const fp = fingerprint(
      request.promptId,
      request.variables,
      request.context.locale,
      rendered.version,
    );

    const cached = deps.getCached(request.promptId, fp);
    if (cached) {
      return ok(cached);
    }

    if (!deps.tryConsumeLlmSlot()) {
      return ok(offlineResponse(request.promptId, request.context.locale));
    }

    const conversationId =
      request.conversationId ??
      conversationManager.conversationIdFor(request.context);
    conversationManager.bindContext(conversationId, request.context);

    const memorySummary = conversationManager.contextSummary(conversationId);
    const history: AiMessage[] = conversationManager
      .getHistory(conversationId, 6)
      .map(turn => ({
        role: turn.role === 'system' ? 'system' : turn.role,
        content: turn.content,
      }));

    const messages: AiMessage[] = [
      {
        role: 'system',
        content: memorySummary
          ? `${rendered.system}\nSession memory: ${memorySummary}`
          : rendered.system,
      },
      ...history.filter(m => m.role !== 'system'),
      {role: 'user', content: rendered.user},
    ];

    for (const provider of deps.providers) {
      const result = await provider.generate(messages, {
        maxTokens: request.maxTokens,
        temperature: request.temperature,
      });
      if (result.ok) {
        const parsed = responseParser.parse(result.value.text);
        const safeText =
          parsed ||
          offlineResponse(request.promptId, request.context.locale).text;
        const response: AiGenerateResponse = {
          ...result.value,
          text: safeText,
        };
        deps.setCached(request.promptId, fp, response);
        conversationManager.appendExchange({
          conversationId,
          userContent: rendered.user,
          assistantContent: safeText,
          promptId: request.promptId,
          provider: response.provider,
        });
        return ok(response);
      }
    }

    const fallback = offlineResponse(request.promptId, request.context.locale);
    conversationManager.appendExchange({
      conversationId,
      userContent: rendered.user,
      assistantContent: fallback.text,
      promptId: request.promptId,
      provider: 'offline' as AiProviderId,
    });
    return ok(fallback);
  }

  return {
    generateLesson(request: GenerateLessonRequest) {
      const promptId =
        request.context.moduleId === 'math' ? 'math.lesson' : 'chess.lesson';
      return generate({
        promptId,
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          context: request.topic,
        },
      });
    },

    generateHint(request: GenerateHintRequest) {
      const promptId =
        request.context.moduleId === 'math' ? 'math.hint' : 'chess.hint';
      return generate({
        promptId,
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          context: request.situation,
        },
      });
    },

    explainAnswer(request: ExplainAnswerRequest) {
      const promptId =
        request.context.moduleId === 'math' ? 'math.explain' : 'chess.explain';
      return generate({
        promptId,
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          question: request.question,
          childAnswer: request.childAnswer ?? '(none)',
          correctAnswer: request.correctAnswer,
          context: request.correctAnswer,
        },
      });
    },

    encourageChild(request: EncourageChildRequest) {
      const promptId =
        request.context.moduleId === 'math' ? 'math.praise' : 'chess.praise';
      return generate({
        promptId,
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          context: request.success,
        },
      });
    },

    comfortChild(request: ComfortChildRequest) {
      const promptId =
        request.context.moduleId === 'math' ? 'math.comfort' : 'chess.comfort';
      return generate({
        promptId,
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          context: request.mistake,
        },
      });
    },

    generatePracticeQuestions(request: GeneratePracticeQuestionsRequest) {
      return generate({
        promptId: 'math.practice',
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          context: request.skill,
          level: request.difficultyLevel ?? 1,
          count: request.count ?? 5,
        },
      });
    },

    answerChildQuestion(request: AnswerChildQuestionRequest) {
      return generate({
        promptId: 'general.qa',
        context: request.context,
        conversationId: request.conversationId,
        variables: {
          ...baseVariables(request.context),
          context: request.question,
        },
      });
    },

    getSessionMemory(conversationId: string): SessionMemory | null {
      return conversationManager.getSessionMemory(conversationId);
    },

    clearSession(conversationId: string): void {
      conversationManager.clear(conversationId);
    },
  };
}
