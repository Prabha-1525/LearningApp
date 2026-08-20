import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_CODING_PROGRESS,
  type CodingProgress,
  type CodingTopicId,
  type TopicProgress,
} from '../../domain/entities/codingEntities';

const PROGRESS_KEY = StorageKeys.module('coding', 'userProgress');

export function readCodingProgress(): CodingProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_CODING_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<CodingProgress>;
    return {
      topicsProgress: {
        ...DEFAULT_CODING_PROGRESS.topicsProgress,
        ...(parsed.topicsProgress ?? {}),
      },
      robotMazesSolved:
        parsed.robotMazesSolved ?? DEFAULT_CODING_PROGRESS.robotMazesSolved,
      debuggingPuzzlesSolved:
        parsed.debuggingPuzzlesSolved ??
        DEFAULT_CODING_PROGRESS.debuggingPuzzlesSolved,
      sequencingPuzzlesSolved:
        parsed.sequencingPuzzlesSolved ??
        DEFAULT_CODING_PROGRESS.sequencingPuzzlesSolved,
      totalStars: parsed.totalStars ?? DEFAULT_CODING_PROGRESS.totalStars,
    };
  } catch {
    return DEFAULT_CODING_PROGRESS;
  }
}

export function writeCodingProgress(progress: CodingProgress): void {
  try {
    mmkvStorage.set(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // silently ignore persistence error
  }
}

export function recordCodingTopicCompletion(
  topicId: CodingTopicId,
  starsEarned: number,
): CodingProgress {
  const current = readCodingProgress();
  const prevTopic: TopicProgress = current.topicsProgress[topicId] ?? {
    completed: false,
    stars: 0,
  };

  const newStars = Math.max(prevTopic.stars, starsEarned);
  const updatedTopics: Record<CodingTopicId, TopicProgress> = {
    ...current.topicsProgress,
    [topicId]: {
      completed: true,
      stars: newStars,
    },
  };

  const allStars = Object.values(updatedTopics).reduce(
    (acc, val) => acc + val.stars,
    0,
  );

  const updated: CodingProgress = {
    ...current,
    topicsProgress: updatedTopics,
    totalStars: allStars,
  };

  writeCodingProgress(updated);
  return updated;
}

export function recordRobotMazeSolved(
  _levelNumber: number,
  stars: number,
): CodingProgress {
  const current = readCodingProgress();
  const prevTopic = current.topicsProgress.robot ?? {
    completed: false,
    stars: 0,
  };
  const updatedTopic = {
    completed: true,
    stars: Math.max(prevTopic.stars, stars),
    highLevel: Math.max(prevTopic.highLevel ?? 1, _levelNumber),
  };

  const updated: CodingProgress = {
    ...current,
    topicsProgress: {
      ...current.topicsProgress,
      robot: updatedTopic,
    },
    robotMazesSolved: current.robotMazesSolved + 1,
    totalStars: current.totalStars + stars,
  };

  writeCodingProgress(updated);
  return updated;
}

export function recordDebuggingSolved(): CodingProgress {
  const current = readCodingProgress();
  const updated: CodingProgress = {
    ...current,
    debuggingPuzzlesSolved: current.debuggingPuzzlesSolved + 1,
  };
  writeCodingProgress(updated);
  return updated;
}

export function recordSequencingSolved(): CodingProgress {
  const current = readCodingProgress();
  const updated: CodingProgress = {
    ...current,
    sequencingPuzzlesSolved: current.sequencingPuzzlesSolved + 1,
  };
  writeCodingProgress(updated);
  return updated;
}
