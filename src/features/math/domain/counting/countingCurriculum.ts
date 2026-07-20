import {
  COUNTING_OBJECTS,
  countingObjectsByCategory,
  type CountingObjectDef,
} from '@assets/countingObjects';
import {makeChoices, pickOne, randInt} from '../generators/random';

export const COUNTING_LESSON_COUNT = 10;
export const COUNTING_QUESTIONS_PER_LESSON = 10;
/** Hard cap so the grid stays readable. */
export const COUNTING_MAX_OBJECTS = 20;

export type CountingLessonDef = {
  readonly index: number;
  readonly titleEn: string;
  readonly titleTa: string;
  readonly min: number;
  readonly max: number;
  readonly category: CountingObjectDef['category'] | 'mixed';
};

export type CountingQuestion = {
  readonly id: string;
  readonly lessonIndex: number;
  readonly count: number;
  readonly object: CountingObjectDef;
  readonly promptEn: string;
  readonly choices: readonly {
    readonly id: string;
    readonly label: string;
    readonly correct?: boolean;
  }[];
};

/**
 * Lesson ranges — always ≤ 20 objects.
 * 1–3: up to 5 · 4–6: up to 10 · 7–8: up to 15 · 9–10: up to 20
 */
export const COUNTING_LESSONS: readonly CountingLessonDef[] = [
  {
    index: 1,
    titleEn: 'Counting to 5',
    titleTa: '5 வரை எண்ணு',
    min: 1,
    max: 5,
    category: 'fruits',
  },
  {
    index: 2,
    titleEn: 'Counting to 5',
    titleTa: '5 வரை எண்ணு',
    min: 2,
    max: 5,
    category: 'vegetables',
  },
  {
    index: 3,
    titleEn: 'Counting to 5',
    titleTa: '5 வரை எண்ணு',
    min: 3,
    max: 5,
    category: 'animals',
  },
  {
    index: 4,
    titleEn: 'Counting to 10',
    titleTa: '10 வரை எண்ணு',
    min: 4,
    max: 10,
    category: 'fruits',
  },
  {
    index: 5,
    titleEn: 'Counting to 10',
    titleTa: '10 வரை எண்ணு',
    min: 5,
    max: 10,
    category: 'vegetables',
  },
  {
    index: 6,
    titleEn: 'Counting to 10',
    titleTa: '10 வரை எண்ணு',
    min: 6,
    max: 10,
    category: 'animals',
  },
  {
    index: 7,
    titleEn: 'Counting to 15',
    titleTa: '15 வரை எண்ணு',
    min: 8,
    max: 15,
    category: 'mixed',
  },
  {
    index: 8,
    titleEn: 'Counting to 15',
    titleTa: '15 வரை எண்ணு',
    min: 10,
    max: 15,
    category: 'mixed',
  },
  {
    index: 9,
    titleEn: 'Counting to 20',
    titleTa: '20 வரை எண்ணு',
    min: 12,
    max: 20,
    category: 'mixed',
  },
  {
    index: 10,
    titleEn: 'Counting to 20',
    titleTa: '20 வரை எண்ணு',
    min: 15,
    max: 20,
    category: 'mixed',
  },
];

export function getCountingLesson(index: number): CountingLessonDef {
  const lesson = COUNTING_LESSONS.find(l => l.index === index);
  if (!lesson) {
    throw new Error(`Unknown counting lesson: ${index}`);
  }
  return lesson;
}

function pickObject(
  category: CountingLessonDef['category'],
): CountingObjectDef {
  if (category === 'mixed') {
    return pickOne(COUNTING_OBJECTS);
  }
  const pool = countingObjectsByCategory(category);
  return pickOne(pool.length > 0 ? pool : COUNTING_OBJECTS);
}

export function generateCountingQuestion(
  lessonIndex: number,
  recentIds: readonly string[] = [],
): CountingQuestion {
  const lesson = getCountingLesson(lessonIndex);
  let attempts = 0;
  let question: CountingQuestion;

  do {
    const count = Math.min(
      COUNTING_MAX_OBJECTS,
      randInt(lesson.min, lesson.max),
    );
    const object = pickObject(lesson.category);
    const id = `counting.L${lessonIndex}|${object.id}|${count}`;
    question = {
      id,
      lessonIndex,
      count,
      object,
      promptEn: `Can you count the ${object.labelPluralEn}? Tap each one!`,
      choices: makeChoices(
        String(count),
        [
          String(count - 1),
          String(count + 1),
          String(count + 2),
          String(Math.max(1, count - 2)),
        ].filter(
          label =>
            Number(label) >= 1 && Number(label) <= COUNTING_MAX_OBJECTS + 2,
        ),
      ),
    };
    attempts += 1;
  } while (recentIds.includes(question.id) && attempts < 12);

  return question;
}
