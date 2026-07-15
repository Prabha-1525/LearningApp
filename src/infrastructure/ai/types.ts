import type {Result} from '@shared/lib';

export type AiProviderId = 'openai' | 'gemini' | 'offline';

export type AiLocale = 'en' | 'ta';

export type PromptId =
  | 'coach.hint'
  | 'coach.explain'
  | 'coach.praise'
  | 'coach.comfort'
  | 'coach.greet';

export type PromptTemplate = {
  readonly id: PromptId;
  readonly version: number;
  readonly system: string;
  readonly userTemplate: string;
};

export type LlmMessage = {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
};

export type LlmGenerateRequest = {
  readonly promptId: PromptId;
  readonly variables: Readonly<Record<string, string | number>>;
  readonly locale: AiLocale;
  readonly conversationId?: string;
  readonly childId?: string;
  readonly maxTokens?: number;
  readonly temperature?: number;
};

export type LlmGenerateResponse = {
  readonly text: string;
  readonly provider: AiProviderId;
  readonly cached: boolean;
  readonly usage?: {
    readonly promptTokens?: number;
    readonly completionTokens?: number;
  };
};

export type TtsSynthesizeRequest = {
  readonly text: string;
  readonly locale: 'ta';
  readonly voiceId?: string;
  readonly speechRate?: number;
};

export type TtsSynthesizeResponse = {
  readonly audioUri: string;
  readonly durationMs: number | null;
  readonly cached: boolean;
  readonly provider: 'proxy' | 'device' | 'offline_pack';
};

export type ConversationTurn = {
  readonly id: string;
  readonly conversationId: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly createdAt: string;
  readonly promptId?: PromptId;
  readonly provider?: AiProviderId;
};

export type LlmProvider = {
  readonly id: AiProviderId;
  isAvailable(): boolean;
  generate(
    messages: readonly LlmMessage[],
    options?: {maxTokens?: number; temperature?: number},
  ): Promise<Result<LlmGenerateResponse>>;
};

export type TtsProvider = {
  isAvailable(): boolean;
  synthesize(
    request: TtsSynthesizeRequest,
  ): Promise<Result<TtsSynthesizeResponse>>;
};

export type AiGateway = {
  generateText(
    request: LlmGenerateRequest,
  ): Promise<Result<LlmGenerateResponse>>;
  synthesizeTamilSpeech(
    request: TtsSynthesizeRequest,
  ): Promise<Result<TtsSynthesizeResponse>>;
  getConversationHistory(
    conversationId: string,
    limit?: number,
  ): readonly ConversationTurn[];
  clearConversation(conversationId: string): void;
};
