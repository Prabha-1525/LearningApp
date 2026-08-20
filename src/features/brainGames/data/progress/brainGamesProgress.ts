import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import type {BrainGameId} from '../../domain/entities/BrainGame';
import {
  DEFAULT_BRAIN_GAMES_PROGRESS,
  type BrainGamesProgress,
  type GameProgress,
} from '../../domain/entities/GameProgress';

const PROGRESS_KEY = StorageKeys.module('brainGames', 'userProgress');

export function readBrainGamesProgress(): BrainGamesProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_BRAIN_GAMES_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<BrainGamesProgress>;
    const defaultGamesProgress = DEFAULT_BRAIN_GAMES_PROGRESS.gamesProgress;
    const gamesProgress = {
      ...defaultGamesProgress,
      ...(parsed.gamesProgress ?? {}),
    } as Record<BrainGameId, GameProgress>;
    return {
      gamesProgress,
      totalStars: parsed.totalStars ?? 0,
      totalGamesPlayed: parsed.totalGamesPlayed ?? 0,
    };
  } catch {
    return DEFAULT_BRAIN_GAMES_PROGRESS;
  }
}

export function writeBrainGamesProgress(progress: BrainGamesProgress): void {
  try {
    mmkvStorage.setString(PROGRESS_KEY, JSON.stringify(progress));
    try {
      const {getActiveCloudUid, scheduleProgressSync} =
        require('@infrastructure/auth') as typeof import('@infrastructure/auth');
      const uid = getActiveCloudUid();
      if (uid) {
        scheduleProgressSync(uid, 'brainGames');
      }
    } catch {
      // optional sync
    }
  } catch {
    // ignore write failure
  }
}

export function recordGameCompletion(
  gameId: BrainGameId,
  starsEarned: number,
): BrainGamesProgress {
  const current = readBrainGamesProgress();
  const previous = current.gamesProgress[gameId];
  const bestStars = Math.max(previous.bestStars, starsEarned);
  const updated: BrainGamesProgress = {
    ...current,
    totalStars:
      current.totalStars + Math.max(0, starsEarned - previous.bestStars),
    totalGamesPlayed: current.totalGamesPlayed + 1,
    gamesProgress: {
      ...current.gamesProgress,
      [gameId]: {
        ...previous,
        bestStars,
        playCount: previous.playCount + 1,
      },
    },
  };
  writeBrainGamesProgress(updated);
  return updated;
}
