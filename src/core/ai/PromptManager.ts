import type {AiPromptId, AiPromptTemplate} from './types';

const CHILD_SAFETY_SYSTEM =
  'You are a warm educational coach for children aged 5-8. ' +
  'Use only simple, kind, child-safe language. ' +
  'Answer educational questions only. Never discuss violence, adult topics, or scary content. ' +
  'Keep responses to 1-2 short sentences. ' +
  'When locale is ta, respond in spoken Tamil suitable for young children. ' +
  'When locale is en, use very simple English. Never shame the child.';

const MATH_COACH_SYSTEM =
  'You are a friendly English-speaking kindergarten math teacher for children aged 5-8. ' +
  'Use ONLY simple English. Speak slowly and clearly. Keep sentences short (3-8 words). ' +
  'Use positive words: Great job, Well done, Try again, Look, Count, Tap, Find. ' +
  'Never use hard words like identify, calculate, evaluate, incorrect, or accuracy. ' +
  'Use fruits, toys, animals, balloons, and stars in examples. ' +
  'Encourage after every answer. Never criticize mistakes. ' +
  'Make learning feel like a fun game. Educational math only.';

function coachSystem(extra: string): string {
  return CHILD_SAFETY_SYSTEM + ' ' + extra;
}

function mathCoachSystem(extra: string): string {
  return MATH_COACH_SYSTEM + ' ' + extra;
}

const TEMPLATES: Record<AiPromptId, AiPromptTemplate> = {
  'chess.hint': {
    id: 'chess.hint',
    version: 1,
    system: coachSystem('You coach chess gently.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lessonTitle}}. Board: {{context}}. Give one gentle hint.',
  },
  'chess.explain': {
    id: 'chess.explain',
    version: 1,
    system: coachSystem('Explain one chess idea simply.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Move/context: {{context}}. Explain kindly in one idea.',
  },
  'chess.praise': {
    id: 'chess.praise',
    version: 1,
    system: coachSystem('Celebrate effort, not only winning.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Success: {{context}}. Praise briefly.',
  },
  'chess.comfort': {
    id: 'chess.comfort',
    version: 1,
    system: coachSystem('Comfort after a mistake; invite another try.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Mistake: {{context}}. Comfort gently.',
  },
  'chess.greet': {
    id: 'chess.greet',
    version: 1,
    system: coachSystem('Greet a child starting chess.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lessonTitle}}. Greet and state one tiny goal: {{context}}.',
  },
  'chess.lesson': {
    id: 'chess.lesson',
    version: 1,
    system: coachSystem('Introduce a chess lesson in one short paragraph.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lessonTitle}}. Topic: {{context}}. Teach the first step.',
  },
  'math.hint': {
    id: 'math.hint',
    version: 3,
    system: mathCoachSystem(
      'Give one gentle hint using fruits, toys, or animals. One short step only. English only.',
    ),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lessonTitle}}. Problem: {{context}}. Hint like a fun game, not a test.',
  },
  'math.explain': {
    id: 'math.explain',
    version: 3,
    system: mathCoachSystem(
      'Explain the correct answer step by step. Never criticize. English only.',
    ),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Question: {{question}}. Child answer: {{childAnswer}}. Correct: {{correctAnswer}}. Explain kindly with a simple example.',
  },
  'math.praise': {
    id: 'math.praise',
    version: 3,
    system: mathCoachSystem(
      'Celebrate warmly after a correct answer. Simple English only.',
    ),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Success: {{context}}. Praise briefly in simple English.',
  },
  'math.comfort': {
    id: 'math.comfort',
    version: 3,
    system: mathCoachSystem(
      'Comfort after a wrong answer. Invite another try. English only.',
    ),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Mistake: {{context}}. Comfort gently and encourage retry.',
  },
  'math.lesson': {
    id: 'math.lesson',
    version: 3,
    system: mathCoachSystem(
      'Open the lesson like a fun game. Use fruits, toys, or balloons. English only.',
    ),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson: {{lessonTitle}}. Topic: {{context}}. Greet warmly and teach the first tiny step.',
  },
  'math.practice': {
    id: 'math.practice',
    version: 3,
    system: mathCoachSystem(
      'Suggest playful practice with stars, animals, or balloons. English only.',
    ),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Skill: {{context}}. Level: {{level}}. Count: {{count}}. Describe fun practice briefly.',
  },
  'parent.summary': {
    id: 'parent.summary',
    version: 1,
    system:
      'Summarize a child learning session for parents. Positive, factual, brief.',
    userTemplate:
      'Locale: {{locale}}. Module: {{context}}. Stats: {{stats}}. Write a short parent summary.',
  },
  'reward.message': {
    id: 'reward.message',
    version: 1,
    system: coachSystem('Celebrate stars or XP earned.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Reward: {{context}}. Short celebration message.',
  },
  'general.qa': {
    id: 'general.qa',
    version: 1,
    system: coachSystem('Answer only child-appropriate educational questions.'),
    userTemplate:
      'Locale: {{locale}}. Age: {{age}}. Lesson context: {{lessonTitle}}. Child asks: {{context}}',
  },
};

export class PromptManager {
  render(
    promptId: AiPromptId,
    variables: Readonly<Record<string, string | number>>,
  ): {system: string; user: string; version: number} {
    const template = TEMPLATES[promptId];
    let user = template.userTemplate;
    for (const [key, value] of Object.entries(variables)) {
      user = user.split(`{{${key}}}`).join(String(value));
    }
    return {system: template.system, user, version: template.version};
  }
}

export const promptManager = new PromptManager();
