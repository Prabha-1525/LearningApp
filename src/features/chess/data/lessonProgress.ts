import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {ChessLessonId} from '../domain/curriculum/types';
import {CHESS_LESSONS} from '../domain/curriculum/lessons';

const PROGRESS_KEY = StorageKeys.module('chess', 'lessonProgress');

export type LessonStarMap = Partial<Record<ChessLessonId, number>>;

export type ChessLessonProgress = {
  readonly completed: readonly ChessLessonId[];
  readonly stars: number;
  readonly lessonStars?: LessonStarMap;
};

function read(): ChessLessonProgress {
  const raw = mmkvStorage.getString(PROGRESS_KEY);
  if (!raw) {
    return {completed: [], stars: 0, lessonStars: {}};
  }
  try {
    const parsed = JSON.parse(raw) as ChessLessonProgress;
    return {
      completed: parsed.completed ?? [],
      stars: parsed.stars ?? 0,
      lessonStars: parsed.lessonStars ?? {},
    };
  } catch {
    return {completed: [], stars: 0, lessonStars: {}};
  }
}

function write(progress: ChessLessonProgress): void {
  mmkvStorage.setString(PROGRESS_KEY, JSON.stringify(progress));
  try {
    const {getActiveCloudUid, scheduleProgressSync} =
      require('@infrastructure/auth') as typeof import('@infrastructure/auth');
    const uid = getActiveCloudUid();
    if (uid) {
      scheduleProgressSync(uid, 'chess');
    }
  } catch {
    // Sync layer optional during early boot / tests
  }
}

export function replaceChessLessonProgress(
  progress: ChessLessonProgress,
): void {
  write(progress);
}

export function getChessLessonProgress(): ChessLessonProgress {
  return read();
}

export function markLessonComplete(
  lessonId: ChessLessonId,
  starsEarned = 3,
): ChessLessonProgress {
  const current = read();
  const alreadyCompleted = current.completed.includes(lessonId);
  const completed = alreadyCompleted
    ? current.completed
    : [...current.completed, lessonId];

  const prevStars = current.lessonStars?.[lessonId] ?? 0;
  const newStarsForLesson = Math.max(prevStars, starsEarned);
  const updatedLessonStars: LessonStarMap = {
    ...(current.lessonStars ?? {}),
    [lessonId]: newStarsForLesson,
  };

  const totalStars = Object.values(updatedLessonStars).reduce(
    (sum, val) => sum + (val ?? 0),
    0,
  );

  const next: ChessLessonProgress = {
    completed,
    stars: totalStars,
    lessonStars: updatedLessonStars,
  };
  write(next);
  return next;
}

export function isLessonUnlocked(
  lessonId: ChessLessonId,
  progress = read(),
): boolean {
  const target = CHESS_LESSONS.find(l => l.id === lessonId);
  if (!target || target.order === 1) {
    return true;
  }
  const previous = CHESS_LESSONS.find(l => l.order === target.order - 1);
  return previous ? progress.completed.includes(previous.id) : true;
}
