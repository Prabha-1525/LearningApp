import type {Result} from '@shared/lib';

export type AiLocale = 'en' | 'ta';

export type AiModuleId =
  | 'chess'
  | 'math'
  | 'english'
  | 'tamil'
  | 'science'
  | 'general';

export type AiProviderId = 'gemini' | 'openai' | 'offline';

export type AiPromptId =
  | 'chess.hint'
  | 'chess.explain'
  | 'chess.praise'
  | 'chess.comfort'
  | 'chess.greet'
  | 'chess.lesson'
  | 'math.hint'
  | 'math.explain'
  | 'math.praise'
  | 'math.comfort'
  | 'math.lesson'
  | 'math.practice'
  | 'parent.summary'
  | 'reward.message'
  | 'general.qa';

export type AiPromptTemplate = {
  readonly id: AiPromptId;
  readonly version: number;
  readonly system: string;
  readonly userTemplate: string;
};

export type AiMessage = {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
};

export type LessonContext = {
  readonly moduleId: AiModuleId;
  readonly lessonId: string;
  readonly lessonTitle: string;
  readonly childAgeYears: number;
  readonly locale: AiLocale;
};

export type AiGenerateRequest = {
  readonly promptId: AiPromptId;
  readonly variables: Readonly<Record<string, string | number>>;
  readonly context: LessonContext;
  readonly conversationId?: string;
  readonly maxTokens?: number;
  readonly temperature?: number;
};

export type AiGenerateResponse = {
  readonly text: string;
  readonly provider: AiProviderId;
  readonly cached: boolean;
  readonly usage?: {
    readonly promptTokens?: number;
    readonly completionTokens?: number;
  };
};

export type GenerateLessonRequest = {
  readonly context: LessonContext;
  readonly topic: string;
  readonly conversationId?: string;
};

export type GenerateHintRequest = {
  readonly context: LessonContext;
  readonly situation: string;
  readonly conversationId?: string;
};

export type ExplainAnswerRequest = {
  readonly context: LessonContext;
  readonly question: string;
  readonly childAnswer?: string;
  readonly correctAnswer: string;
  readonly conversationId?: string;
};

export type EncourageChildRequest = {
  readonly context: LessonContext;
  readonly success: string;
  readonly conversationId?: string;
};

export type ComfortChildRequest = {
  readonly context: LessonContext;
  readonly mistake: string;
  readonly conversationId?: string;
};

export type GeneratePracticeQuestionsRequest = {
  readonly context: LessonContext;
  readonly skill: string;
  readonly count?: number;
  readonly difficultyLevel?: number;
  readonly conversationId?: string;
};

export type AnswerChildQuestionRequest = {
  readonly context: LessonContext;
  readonly question: string;
  readonly conversationId?: string;
};

export type ConversationTurn = {
  readonly id: string;
  readonly conversationId: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly createdAt: string;
  readonly promptId?: string;
  readonly provider?: string;
};

export type SessionMemory = {
  readonly conversationId: string;
  readonly context: LessonContext;
  readonly turns: readonly ConversationTurn[];
};

export type AiProviderPort = {
  readonly id: AiProviderId;
  isAvailable(): boolean;
  generate(
    messages: readonly AiMessage[],
    options?: {maxTokens?: number; temperature?: number},
  ): Promise<Result<AiGenerateResponse>>;
};

export type AiServiceDeps = {
  readonly providers: readonly AiProviderPort[];
  readonly getHistory: (
    conversationId: string,
    limit?: number,
  ) => readonly ConversationTurn[];
  readonly appendExchange: (input: {
    conversationId: string;
    userContent: string;
    assistantContent: string;
    promptId: AiPromptId;
    provider: AiProviderId;
  }) => void;
  readonly getCached: (
    promptId: AiPromptId,
    fingerprint: string,
  ) => AiGenerateResponse | null;
  readonly setCached: (
    promptId: AiPromptId,
    fingerprint: string,
    response: AiGenerateResponse,
  ) => void;
  readonly tryConsumeLlmSlot: () => boolean;
};

export type AIService = {
  generateLesson(
    request: GenerateLessonRequest,
  ): Promise<Result<AiGenerateResponse>>;
  generateHint(
    request: GenerateHintRequest,
  ): Promise<Result<AiGenerateResponse>>;
  explainAnswer(
    request: ExplainAnswerRequest,
  ): Promise<Result<AiGenerateResponse>>;
  encourageChild(
    request: EncourageChildRequest,
  ): Promise<Result<AiGenerateResponse>>;
  comfortChild(
    request: ComfortChildRequest,
  ): Promise<Result<AiGenerateResponse>>;
  generatePracticeQuestions(
    request: GeneratePracticeQuestionsRequest,
  ): Promise<Result<AiGenerateResponse>>;
  answerChildQuestion(
    request: AnswerChildQuestionRequest,
  ): Promise<Result<AiGenerateResponse>>;
  getSessionMemory(conversationId: string): SessionMemory | null;
  clearSession(conversationId: string): void;
};
