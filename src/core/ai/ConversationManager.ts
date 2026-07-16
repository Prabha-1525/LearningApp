import type {ConversationTurn, LessonContext, SessionMemory} from './types';

export type ConversationStorePort = {
  get(conversationId: string, limit?: number): readonly ConversationTurn[];
  appendExchange(input: {
    conversationId: string;
    userContent: string;
    assistantContent: string;
    promptId: string;
    provider: string;
  }): void;
  clear(conversationId: string): void;
};

/**
 * Session-scoped lesson memory so Gemini avoids repeating explanations.
 */
export class ConversationManager {
  private readonly sessionContext = new Map<string, LessonContext>();

  constructor(private readonly store: ConversationStorePort) {}

  conversationIdFor(context: LessonContext, suffix = 'session'): string {
    return `${context.moduleId}.${context.lessonId}.${suffix}`;
  }

  bindContext(conversationId: string, context: LessonContext): void {
    this.sessionContext.set(conversationId, context);
  }

  getSessionMemory(conversationId: string): SessionMemory | null {
    const context = this.sessionContext.get(conversationId);
    if (!context) {
      return null;
    }
    return {
      conversationId,
      context,
      turns: this.store.get(conversationId, 12),
    };
  }

  getHistory(conversationId: string, limit = 6): readonly ConversationTurn[] {
    return this.store.get(conversationId, limit);
  }

  appendExchange(input: {
    conversationId: string;
    userContent: string;
    assistantContent: string;
    promptId: string;
    provider: string;
  }): void {
    this.store.appendExchange(input);
  }

  clear(conversationId: string): void {
    this.store.clear(conversationId);
    this.sessionContext.delete(conversationId);
  }

  contextSummary(conversationId: string): string {
    const memory = this.getSessionMemory(conversationId);
    if (!memory) {
      return '';
    }
    const recent = memory.turns
      .filter(t => t.role === 'assistant')
      .slice(-3)
      .map(t => t.content)
      .join(' | ');
    return `Lesson: ${memory.context.lessonTitle}. Recent coach lines: ${recent}`;
  }
}
