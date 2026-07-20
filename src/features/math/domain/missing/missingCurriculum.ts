import {makeChoices, randInt, shuffle} from '../generators/random';

export const MISSING_LESSON_COUNT = 10;
export const MISSING_QUESTIONS_PER_LESSON = 10;
export const MISSING_SEQUENCE_LENGTH = 5;
/** After this many lessons, questions may use 3-digit numbers. */
export const MISSING_THREE_DIGIT_AFTER = 5;

export type MissingLessonDef = {
  readonly index: number; // 1–10
  readonly titleEn: string;
  readonly titleTa: string;
  readonly min: number;
  readonly max: number;
};

export type MissingQuestion = {
  readonly id: string;
  readonly lessonIndex: number;
  readonly sequence: readonly (number | null)[];
  readonly answer: number;
  readonly choices: readonly {
    readonly id: string;
    readonly label: string;
    readonly correct?: boolean;
  }[];
};

/**
 * Number range for a lesson.
 * Lessons 1–5: random 1–2 digit numbers.
 * Lessons 6–10: random mix including 3-digit numbers.
 */
export function rangeForMissingLesson(lessonIndex: number): {
  min: number;
  max: number;
} {
  if (lessonIndex <= MISSING_THREE_DIGIT_AFTER) {
    return {min: 1, max: 99};
  }
  return {min: 100, max: 999};
}

/** Ten lessons labeled simply as Lesson 1…10 (random numbers, no tens themes). */
export const MISSING_LESSONS: readonly MissingLessonDef[] = Array.from(
  {length: MISSING_LESSON_COUNT},
  (_, i) => {
    const index = i + 1;
    const range = rangeForMissingLesson(index);
    return {
      index,
      titleEn: `Lesson ${index}`,
      titleTa: `பாடம் ${index}`,
      min: range.min,
      max: range.max,
    };
  },
);

export function getMissingLesson(index: number): MissingLessonDef {
  const lesson = MISSING_LESSONS.find(item => item.index === index);
  if (!lesson) {
    throw new Error(`Unknown missing lesson: ${index}`);
  }
  return lesson;
}

/**
 * Random consecutive sequence with one gap and 4 answer choices.
 */
export function generateMissingQuestion(
  lessonIndex: number,
  recentIds: readonly string[] = [],
): MissingQuestion {
  const range = rangeForMissingLesson(lessonIndex);
  const span = MISSING_SEQUENCE_LENGTH - 1;
  let attempts = 0;
  let question: MissingQuestion;

  do {
    const start = randInt(range.min, Math.max(range.min, range.max - span));
    const missingIndex = randInt(0, MISSING_SEQUENCE_LENGTH - 1);
    const full = Array.from(
      {length: MISSING_SEQUENCE_LENGTH},
      (_, i) => start + i,
    );
    const answer = full[missingIndex]!;
    const sequence: (number | null)[] = full.map((n, i) =>
      i === missingIndex ? null : n,
    );
    const id = `missing.L${lessonIndex}|${sequence
      .map(n => (n == null ? '_' : String(n)))
      .join('-')}|${answer}`;

    question = {
      id,
      lessonIndex,
      sequence,
      answer,
      choices: makeChoices(
        String(answer),
        shuffle([
          String(answer - 1),
          String(answer + 1),
          String(answer + 2),
          String(answer - 2),
          String(answer + 3),
          String(answer - 3),
        ]).filter(label => Number(label) >= 1),
      ),
    };
    attempts += 1;
  } while (recentIds.includes(question.id) && attempts < 12);

  return question;
}
