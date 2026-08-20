import {
  COUNTING_OBJECTS,
  countingObjectsByCategory,
  type CountingObjectDef,
} from '@assets/countingObjects';
import {makeChoices, pickOne, randInt} from '../generators/random';
import {
  ADDITION_LESSON_COUNT,
  ADDITION_LESSONS,
  ADDITION_QUESTIONS_PER_LESSON,
  generateAdditionQuestion,
  type AdditionLessonDef,
  type AdditionQuestion,
  type AdditionVisualMode,
  type PlaceDigits,
} from './additionGenerator';

export type EquationMode = 'addition' | 'subtraction';

export {
  ADDITION_LESSON_COUNT,
  ADDITION_LESSONS,
  ADDITION_QUESTIONS_PER_LESSON,
  additionUniquePairCount,
  buildAdditionDistractors,
  buildAdditionQuestion,
  enumerateLesson1Pairs,
  enumerateLesson2Pairs,
  generateAdditionQuestion,
  getAdditionLesson,
  toPlaceDigits,
} from './additionGenerator';
export type {
  AdditionLessonDef,
  AdditionQuestion,
  AdditionVisualMode,
  PlaceDigits,
} from './additionGenerator';

/** @deprecated Prefer getEquationLessonCount(mode) — addition has 5 lessons. */
export const EQUATION_LESSON_COUNT = 10;
export const EQUATION_QUESTIONS_PER_LESSON = 10;
/** Cap so object rows stay readable in the equation board (subtraction). */
export const EQUATION_MAX_PER_SIDE = 10;

export const SUBTRACTION_LESSON_COUNT = 10;

export type EquationLessonDef = {
  readonly index: number;
  readonly titleEn: string;
  readonly titleTa: string;
  readonly aMin: number;
  readonly aMax: number;
  readonly bMin: number;
  readonly bMax: number;
  readonly category: CountingObjectDef['category'] | 'mixed';
  readonly visualMode?: AdditionVisualMode;
  readonly introEn?: string;
  readonly examples?: readonly {
    readonly left: number;
    readonly right: number;
  }[];
};

export type EquationQuestion = {
  readonly id: string;
  readonly mode: EquationMode;
  readonly lessonIndex: number;
  readonly left: number;
  readonly right: number;
  readonly answer: number;
  readonly object: CountingObjectDef;
  readonly promptEn: string;
  readonly visualMode: AdditionVisualMode;
  readonly leftDigits: PlaceDigits;
  readonly rightDigits: PlaceDigits;
  readonly choices: readonly {
    readonly id: string;
    readonly label: string;
    readonly correct?: boolean;
  }[];
};

function additionLessonAsEquation(
  lesson: AdditionLessonDef,
): EquationLessonDef {
  return {
    index: lesson.index,
    titleEn: lesson.titleEn,
    titleTa: lesson.titleTa,
    aMin: 1,
    aMax: 9,
    bMin: 1,
    bMax: 9,
    category: lesson.category,
    visualMode: lesson.visualMode,
    introEn: lesson.introEn,
    examples: lesson.examples,
  };
}

/** Shared lesson ladder for addition (mapped) & subtraction (visual objects). */
export const EQUATION_LESSONS: readonly EquationLessonDef[] =
  ADDITION_LESSONS.map(additionLessonAsEquation);

export const SUBTRACTION_LESSONS: readonly EquationLessonDef[] = [
  {
    index: 1,
    titleEn: 'Take away to 5',
    titleTa: '5 வரை கழித்தல்',
    aMin: 2,
    aMax: 5,
    bMin: 1,
    bMax: 2,
    category: 'fruits',
    visualMode: 'objects',
  },
  {
    index: 2,
    titleEn: 'Take away to 5',
    titleTa: '5 வரை கழித்தல்',
    aMin: 2,
    aMax: 5,
    bMin: 1,
    bMax: 2,
    category: 'vegetables',
    visualMode: 'objects',
  },
  {
    index: 3,
    titleEn: 'Take away to 5',
    titleTa: '5 வரை கழித்தல்',
    aMin: 3,
    aMax: 5,
    bMin: 1,
    bMax: 3,
    category: 'animals',
    visualMode: 'objects',
  },
  {
    index: 4,
    titleEn: 'Take away to 10',
    titleTa: '10 வரை கழித்தல்',
    aMin: 4,
    aMax: 10,
    bMin: 1,
    bMax: 4,
    category: 'fruits',
    visualMode: 'objects',
  },
  {
    index: 5,
    titleEn: 'Take away to 10',
    titleTa: '10 வரை கழித்தல்',
    aMin: 5,
    aMax: 10,
    bMin: 2,
    bMax: 5,
    category: 'vegetables',
    visualMode: 'objects',
  },
  {
    index: 6,
    titleEn: 'Take away to 10',
    titleTa: '10 வரை கழித்தல்',
    aMin: 5,
    aMax: 10,
    bMin: 2,
    bMax: 5,
    category: 'animals',
    visualMode: 'objects',
  },
  {
    index: 7,
    titleEn: 'Bigger take away',
    titleTa: 'பெரிய கழித்தல்',
    aMin: 6,
    aMax: 12,
    bMin: 2,
    bMax: 6,
    category: 'mixed',
    visualMode: 'objects',
  },
  {
    index: 8,
    titleEn: 'Bigger take away',
    titleTa: 'பெரிய கழித்தல்',
    aMin: 7,
    aMax: 14,
    bMin: 3,
    bMax: 7,
    category: 'mixed',
    visualMode: 'objects',
  },
  {
    index: 9,
    titleEn: 'Master take away',
    titleTa: 'கழித்தல் வல்லுநர்',
    aMin: 8,
    aMax: 16,
    bMin: 3,
    bMax: 8,
    category: 'mixed',
    visualMode: 'objects',
  },
  {
    index: 10,
    titleEn: 'Master take away',
    titleTa: 'கழித்தல் வல்லுநர்',
    aMin: 8,
    aMax: 18,
    bMin: 4,
    bMax: 9,
    category: 'mixed',
    visualMode: 'objects',
  },
];

export function getEquationLessonCount(mode: EquationMode): number {
  return mode === 'addition' ? ADDITION_LESSON_COUNT : SUBTRACTION_LESSON_COUNT;
}

export function getEquationQuestionsPerLesson(mode: EquationMode): number {
  return mode === 'addition'
    ? ADDITION_QUESTIONS_PER_LESSON
    : EQUATION_QUESTIONS_PER_LESSON;
}

export function getEquationLessons(
  mode: EquationMode,
): readonly EquationLessonDef[] {
  return mode === 'addition' ? EQUATION_LESSONS : SUBTRACTION_LESSONS;
}

export function getEquationLesson(
  mode: EquationMode,
  index: number,
): EquationLessonDef {
  const lesson = getEquationLessons(mode).find(l => l.index === index);
  if (!lesson) {
    throw new Error(`Unknown ${mode} lesson: ${index}`);
  }
  return lesson;
}

function pickObject(
  category: EquationLessonDef['category'],
): CountingObjectDef {
  if (category === 'mixed') {
    return pickOne(COUNTING_OBJECTS);
  }
  const pool = countingObjectsByCategory(category);
  return pickOne(pool.length > 0 ? pool : COUNTING_OBJECTS);
}

function clampSide(n: number): number {
  return Math.max(1, Math.min(EQUATION_MAX_PER_SIDE, n));
}

function toDigits(n: number): PlaceDigits {
  const clamped = Math.max(0, Math.floor(n));
  return {
    hundreds: Math.floor(clamped / 100) % 10,
    tens: Math.floor(clamped / 10) % 10,
    ones: clamped % 10,
  };
}

function fromAdditionQuestion(q: AdditionQuestion): EquationQuestion {
  return {
    id: q.id,
    mode: 'addition',
    lessonIndex: q.lessonIndex,
    left: q.left,
    right: q.right,
    answer: q.answer,
    object: q.object,
    promptEn: q.promptEn,
    visualMode: q.visualMode,
    leftDigits: q.leftDigits,
    rightDigits: q.rightDigits,
    choices: q.choices,
  };
}

export function generateEquationQuestion(
  mode: EquationMode,
  lessonIndex: number,
  recentIds: readonly string[] = [],
): EquationQuestion {
  if (mode === 'addition') {
    return fromAdditionQuestion(
      generateAdditionQuestion(lessonIndex, recentIds),
    );
  }

  const lesson = getEquationLesson(mode, lessonIndex);
  let attempts = 0;
  let question: EquationQuestion;

  do {
    const object = pickObject(lesson.category);
    const left = clampSide(
      randInt(lesson.aMin, Math.min(lesson.aMax, EQUATION_MAX_PER_SIDE)),
    );
    const maxTake = Math.min(lesson.bMax, left - 1);
    const minTake = Math.min(lesson.bMin, maxTake);
    let right = clampSide(randInt(Math.max(1, minTake), Math.max(1, maxTake)));
    if (right >= left) {
      right = Math.max(1, left - 1);
    }
    const answer = left - right;
    const promptEn = `How many ${object.labelPluralEn} are left?`;
    const id = `subtraction.L${lessonIndex}|${object.id}|${left}|${right}`;
    question = {
      id,
      mode,
      lessonIndex,
      left,
      right,
      answer,
      object,
      promptEn,
      visualMode: 'objects',
      leftDigits: toDigits(left),
      rightDigits: toDigits(right),
      choices: makeChoices(
        String(answer),
        [
          String(answer - 1),
          String(answer + 1),
          String(answer + 2),
          String(Math.max(0, answer - 2)),
          String(left),
          String(right),
        ].filter(label => Number(label) >= 0),
      ),
    };
    attempts += 1;
  } while (recentIds.includes(question.id) && attempts < 12);

  return question;
}
