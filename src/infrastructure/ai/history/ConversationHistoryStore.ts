import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {ConversationTurn, AiProviderId} from '../types';

const MAX_TURNS_PER_CONVERSATION = 40;

/**
 * Persisted conversation history for coach sessions.
 * Scoped by conversationId (e.g. childId+lessonId).
 */
export class ConversationHistoryStore {
  private key(conversationId: string): string {
    return StorageKeys.module('ai', `history.${conversationId}`);
  }

  get(conversationId: string, limit = 12): readonly ConversationTurn[] {
    const raw = mmkvStorage.getString(this.key(conversationId));
    if (!raw) {
      return [];
    }
    try {
      const turns = JSON.parse(raw) as ConversationTurn[];
      return turns.slice(-limit);
    } catch {
      return [];
    }
  }

  append(turn: ConversationTurn): void {
    const existing = [
      ...this.get(turn.conversationId, MAX_TURNS_PER_CONVERSATION),
    ];
    existing.push(turn);
    const trimmed = existing.slice(-MAX_TURNS_PER_CONVERSATION);
    mmkvStorage.setString(
      this.key(turn.conversationId),
      JSON.stringify(trimmed),
    );
  }

  appendExchange(input: {
    conversationId: string;
    userContent: string;
    assistantContent: string;
    promptId: string;
    provider: string;
  }): void {
    const now = new Date().toISOString();
    this.append({
      id: `u_${Date.now()}`,
      conversationId: input.conversationId,
      role: 'user',
      content: input.userContent,
      createdAt: now,
      promptId: input.promptId,
    });
    this.append({
      id: `a_${Date.now()}`,
      conversationId: input.conversationId,
      role: 'assistant',
      content: input.assistantContent,
      createdAt: now,
      promptId: input.promptId,
      provider: input.provider as AiProviderId,
    });
  }

  clear(conversationId: string): void {
    mmkvStorage.delete(this.key(conversationId));
  }
}

export const conversationHistoryStore = new ConversationHistoryStore();
