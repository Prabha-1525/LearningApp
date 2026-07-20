import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {bestStars} from '@core/gamification/domain/policies/starScore';

import {
  EQUATION_LESSON_COUNT,
  getEquationLessons,
  type EquationMode,
} from '../domain/equation/equationCurriculum';

export type EquationProgress = {
  readonly completedLessonIndexes: readonly number[];
  readonly starsByLesson: Readonly<Record<string, number>>;
  readonly completedAtByLesson: Readonly<Record<string, string>>;
  readonly starsEarned: number;
};

export type EquationLessonStarResult = {
  readonly progress: EquationProgress;
  readonly previousBest: number;
  readonly earnedStars: number;
  readonly bestStars: number;
  readonly deltaStars: number;
  readonly isFirstCompletion: boolean;
};

function empty(): EquationProgress {
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

function keyFor(mode: EquationMode): string {
  return StorageKeys.module('math', `${mode}Progress`);
}

function read(mode: EquationMode): EquationProgress {
  const raw = mmkvStorage.getString(keyFor(mode));
  if (!raw) {
    return empty();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<EquationProgress>;
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

function write(mode: EquationMode, progress: EquationProgress): void {
  mmkvStorage.setString(keyFor(mode), JSON.stringify(progress));
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

export function getEquationProgress(mode: EquationMode): EquationProgress {
  return read(mode);
}

export function getEquationLessonStars(
  mode: EquationMode,
  lessonIndex: number,
): number {
  return read(mode).starsByLesson[String(lessonIndex)] ?? 0;
}

export function isEquationLessonComplete(
  mode: EquationMode,
  lessonIndex: number,
): boolean {
  return read(mode).completedLessonIndexes.includes(lessonIndex);
}

export function isEquationLessonUnlocked(
  mode: EquationMode,
  lessonIndex: number,
): boolean {
  if (lessonIndex <= 1) {
    return true;
  }
  return isEquationLessonComplete(mode, lessonIndex - 1);
}

export function recordEquationLessonStars(
  mode: EquationMode,
  lessonIndex: number,
  earnedStars: number,
): EquationLessonStarResult {
  const current = read(mode);
  const key = String(lessonIndex);
  const previousBest = current.starsByLesson[key] ?? 0;
  const nextBest = bestStars(previousBest, earnedStars);
  const deltaStars = Math.max(0, nextBest - previousBest);
  const isFirstCompletion =
    !current.completedLessonIndexes.includes(lessonIndex);

  const starsByLesson = {...current.starsByLesson, [key]: nextBest};
  const progress: EquationProgress = {
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
  write(mode, progress);

  return {
    progress,
    previousBest,
    earnedStars,
    bestStars: nextBest,
    deltaStars,
    isFirstCompletion,
  };
}

export function equationCompletionPercent(mode: EquationMode): number {
  return Math.round(
    (read(mode).completedLessonIndexes.length / EQUATION_LESSON_COUNT) * 100,
  );
}

export function nextEquationLessonIndex(mode: EquationMode): number {
  const done = new Set(read(mode).completedLessonIndexes);
  for (const lesson of getEquationLessons(mode)) {
    if (!done.has(lesson.index)) {
      return lesson.index;
    }
  }
  return 1;
}
