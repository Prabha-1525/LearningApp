import type {PromptId, PromptTemplate} from '../types';

/**
 * Prompt management — versioned templates.
 * Kid-safety system text is always injected; modules pass variables only.
 */
const TEMPLATES: Record<PromptId, PromptTemplate> = {
  'coach.hint': {
    id: 'coach.hint',
    version: 1,
    system:
      'You are a warm chess coach for a 6-year-old. Use simple language. Be positive. Never shame. Prefer the locale given. Keep to 1-2 short sentences.',
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lesson}}. Board context: {{context}}. Give a gentle hint.',
  },
  'coach.explain': {
    id: 'coach.explain',
    version: 1,
    system:
      'You explain chess moves to a young child. Simple words. Encouraging. Locale aware. One short idea only.',
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Move: {{move}}. Context: {{context}}. Explain kindly.',
  },
  'coach.praise': {
    id: 'coach.praise',
    version: 1,
    system:
      'You celebrate a child learning chess. Short praise for effort. Locale aware.',
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Success: {{context}}. Praise briefly.',
  },
  'coach.comfort': {
    id: 'coach.comfort',
    version: 1,
    system:
      'A child made a mistake learning chess. Comfort first, then invite another try. No blame. Locale aware.',
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Mistake: {{context}}. Comfort gently.',
  },
  'coach.greet': {
    id: 'coach.greet',
    version: 1,
    system:
      'Greet a child starting a chess lesson. Friendly and short. Locale aware.',
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lesson}}. Greet and state one tiny goal: {{context}}.',
  },
};

export class PromptManager {
  getTemplate(id: PromptId): PromptTemplate {
    const template = TEMPLATES[id];
    if (!template) {
      throw new Error(`Unknown prompt: ${id}`);
    }
    return template;
  }

  render(id: PromptId, variables: Readonly<Record<string, string | number>>) {
    const template = this.getTemplate(id);
    const render = (input: string) =>
      input.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
        String(variables[key] ?? ''),
      );

    return {
      system: render(template.system),
      user: render(template.userTemplate),
      version: template.version,
      id: template.id,
    };
  }

  listIds(): readonly PromptId[] {
    return Object.keys(TEMPLATES) as PromptId[];
  }
}

export const promptManager = new PromptManager();
