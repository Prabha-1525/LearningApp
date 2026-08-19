import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {DifficultyLevel} from '../domain/generators/types';
import {
  nextDifficultyLevel,
  defaultDifficultyForLesson,
} from '../domain/generators/random';
import type {MathLessonId} from '../domain/curriculum/types';

const PROGRESS_KEY = StorageKeys.module('math', 'progress');

export type LessonStats = {
  readonly attempted: number;
  readonly correct: number;
  readonly incorrect: number;
  readonly totalTimeMs: number;
  readonly difficultyLevel: DifficultyLevel;
  readonly lastPlayedAt: string | null;
};

export type MathProgress = {
  readonly global: {
    readonly attempted: number;
    readonly correct: number;
    readonly incorrect: number;
    readonly totalTimeMs: number;
  };
  readonly byLesson: Partial<Record<MathLessonId, LessonStats>>;
};

const EMPTY_LESSON = (lessonId: MathLessonId): LessonStats => ({
  attempted: 0,
  correct: 0,
  incorrect: 0,
  totalTimeMs: 0,
  difficultyLevel: defaultDifficultyForLesson(lessonId),
  lastPlayedAt: null,
});

function read(): MathProgress {
  const raw = mmkvStorage.getString(PROGRESS_KEY);
  if (!raw) {
    return {
      global: {attempted: 0, correct: 0, incorrect: 0, totalTimeMs: 0},
      byLesson: {},
    };
  }
  try {
    return JSON.parse(raw) as MathProgress;
  } catch {
    return {
      global: {attempted: 0, correct: 0, incorrect: 0, totalTimeMs: 0},
      byLesson: {},
    };
  }
}

function write(progress: MathProgress): void {
  mmkvStorage.setString(PROGRESS_KEY, JSON.stringify(progress));
  try {
    const {getActiveCloudUid, scheduleProgressSync} =
      require('@infrastructure/auth') as typeof import('@infrastructure/auth');
    const uid = getActiveCloudUid();
    if (uid) {
      scheduleProgressSync(uid, 'math');
    }
  } catch {
    // Sync layer optional during early boot / tests
  }
}

/** Replace entire math progress blob (used when restoring from Firestore). */
export function replaceMathProgress(progress: MathProgress): void {
  write(progress);
}

export function getMathProgress(): MathProgress {
  return read();
}

export function getLessonStats(lessonId: MathLessonId): LessonStats {
  return read().byLesson[lessonId] ?? EMPTY_LESSON(lessonId);
}

export function accuracy(stats: LessonStats): number {
  if (stats.attempted === 0) {
    return 0;
  }
  return Math.round((stats.correct / stats.attempted) * 100);
}

export function globalAccuracy(progress = read()): number {
  if (progress.global.attempted === 0) {
    return 0;
  }
  return Math.round(
    (progress.global.correct / progress.global.attempted) * 100,
  );
}

export function recordAnswer(
  lessonId: MathLessonId,
  correct: boolean,
  timeMs: number,
): MathProgress {
  const current = read();
  const lesson = current.byLesson[lessonId] ?? EMPTY_LESSON(lessonId);
  const attempted = lesson.attempted + 1;
  const correctCount = lesson.correct + (correct ? 1 : 0);
  const incorrectCount = lesson.incorrect + (correct ? 0 : 1);
  const difficultyLevel = nextDifficultyLevel(
    attempted,
    correctCount,
    lesson.difficultyLevel,
  );
  const updatedLesson: LessonStats = {
    attempted,
    correct: correctCount,
    incorrect: incorrectCount,
    totalTimeMs: lesson.totalTimeMs + timeMs,
    difficultyLevel,
    lastPlayedAt: new Date().toISOString(),
  };
  const next: MathProgress = {
    global: {
      attempted: current.global.attempted + 1,
      correct: current.global.correct + (correct ? 1 : 0),
      incorrect: current.global.incorrect + (correct ? 0 : 1),
      totalTimeMs: current.global.totalTimeMs + timeMs,
    },
    byLesson: {...current.byLesson, [lessonId]: updatedLesson},
  };
  write(next);
  return next;
}

export function setNumbersLevel(level: DifficultyLevel): MathProgress {
  const current = read();
  const lesson = current.byLesson.numbers ?? EMPTY_LESSON('numbers');
  const updated: LessonStats = {...lesson, difficultyLevel: level};
  const next: MathProgress = {
    ...current,
    byLesson: {...current.byLesson, numbers: updated},
  };
  write(next);
  return next;
}

export function isLessonUnlocked(_lessonId: MathLessonId): boolean {
  return true;
}

export function favoriteLessons(progress = read()): MathLessonId[] {
  return Object.entries(progress.byLesson)
    .sort((a, b) => (b[1]?.attempted ?? 0) - (a[1]?.attempted ?? 0))
    .slice(0, 3)
    .map(([id]) => id as MathLessonId);
}

export function getMathTopicProgress(
  topicId: string,
  lessonId?: string,
): number {
  const {countingCompletionPercent} = require('./countingProgress');
  const {missingCompletionPercent} = require('./missingProgress');
  const {equationCompletionPercent} = require('./equationProgress');
  const {isMathLessonId} = require('../domain/curriculum/types');

  if (topicId === 'counting' || lessonId === 'counting') {
    const cp = countingCompletionPercent();
    const stats = getLessonStats('counting');
    const part = Math.min(100, Math.round((stats.correct / 50) * 100));
    return Math.max(cp, part);
  }
  if (topicId === 'missing' || lessonId === 'missing') {
    const mp = missingCompletionPercent();
    const stats = getLessonStats('missing');
    const part = Math.min(100, Math.round((stats.correct / 50) * 100));
    return Math.max(mp, part);
  }
  if (topicId === 'addition' || lessonId === 'addition') {
    const ep = equationCompletionPercent('addition');
    const stats = getLessonStats('addition');
    const part = Math.min(100, Math.round((stats.correct / 50) * 100));
    return Math.max(ep, part);
  }
  if (topicId === 'subtraction' || lessonId === 'subtraction') {
    const ep = equationCompletionPercent('subtraction');
    const stats = getLessonStats('subtraction');
    const part = Math.min(100, Math.round((stats.correct / 50) * 100));
    return Math.max(ep, part);
  }
  if (lessonId && isMathLessonId(lessonId)) {
    const stats = getLessonStats(lessonId as MathLessonId);
    return Math.min(100, Math.round((stats.correct / 10) * 100));
  }
  return 0;
}

export function getOverallMathAdventureProgress(): number {
  const {
    MATH_ADVENTURE_TOPICS,
  } = require('../domain/curriculum/mathAdventureTopics');
  const playableTopics = MATH_ADVENTURE_TOPICS.filter(
    (t: {comingSoon?: boolean}) => !t.comingSoon,
  );
  if (playableTopics.length === 0) {
    return 0;
  }
  const sum = playableTopics.reduce(
    (acc: number, topic: {id: string; lessonId?: string}) =>
      acc + getMathTopicProgress(topic.id, topic.lessonId),
    0,
  );
  return Math.round(sum / playableTopics.length);
}
