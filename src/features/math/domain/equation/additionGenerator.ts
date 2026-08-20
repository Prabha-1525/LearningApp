import {
  COUNTING_OBJECTS,
  countingObjectsByCategory,
  type CountingObjectDef,
} from '@assets/countingObjects';
import {makeChoices, pickOne, randInt, shuffle} from '../generators/random';

/** Five progressive addition lessons for ages 5–8. */
export const ADDITION_LESSON_COUNT = 5;
export const ADDITION_QUESTIONS_PER_LESSON = 10;

export type AdditionVisualMode = 'objects' | 'placeValue' | 'base10';

export type AdditionLessonDef = {
  readonly index: number;
  readonly titleEn: string;
  readonly titleTa: string;
  readonly category: CountingObjectDef['category'] | 'mixed';
  readonly visualMode: AdditionVisualMode;
  readonly introEn: string;
  readonly examples: readonly {readonly left: number; readonly right: number}[];
};

export type PlaceDigits = {
  readonly hundreds: number;
  readonly tens: number;
  readonly ones: number;
};

export type AdditionQuestion = {
  readonly id: string;
  readonly mode: 'addition';
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

export const ADDITION_LESSONS: readonly AdditionLessonDef[] = [
  {
    index: 1,
    titleEn: 'Sums up to 10',
    titleTa: '10 வரை கூட்டல்',
    category: 'fruits',
    visualMode: 'objects',
    introEn:
      'Adding means putting groups together. Count both groups to find the total!',
    examples: [
      {left: 1, right: 2},
      {left: 3, right: 4},
      {left: 2, right: 5},
    ],
  },
  {
    index: 2,
    titleEn: 'Sums over 10',
    titleTa: '10 க்கு மேல் கூட்டல்',
    category: 'vegetables',
    visualMode: 'objects',
    introEn:
      'Now we add bigger single digits. The total will be more than ten — between 11 and 18.',
    examples: [
      {left: 7, right: 9},
      {left: 8, right: 6},
      {left: 9, right: 8},
    ],
  },
  {
    index: 3,
    titleEn: 'Tens and ones',
    titleTa: 'பத்துகளும் ஒன்றுகளும்',
    category: 'animals',
    visualMode: 'placeValue',
    introEn:
      'A two-digit number has tens and ones. Add the ones, then the tens!',
    examples: [
      {left: 15, right: 8},
      {left: 27, right: 6},
      {left: 34, right: 5},
    ],
  },
  {
    index: 4,
    titleEn: 'Two-digit plus two-digit',
    titleTa: 'இரு இலக்க கூட்டல்',
    category: 'mixed',
    visualMode: 'base10',
    introEn:
      'Add tens with tens and ones with ones. If ones make ten or more, carry one ten!',
    examples: [
      {left: 25, right: 34},
      {left: 48, right: 29},
      {left: 36, right: 47},
    ],
  },
  {
    index: 5,
    titleEn: 'Hundreds, tens and ones',
    titleTa: 'நூறுகள், பத்துகள், ஒன்றுகள்',
    category: 'mixed',
    visualMode: 'placeValue',
    introEn:
      'Three-digit numbers have hundreds, tens, and ones. Add the ones first!',
    examples: [
      {left: 125, right: 6},
      {left: 348, right: 7},
      {left: 210, right: 9},
    ],
  },
];

export function getAdditionLesson(index: number): AdditionLessonDef {
  const lesson = ADDITION_LESSONS.find(l => l.index === index);
  if (!lesson) {
    throw new Error(`Unknown addition lesson: ${index}`);
  }
  return lesson;
}

export function toPlaceDigits(n: number): PlaceDigits {
  const clamped = Math.max(0, Math.floor(n));
  return {
    hundreds: Math.floor(clamped / 100) % 10,
    tens: Math.floor(clamped / 10) % 10,
    ones: clamped % 10,
  };
}

function pickObject(
  category: AdditionLessonDef['category'],
): CountingObjectDef {
  if (category === 'mixed') {
    return pickOne(COUNTING_OBJECTS);
  }
  const pool = countingObjectsByCategory(category);
  return pickOne(pool.length > 0 ? pool : COUNTING_OBJECTS);
}

/** Unique ordered pairs for lesson 1: single digits, sum ≤ 10. */
export function enumerateLesson1Pairs(): readonly [number, number][] {
  const pairs: [number, number][] = [];
  for (let a = 1; a <= 9; a += 1) {
    for (let b = 1; b <= 9; b += 1) {
      if (a + b <= 10) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}

/** Unique ordered pairs for lesson 2: single digits, sum 11–18. */
export function enumerateLesson2Pairs(): readonly [number, number][] {
  const pairs: [number, number][] = [];
  for (let a = 1; a <= 9; a += 1) {
    for (let b = 1; b <= 9; b += 1) {
      const sum = a + b;
      if (sum >= 11 && sum <= 18) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}

function sampleOperands(lessonIndex: number): {left: number; right: number} {
  switch (lessonIndex) {
    case 1: {
      const pairs = enumerateLesson1Pairs();
      const [left, right] = pickOne(pairs);
      return {left, right};
    }
    case 2: {
      const pairs = enumerateLesson2Pairs();
      const [left, right] = pickOne(pairs);
      return {left, right};
    }
    case 3: {
      // Two-digit + one-digit
      const left = randInt(10, 99);
      const right = randInt(1, 9);
      return {left, right};
    }
    case 4: {
      // Two-digit + two-digit
      const left = randInt(10, 99);
      const right = randInt(10, 99);
      return {left, right};
    }
    case 5: {
      // Three-digit + one-digit
      const left = randInt(100, 999);
      const right = randInt(1, 9);
      return {left, right};
    }
    default:
      return {left: 1, right: 1};
  }
}

function validateOperands(
  lessonIndex: number,
  left: number,
  right: number,
): boolean {
  const answer = left + right;
  switch (lessonIndex) {
    case 1:
      return (
        left >= 1 &&
        left <= 9 &&
        right >= 1 &&
        right <= 9 &&
        answer >= 2 &&
        answer <= 10
      );
    case 2:
      return (
        left >= 1 &&
        left <= 9 &&
        right >= 1 &&
        right <= 9 &&
        answer >= 11 &&
        answer <= 18
      );
    case 3:
      return left >= 10 && left <= 99 && right >= 1 && right <= 9;
    case 4:
      return left >= 10 && left <= 99 && right >= 10 && right <= 99;
    case 5:
      return left >= 100 && left <= 999 && right >= 1 && right <= 9;
    default:
      return false;
  }
}

/**
 * Build pedagogically useful distractors: near-misses, operand slips,
 * and place-value / carry mistakes for harder lessons.
 */
export function buildAdditionDistractors(
  left: number,
  right: number,
  answer: number,
  lessonIndex: number,
): string[] {
  const leftDigits = toPlaceDigits(left);
  const rightDigits = toPlaceDigits(right);
  const onesSum = leftDigits.ones + rightDigits.ones;
  const withoutCarry =
    leftDigits.hundreds * 100 +
    rightDigits.hundreds * 100 +
    (leftDigits.tens + rightDigits.tens) * 10 +
    (onesSum % 10);

  const candidates = new Set<number>([
    answer - 1,
    answer + 1,
    answer - 2,
    answer + 2,
    answer + 10,
    Math.max(0, answer - 10),
    left,
    right,
    Math.abs(left - right),
    onesSum, // forgetting tens/hundreds
    withoutCarry, // forgot to carry
    left + right + 1,
  ]);

  if (lessonIndex >= 3) {
    // Swap tens/ones contribution mistakes
    candidates.add(answer + 9);
    candidates.add(Math.max(0, answer - 9));
    candidates.add(leftDigits.tens * 10 + rightDigits.ones + leftDigits.ones);
  }

  if (lessonIndex === 4 && onesSum >= 10) {
    // Classic carry miss: add tens only, keep ones digit without +1 ten
    candidates.add((leftDigits.tens + rightDigits.tens) * 10 + (onesSum % 10));
  }

  return shuffle(
    [...candidates]
      .filter(n => Number.isFinite(n) && n >= 0 && n !== answer)
      .map(String),
  );
}

function promptFor(
  lesson: AdditionLessonDef,
  object: CountingObjectDef,
  left: number,
  right: number,
): string {
  if (lesson.visualMode === 'objects') {
    return `How many ${object.labelPluralEn} do we have in total?`;
  }
  return `What is ${left} + ${right}?`;
}

export function buildAdditionQuestion(
  lessonIndex: number,
  left: number,
  right: number,
  object?: CountingObjectDef,
): AdditionQuestion {
  const lesson = getAdditionLesson(lessonIndex);
  const answer = left + right;
  const picked = object ?? pickObject(lesson.category);
  return {
    id: `addition.L${lessonIndex}|${left}+${right}`,
    mode: 'addition',
    lessonIndex,
    left,
    right,
    answer,
    object: picked,
    promptEn: promptFor(lesson, picked, left, right),
    visualMode: lesson.visualMode,
    leftDigits: toPlaceDigits(left),
    rightDigits: toPlaceDigits(right),
    choices: makeChoices(
      String(answer),
      buildAdditionDistractors(left, right, answer, lessonIndex),
    ),
  };
}

/**
 * Generates a unique addition question for the lesson difficulty.
 * Avoids repeating any recent `left+right` ids within the session.
 */
export function generateAdditionQuestion(
  lessonIndex: number,
  recentIds: readonly string[] = [],
): AdditionQuestion {
  getAdditionLesson(lessonIndex); // validate
  const maxAttempts = 48;
  let last: AdditionQuestion | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const {left, right} = sampleOperands(lessonIndex);
    if (!validateOperands(lessonIndex, left, right)) {
      continue;
    }
    const question = buildAdditionQuestion(lessonIndex, left, right);
    last = question;
    if (!recentIds.includes(question.id)) {
      return question;
    }
  }

  // Exhausted unique pairs for small lessons — reshuffle from full pool
  if (lessonIndex === 1 || lessonIndex === 2) {
    const pool =
      lessonIndex === 1 ? enumerateLesson1Pairs() : enumerateLesson2Pairs();
    const unused = pool.filter(
      ([a, b]) => !recentIds.includes(`addition.L${lessonIndex}|${a}+${b}`),
    );
    const [left, right] = pickOne(unused.length > 0 ? unused : pool);
    return buildAdditionQuestion(lessonIndex, left, right);
  }

  return last ?? buildAdditionQuestion(lessonIndex, 15, 8);
}

/** Approximate unique problem-space size (ordered pairs). */
export function additionUniquePairCount(lessonIndex: number): number {
  switch (lessonIndex) {
    case 1:
      return enumerateLesson1Pairs().length;
    case 2:
      return enumerateLesson2Pairs().length;
    case 3:
      return 90 * 9; // 10–99 × 1–9
    case 4:
      return 90 * 90; // 10–99 × 10–99
    case 5:
      return 900 * 9; // 100–999 × 1–9
    default:
      return 0;
  }
}
