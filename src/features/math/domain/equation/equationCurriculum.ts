import {
  COUNTING_OBJECTS,
  countingObjectsByCategory,
  type CountingObjectDef,
} from '@assets/countingObjects';
import {makeChoices, pickOne, randInt} from '../generators/random';

export type EquationMode = 'addition' | 'subtraction';

export const EQUATION_LESSON_COUNT = 10;
export const EQUATION_QUESTIONS_PER_LESSON = 10;
/** Cap so object rows stay readable in the equation board. */
export const EQUATION_MAX_PER_SIDE = 10;

export type EquationLessonDef = {
  readonly index: number;
  readonly titleEn: string;
  readonly titleTa: string;
  readonly aMin: number;
  readonly aMax: number;
  readonly bMin: number;
  readonly bMax: number;
  readonly category: CountingObjectDef['category'] | 'mixed';
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
  readonly choices: readonly {
    readonly id: string;
    readonly label: string;
    readonly correct?: boolean;
  }[];
};

/** Shared lesson ladder for addition & subtraction (visual object counts). */
export const EQUATION_LESSONS: readonly EquationLessonDef[] = [
  {
    index: 1,
    titleEn: 'Sums to 5',
    titleTa: '5 வரை கூட்டல்',
    aMin: 1,
    aMax: 3,
    bMin: 1,
    bMax: 2,
    category: 'fruits',
  },
  {
    index: 2,
    titleEn: 'Sums to 5',
    titleTa: '5 வரை கூட்டல்',
    aMin: 1,
    aMax: 3,
    bMin: 1,
    bMax: 2,
    category: 'vegetables',
  },
  {
    index: 3,
    titleEn: 'Sums to 5',
    titleTa: '5 வரை கூட்டல்',
    aMin: 1,
    aMax: 4,
    bMin: 1,
    bMax: 3,
    category: 'animals',
  },
  {
    index: 4,
    titleEn: 'Sums to 10',
    titleTa: '10 வரை கூட்டல்',
    aMin: 2,
    aMax: 6,
    bMin: 1,
    bMax: 4,
    category: 'fruits',
  },
  {
    index: 5,
    titleEn: 'Sums to 10',
    titleTa: '10 வரை கூட்டல்',
    aMin: 2,
    aMax: 6,
    bMin: 2,
    bMax: 4,
    category: 'vegetables',
  },
  {
    index: 6,
    titleEn: 'Sums to 10',
    titleTa: '10 வரை கூட்டல்',
    aMin: 3,
    aMax: 7,
    bMin: 2,
    bMax: 5,
    category: 'animals',
  },
  {
    index: 7,
    titleEn: 'Bigger sums',
    titleTa: 'பெரிய கூட்டல்',
    aMin: 3,
    aMax: 8,
    bMin: 2,
    bMax: 6,
    category: 'mixed',
  },
  {
    index: 8,
    titleEn: 'Bigger sums',
    titleTa: 'பெரிய கூட்டல்',
    aMin: 4,
    aMax: 9,
    bMin: 2,
    bMax: 6,
    category: 'mixed',
  },
  {
    index: 9,
    titleEn: 'Master sums',
    titleTa: 'கூட்டல் வல்லுநர்',
    aMin: 4,
    aMax: 10,
    bMin: 3,
    bMax: 7,
    category: 'mixed',
  },
  {
    index: 10,
    titleEn: 'Master sums',
    titleTa: 'கூட்டல் வல்லுநர்',
    aMin: 5,
    aMax: 10,
    bMin: 3,
    bMax: 8,
    category: 'mixed',
  },
];

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
  },
];

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

export function generateEquationQuestion(
  mode: EquationMode,
  lessonIndex: number,
  recentIds: readonly string[] = [],
): EquationQuestion {
  const lesson = getEquationLesson(mode, lessonIndex);
  let attempts = 0;
  let question: EquationQuestion;

  do {
    const object = pickObject(lesson.category);
    let left: number;
    let right: number;
    let answer: number;
    let promptEn: string;

    if (mode === 'addition') {
      left = clampSide(randInt(lesson.aMin, lesson.aMax));
      right = clampSide(randInt(lesson.bMin, lesson.bMax));
      // Keep total visual objects friendly
      if (left + right > EQUATION_MAX_PER_SIDE + 4) {
        right = clampSide(Math.max(1, EQUATION_MAX_PER_SIDE + 4 - left));
      }
      answer = left + right;
      promptEn = `How many ${object.labelPluralEn} do we have in total?`;
    } else {
      left = clampSide(
        randInt(lesson.aMin, Math.min(lesson.aMax, EQUATION_MAX_PER_SIDE)),
      );
      const maxTake = Math.min(lesson.bMax, left - 1);
      const minTake = Math.min(lesson.bMin, maxTake);
      right = clampSide(randInt(Math.max(1, minTake), Math.max(1, maxTake)));
      if (right >= left) {
        right = Math.max(1, left - 1);
      }
      answer = left - right;
      promptEn = `How many ${object.labelPluralEn} are left?`;
    }

    const id = `${mode}.L${lessonIndex}|${object.id}|${left}|${right}`;
    question = {
      id,
      mode,
      lessonIndex,
      left,
      right,
      answer,
      object,
      promptEn,
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
