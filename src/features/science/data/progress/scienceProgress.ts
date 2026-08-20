import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {ScienceTopicId} from '../../domain/entities/ScienceTopic';
import {
  DEFAULT_SCIENCE_PROGRESS,
  type ScienceProgress,
  type TopicProgress,
} from '../../domain/entities/ScienceProgress';

const PROGRESS_KEY = StorageKeys.module('science', 'userProgress');

export function readScienceProgress(): ScienceProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_SCIENCE_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<ScienceProgress>;
    const defaultTopics = DEFAULT_SCIENCE_PROGRESS.topicsProgress;
    const topicsProgress = {
      ...defaultTopics,
      ...(parsed.topicsProgress ?? {}),
    } as Record<ScienceTopicId, TopicProgress>;

    return {
      topicsProgress,
      completedExperiments: parsed.completedExperiments ?? [],
      totalStars: parsed.totalStars ?? 0,
      quizzesCompleted: parsed.quizzesCompleted ?? 0,
    };
  } catch {
    return DEFAULT_SCIENCE_PROGRESS;
  }
}

export function writeScienceProgress(progress: ScienceProgress): void {
  try {
    mmkvStorage.setString(PROGRESS_KEY, JSON.stringify(progress));
    try {
      const {getActiveCloudUid, scheduleProgressSync} =
        require('@infrastructure/auth') as typeof import('@infrastructure/auth');
      const uid = getActiveCloudUid();
      if (uid) {
        scheduleProgressSync(uid, 'science' as any);
      }
    } catch {
      // optional sync
    }
  } catch {
    // ignore write errors
  }
}

export function recordTopicCompletion(
  topicId: ScienceTopicId,
  starsEarned: number,
): ScienceProgress {
  const current = readScienceProgress();
  const existing = current.topicsProgress[topicId] ?? {
    completed: false,
    stars: 0,
    attempts: 0,
  };

  const newStars = Math.max(existing.stars, starsEarned);
  const starsDiff = newStars - existing.stars;

  const next: ScienceProgress = {
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

  writeScienceProgress(next);
  return next;
}

export function recordExperimentCompletion(
  experimentId: string,
): ScienceProgress {
  const current = readScienceProgress();
  if (current.completedExperiments.includes(experimentId)) {
    return current;
  }
  const next: ScienceProgress = {
    ...current,
    completedExperiments: [...current.completedExperiments, experimentId],
    totalStars: current.totalStars + 1,
  };
  writeScienceProgress(next);
  return next;
}

export function recordQuizCompletion(score: number): ScienceProgress {
  const current = readScienceProgress();
  const next: ScienceProgress = {
    ...current,
    quizzesCompleted: current.quizzesCompleted + 1,
    totalStars: current.totalStars + (score >= 4 ? 3 : score >= 2 ? 2 : 1),
  };
  writeScienceProgress(next);
  return next;
}
