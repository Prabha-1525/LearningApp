import type {DifficultyLevel, MathChoice} from '../generators/types';
import {OBJECT_POOLS} from '../generators/catalog';
import {
  makeChoices,
  pickOne,
  randInt,
  validateChoices,
} from '../generators/random';
import {englishCountAloud} from './englishNumberWords';
import {numbersRange} from './numbersRange';

export type CoachLine = {
  readonly text: string;
};

/** Varied teach-first activities for unlimited practice. */
export type LearnNumbersActivityMode = 'learn' | 'find' | 'count';

export type LearnNumbersQuestion = {
  readonly id: string;
  readonly number: number;
  readonly level: DifficultyLevel;
  readonly activityMode: LearnNumbersActivityMode;
  readonly emoji: string;
  readonly objectLabelEn: string;
  readonly emojis: readonly string[];
  readonly countWords: readonly string[];
  readonly teachLines: readonly CoachLine[];
  readonly welcomeLine: string;
  readonly showObjectsLine: string;
  readonly tapCountLine: string;
  readonly afterCountLine: string;
  readonly askLine: string;
  readonly explainLine: string;
  readonly praiseLine: string;
  readonly retryLine: string;
  readonly choices: readonly MathChoice[];
  readonly tapToCount: boolean;
};

const ACTIVITY_MODES: LearnNumbersActivityMode[] = ['learn', 'find', 'count'];

function distractorsFor(answer: number, level: DifficultyLevel): string[] {
  const range = numbersRange(level);
  const set = new Set<string>();
  while (set.size < 8) {
    const n = randInt(range.min, range.max);
    if (n !== answer) {
      set.add(String(n));
    }
  }
  return [...set];
}

function buildChoices(number: number, level: DifficultyLevel): MathChoice[] {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const choices = makeChoices(
      String(number),
      distractorsFor(number, level),
      4,
    );
    if (validateChoices(choices, String(number), 4)) {
      return choices;
    }
  }
  return makeChoices(String(number), distractorsFor(number, level), 4);
}

function pickActivityMode(level: DifficultyLevel): LearnNumbersActivityMode {
  if (level === 1) {
    return pickOne(['learn', 'learn', 'find', 'count'] as const);
  }
  return pickOne(ACTIVITY_MODES);
}

function buildCoachCopy(
  mode: LearnNumbersActivityMode,
  objectLabelEn: string,
  emoji: string,
): {
  teachLines: CoachLine[];
  welcomeLine: string;
  showObjectsLine: string;
  tapCountLine: string;
  afterCountLine: string;
  askLine: string;
  explainLine: string;
  praiseLine: string;
  retryLine: string;
} {
  const showObjectsLine = `Look at these ${objectLabelEn}. ${emoji}`;
  const teachLines: CoachLine[] = [
    {text: 'Look carefully.'},
    {text: showObjectsLine},
  ];

  switch (mode) {
    case 'find':
      return {
        teachLines,
        welcomeLine: 'Let us find a number!',
        showObjectsLine,
        tapCountLine: 'Tap each one!',
        afterCountLine: 'Great! You counted them all!',
        askLine: 'Choose the right number!',
        explainLine: 'Look! This is the answer.',
        praiseLine: 'You found it! Great job!',
        retryLine: 'Let us look again.',
      };
    case 'count':
      return {
        teachLines: [{text: 'Look at these.'}, {text: showObjectsLine}],
        welcomeLine: 'Let us count things!',
        showObjectsLine,
        tapCountLine: 'Tap each one and count!',
        afterCountLine: 'Great! You counted them all!',
        askLine: 'How many did you count?',
        explainLine: 'Great learning! Here is the answer.',
        praiseLine: 'You counted well! Well done!',
        retryLine: 'Let us count again.',
      };
    default:
      return {
        teachLines,
        welcomeLine: "Today we'll learn numbers.",
        showObjectsLine,
        tapCountLine: 'Tap each one!',
        afterCountLine: 'Great! You counted them all!',
        askLine: 'How many did you count?',
        explainLine: 'Great! Here is the answer.',
        praiseLine: 'Excellent! Well done!',
        retryLine: 'Let us try again.',
      };
  }
}

export function generateLearnNumbersQuestion(
  level: DifficultyLevel,
  recentIds: readonly string[] = [],
): LearnNumbersQuestion {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const question = buildOne(level);
    if (
      !recentIds.includes(question.id) &&
      validateLearnNumbersQuestion(question)
    ) {
      return question;
    }
  }
  const fallback = buildOne(level);
  if (!validateLearnNumbersQuestion(fallback)) {
    throw new Error('Failed to generate valid Learn Numbers question');
  }
  return fallback;
}

function buildOne(level: DifficultyLevel): LearnNumbersQuestion {
  const range = numbersRange(level);
  const number = randInt(range.min, range.max);
  const activityMode = pickActivityMode(level);
  const pool = pickOne(OBJECT_POOLS);
  const emoji = pickOne(pool.emojis);
  const emojis = Array.from({length: number}, () => emoji);
  const countWords = Array.from({length: number}, (_, i) =>
    englishCountAloud(i + 1),
  );
  const choices = buildChoices(number, level);
  const copy = buildCoachCopy(activityMode, pool.labelEn, emoji);

  return {
    id: `learn-numbers|${level}|${number}|${activityMode}|${pool.id}|${emoji}`,
    number,
    level,
    activityMode,
    emoji,
    objectLabelEn: pool.labelEn,
    emojis,
    countWords,
    teachLines: copy.teachLines,
    welcomeLine: copy.welcomeLine,
    showObjectsLine: copy.showObjectsLine,
    tapCountLine: copy.tapCountLine,
    afterCountLine: copy.afterCountLine,
    askLine: copy.askLine,
    explainLine: copy.explainLine,
    praiseLine: copy.praiseLine,
    retryLine: copy.retryLine,
    choices,
    tapToCount: true,
  };
}

export function validateLearnNumbersQuestion(
  question: LearnNumbersQuestion,
): boolean {
  if (question.number < 1 || question.emojis.length < 1) {
    return false;
  }
  if (question.emojis.length !== question.number) {
    return false;
  }
  if (question.countWords.length !== question.number) {
    return false;
  }
  return validateChoices(question.choices, String(question.number), 4);
}

export function uniqueLearnNumbersCount(
  level: DifficultyLevel,
  samples: number,
): number {
  const ids = new Set<string>();
  for (let i = 0; i < samples; i += 1) {
    ids.add(generateLearnNumbersQuestion(level, []).id);
  }
  return ids.size;
}

/** Full teach script for replay — no answer spoilers. */
export function fullCoachScript(
  question: LearnNumbersQuestion,
): readonly CoachLine[] {
  return [
    {text: 'Hello!'},
    {text: 'Welcome!'},
    {text: question.welcomeLine},
    ...question.teachLines,
    {text: question.tapCountLine},
    {text: question.afterCountLine},
    {text: question.askLine},
  ];
}
