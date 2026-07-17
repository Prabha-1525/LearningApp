import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {ChessLessonId} from '../domain/curriculum/types';
import {CHESS_LESSONS} from '../domain/curriculum/lessons';

const PROGRESS_KEY = StorageKeys.module('chess', 'lessonProgress');

export type ChessLessonProgress = {
  readonly completed: readonly ChessLessonId[];
  readonly stars: number;
};

function read(): ChessLessonProgress {
  const raw = mmkvStorage.getString(PROGRESS_KEY);
  if (!raw) {
    return {completed: [], stars: 0};
  }
  try {
    return JSON.parse(raw) as ChessLessonProgress;
  } catch {
    return {completed: [], stars: 0};
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

/** Replace entire chess progress blob (used when restoring from Firestore). */
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
): ChessLessonProgress {
  const current = read();
  if (current.completed.includes(lessonId)) {
    return current;
  }
  const completed = [...current.completed, lessonId];
  const stars = Math.min(CHESS_LESSONS.length, completed.length);
  const next = {completed, stars};
  write(next);
  return next;
}

export function isLessonUnlocked(
  lessonId: ChessLessonId,
  progress = read(),
): boolean {
  const order = CHESS_LESSONS.find(l => l.id === lessonId)?.order ?? 1;
  if (order === 1) {
    return true;
  }
  const previous = CHESS_LESSONS.find(l => l.order === order - 1);
  return previous ? progress.completed.includes(previous.id) : true;
}
