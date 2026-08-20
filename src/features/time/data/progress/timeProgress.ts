import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import {
  DEFAULT_TIME_PROGRESS,
  type TimeProgress,
  type TimeTopicId,
  type TopicProgress,
} from '../../domain/entities/timeEntities';

const PROGRESS_KEY = StorageKeys.module('time', 'userProgress');

export function readTimeProgress(): TimeProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_TIME_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<TimeProgress>;
    const defaultTopics = DEFAULT_TIME_PROGRESS.topicsProgress;
    const topicsProgress = {
      ...defaultTopics,
      ...(parsed.topicsProgress ?? {}),
    } as Record<TimeTopicId, TopicProgress>;

    return {
      topicsProgress,
      clockChallengesCompleted: parsed.clockChallengesCompleted ?? [],
      totalStars: parsed.totalStars ?? 0,
      quizzesCompleted: parsed.quizzesCompleted ?? 0,
      calendarExplored: parsed.calendarExplored ?? false,
    };
  } catch {
    return DEFAULT_TIME_PROGRESS;
  }
}

export function writeTimeProgress(progress: TimeProgress): void {
  try {
    mmkvStorage.setString(PROGRESS_KEY, JSON.stringify(progress));
    try {
      const {getActiveCloudUid, scheduleProgressSync} =
        require('@infrastructure/auth') as typeof import('@infrastructure/auth');
      const uid = getActiveCloudUid();
      if (uid) {
        scheduleProgressSync(uid, 'time' as any);
      }
    } catch {
      // optional sync
    }
  } catch {
    // ignore write errors
  }
}

export function recordTimeTopicCompletion(
  topicId: TimeTopicId,
  starsEarned: number,
): TimeProgress {
  const current = readTimeProgress();
  const existing = current.topicsProgress[topicId] ?? {
    completed: false,
    stars: 0,
    attempts: 0,
  };

  const newStars = Math.max(existing.stars, starsEarned);
  const starsDiff = newStars - existing.stars;

  const next: TimeProgress = {
    ...current,
    topicsProgress: {
      ...current.topicsProgress,
      [topicId]: {
        completed: true,
        stars: newStars,
        attempts: existing.attempts + 1,
        lastPlayedAt: new Date().toISOString(),
      },
    },
    totalStars: current.totalStars + starsDiff,
  };

  writeTimeProgress(next);
  return next;
}

export function recordClockChallengeCompletion(
  challengeId: string,
): TimeProgress {
  const current = readTimeProgress();
  if (current.clockChallengesCompleted.includes(challengeId)) {
    return current;
  }
  const next: TimeProgress = {
    ...current,
    clockChallengesCompleted: [
      ...current.clockChallengesCompleted,
      challengeId,
    ],
    totalStars: current.totalStars + 1,
  };
  writeTimeProgress(next);
  return next;
}

export function recordCalendarExplored(): TimeProgress {
  const current = readTimeProgress();
  if (current.calendarExplored) {
    return current;
  }
  const next: TimeProgress = {
    ...current,
    calendarExplored: true,
    totalStars: current.totalStars + 1,
  };
  writeTimeProgress(next);
  return next;
}

export function recordQuizCompletion(score: number): TimeProgress {
  const current = readTimeProgress();
  const next: TimeProgress = {
    ...current,
    quizzesCompleted: current.quizzesCompleted + 1,
    totalStars: current.totalStars + (score >= 4 ? 3 : score >= 2 ? 2 : 1),
  };
  writeTimeProgress(next);
  return next;
}
