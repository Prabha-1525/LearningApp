import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {bestStars} from '@core/gamification/domain/policies/starScore';

import {
  COUNTING_LESSON_COUNT,
  COUNTING_LESSONS,
} from '../domain/counting/countingCurriculum';

const KEY = StorageKeys.module('math', 'countingProgress');

export type CountingProgress = {
  readonly completedLessonIndexes: readonly number[];
  readonly starsByLesson: Readonly<Record<string, number>>;
  readonly completedAtByLesson: Readonly<Record<string, string>>;
  readonly starsEarned: number;
};

function empty(): CountingProgress {
  return {
    completedLessonIndexes: [],
    starsByLesson: {},
    completedAtByLesson: {},
    starsEarned: 0,
  };
}

function sumStars(map: Readonly<Record<string, number>>): number {
  return Object.values(map).reduce((s, n) => s + n, 0);
}

function read(): CountingProgress {
  const raw = mmkvStorage.getString(KEY);
  if (!raw) {
    return empty();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<CountingProgress>;
    const starsByLesson = parsed.starsByLesson ?? {};
    return {
      completedLessonIndexes: parsed.completedLessonIndexes ?? [],
      starsByLesson,
      completedAtByLesson: parsed.completedAtByLesson ?? {},
      starsEarned: parsed.starsEarned ?? sumStars(starsByLesson),
    };
  } catch {
    return empty();
  }
}

function write(progress: CountingProgress): void {
  mmkvStorage.setString(KEY, JSON.stringify(progress));
  try {
    const {getActiveCloudUid, scheduleProgressSync} =
      require('@infrastructure/auth') as typeof import('@infrastructure/auth');
    const uid = getActiveCloudUid();
    if (uid) {
      scheduleProgressSync(uid, 'math');
    }
  } catch {
    // optional
  }
}

export function getCountingProgress(): CountingProgress {
  return read();
}

export function getCountingLessonStars(lessonIndex: number): number {
  return read().starsByLesson[String(lessonIndex)] ?? 0;
}

export function isCountingLessonComplete(lessonIndex: number): boolean {
  return read().completedLessonIndexes.includes(lessonIndex);
}

export function isCountingLessonUnlocked(lessonIndex: number): boolean {
  if (lessonIndex <= 1) {
    return true;
  }
  return isCountingLessonComplete(lessonIndex - 1);
}

export type CountingLessonStarResult = {
  readonly progress: CountingProgress;
  readonly previousBest: number;
  readonly earnedStars: number;
  readonly bestStars: number;
  readonly deltaStars: number;
  readonly isFirstCompletion: boolean;
};

export function recordCountingLessonStars(
  lessonIndex: number,
  earnedStars: number,
): CountingLessonStarResult {
  const current = read();
  const key = String(lessonIndex);
  const previousBest = current.starsByLesson[key] ?? 0;
  const nextBest = bestStars(previousBest, earnedStars);
  const deltaStars = Math.max(0, nextBest - previousBest);
  const isFirstCompletion =
    !current.completedLessonIndexes.includes(lessonIndex);

  const starsByLesson = {...current.starsByLesson, [key]: nextBest};
  const progress: CountingProgress = {
    completedLessonIndexes: isFirstCompletion
      ? [...current.completedLessonIndexes, lessonIndex].sort((a, b) => a - b)
      : current.completedLessonIndexes,
    starsByLesson,
    completedAtByLesson: {
      ...current.completedAtByLesson,
      ...(isFirstCompletion ? {[key]: new Date().toISOString()} : {}),
    },
    starsEarned: sumStars(starsByLesson),
  };
  write(progress);

  return {
    progress,
    previousBest,
    earnedStars,
    bestStars: nextBest,
    deltaStars,
    isFirstCompletion,
  };
}

export function nextCountingLessonIndex(): number {
  const done = new Set(read().completedLessonIndexes);
  for (const lesson of COUNTING_LESSONS) {
    if (!done.has(lesson.index)) {
      return lesson.index;
    }
  }
  return 1;
}

export function countingCompletionPercent(): number {
  return Math.round(
    (read().completedLessonIndexes.length / COUNTING_LESSON_COUNT) * 100,
  );
}
