import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import {
  MISSING_LESSON_COUNT,
  MISSING_LESSONS,
} from '../domain/missing/missingCurriculum';
import {bestStars} from '@core/gamification/domain/policies/starScore';

const KEY = StorageKeys.module('math', 'missingProgress');

export type MissingProgress = {
  readonly completedLessonIndexes: readonly number[];
  /** Best star score per lesson (1–3). Never decreases. */
  readonly starsByLesson: Readonly<Record<string, number>>;
  readonly completedAtByLesson: Readonly<Record<string, string>>;
  /** Sum of best stars across lessons (for quick totals). */
  readonly starsEarned: number;
};

function emptyProgress(): MissingProgress {
  return {
    completedLessonIndexes: [],
    starsByLesson: {},
    completedAtByLesson: {},
    starsEarned: 0,
  };
}

function sumStars(starsByLesson: Readonly<Record<string, number>>): number {
  return Object.values(starsByLesson).reduce((sum, n) => sum + n, 0);
}

function normalize(raw: Partial<MissingProgress>): MissingProgress {
  const starsByLesson = raw.starsByLesson ?? {};
  const completed =
    raw.completedLessonIndexes ??
    Object.keys(starsByLesson)
      .map(Number)
      .filter(n => Number.isFinite(n))
      .sort((a, b) => a - b);
  return {
    completedLessonIndexes: completed,
    starsByLesson,
    completedAtByLesson: raw.completedAtByLesson ?? {},
    starsEarned: raw.starsEarned ?? sumStars(starsByLesson),
  };
}

function read(): MissingProgress {
  const raw = mmkvStorage.getString(KEY);
  if (!raw) {
    return emptyProgress();
  }
  try {
    return normalize(JSON.parse(raw) as Partial<MissingProgress>);
  } catch {
    return emptyProgress();
  }
}

function write(progress: MissingProgress): void {
  mmkvStorage.setString(KEY, JSON.stringify(progress));
  try {
    const {getActiveCloudUid, scheduleProgressSync} =
      require('@infrastructure/auth') as typeof import('@infrastructure/auth');
    const uid = getActiveCloudUid();
    if (uid) {
      scheduleProgressSync(uid, 'math');
    }
  } catch {
    // optional sync
  }
}

export function getMissingProgress(): MissingProgress {
  return read();
}

export function getMissingLessonStars(lessonIndex: number): number {
  return read().starsByLesson[String(lessonIndex)] ?? 0;
}

export function isMissingLessonComplete(lessonIndex: number): boolean {
  return read().completedLessonIndexes.includes(lessonIndex);
}

/**
 * Lesson 1 is always open. Lesson N opens only after N−1 is complete.
 */
export function isMissingLessonUnlocked(lessonIndex: number): boolean {
  if (lessonIndex <= 1) {
    return true;
  }
  return isMissingLessonComplete(lessonIndex - 1);
}

export type MissingLessonStarResult = {
  readonly progress: MissingProgress;
  readonly previousBest: number;
  readonly earnedStars: number;
  readonly bestStars: number;
  /** Wallet delta — only the improvement over previous best. */
  readonly deltaStars: number;
  readonly isFirstCompletion: boolean;
};

/**
 * Record lesson completion + best stars (never decreases).
 */
export function recordMissingLessonStars(
  lessonIndex: number,
  earnedStars: number,
): MissingLessonStarResult {
  const current = read();
  const key = String(lessonIndex);
  const previousBest = current.starsByLesson[key] ?? 0;
  const nextBest = bestStars(previousBest, earnedStars);
  const deltaStars = Math.max(0, nextBest - previousBest);
  const isFirstCompletion =
    !current.completedLessonIndexes.includes(lessonIndex);

  const starsByLesson = {
    ...current.starsByLesson,
    [key]: nextBest,
  };
  const completedLessonIndexes = isFirstCompletion
    ? [...current.completedLessonIndexes, lessonIndex].sort((a, b) => a - b)
    : current.completedLessonIndexes;
  const completedAtByLesson = {
    ...current.completedAtByLesson,
    ...(isFirstCompletion ? {[key]: new Date().toISOString()} : {}),
  };

  const progress: MissingProgress = {
    completedLessonIndexes,
    starsByLesson,
    completedAtByLesson,
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

/** @deprecated Prefer recordMissingLessonStars */
export function markMissingLessonComplete(
  lessonIndex: number,
): MissingProgress {
  return recordMissingLessonStars(lessonIndex, 1).progress;
}

/** First incomplete lesson (1–10), or 1 if all done. */
export function nextMissingLessonIndex(): number {
  const done = new Set(read().completedLessonIndexes);
  for (const lesson of MISSING_LESSONS) {
    if (!done.has(lesson.index)) {
      return lesson.index;
    }
  }
  return 1;
}

export function missingCompletionPercent(): number {
  return Math.round(
    (read().completedLessonIndexes.length / MISSING_LESSON_COUNT) * 100,
  );
}

export function countMissingPerfectLessons(): number {
  return Object.values(read().starsByLesson).filter(s => s >= 3).length;
}
