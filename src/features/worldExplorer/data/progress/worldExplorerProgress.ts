import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

const PROGRESS_KEY = StorageKeys.module('worldExplorer', 'userProgress');

export type WorldExplorerProgress = {
  readonly exploredCountryCodes: readonly string[];
  readonly learnedFlagCodes: readonly string[];
  readonly exploredContinents: readonly string[];
  readonly learnedCapitals: readonly string[];
  readonly exploredLandmarkIds: readonly string[];
  readonly quizCompletedCount: number;
  readonly stars: number;
};

const DEFAULT_PROGRESS: WorldExplorerProgress = {
  exploredCountryCodes: [],
  learnedFlagCodes: [],
  exploredContinents: [],
  learnedCapitals: [],
  exploredLandmarkIds: [],
  quizCompletedCount: 0,
  stars: 0,
};

export function readWorldExplorerProgress(): WorldExplorerProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<WorldExplorerProgress>;
    return {
      exploredCountryCodes: parsed.exploredCountryCodes ?? [],
      learnedFlagCodes: parsed.learnedFlagCodes ?? [],
      exploredContinents: parsed.exploredContinents ?? [],
      learnedCapitals: parsed.learnedCapitals ?? [],
      exploredLandmarkIds: parsed.exploredLandmarkIds ?? [],
      quizCompletedCount: parsed.quizCompletedCount ?? 0,
      stars: parsed.stars ?? 0,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function writeWorldExplorerProgress(
  progress: WorldExplorerProgress,
): void {
  try {
    mmkvStorage.setString(PROGRESS_KEY, JSON.stringify(progress));
    try {
      const {getActiveCloudUid, scheduleProgressSync} =
        require('@infrastructure/auth') as typeof import('@infrastructure/auth');
      const uid = getActiveCloudUid();
      if (uid) {
        scheduleProgressSync(uid, 'worldExplorer');
      }
    } catch {
      // optional sync
    }
  } catch {
    // optional write catch
  }
}

export function markCountryExplored(
  countryCode: string,
): WorldExplorerProgress {
  const current = readWorldExplorerProgress();
  const upper = countryCode.toUpperCase();
  if (current.exploredCountryCodes.includes(upper)) {
    return current;
  }
  const next: WorldExplorerProgress = {
    ...current,
    exploredCountryCodes: [...current.exploredCountryCodes, upper],
    stars: current.stars + 1,
  };
  writeWorldExplorerProgress(next);
  return next;
}

export function markFlagLearned(countryCode: string): WorldExplorerProgress {
  const current = readWorldExplorerProgress();
  const upper = countryCode.toUpperCase();
  if (current.learnedFlagCodes.includes(upper)) {
    return current;
  }
  const next: WorldExplorerProgress = {
    ...current,
    learnedFlagCodes: [...current.learnedFlagCodes, upper],
    stars: current.stars + 1,
  };
  writeWorldExplorerProgress(next);
  return next;
}

export function markContinentExplored(
  continentId: string,
): WorldExplorerProgress {
  const current = readWorldExplorerProgress();
  if (current.exploredContinents.includes(continentId)) {
    return current;
  }
  const next: WorldExplorerProgress = {
    ...current,
    exploredContinents: [...current.exploredContinents, continentId],
    stars: current.stars + 2,
  };
  writeWorldExplorerProgress(next);
  return next;
}

export function markCapitalLearned(countryCode: string): WorldExplorerProgress {
  const current = readWorldExplorerProgress();
  const upper = countryCode.toUpperCase();
  if (current.learnedCapitals.includes(upper)) {
    return current;
  }
  const next: WorldExplorerProgress = {
    ...current,
    learnedCapitals: [...current.learnedCapitals, upper],
    stars: current.stars + 1,
  };
  writeWorldExplorerProgress(next);
  return next;
}

export function markLandmarkExplored(
  landmarkId: string,
): WorldExplorerProgress {
  const current = readWorldExplorerProgress();
  if (current.exploredLandmarkIds.includes(landmarkId)) {
    return current;
  }
  const next: WorldExplorerProgress = {
    ...current,
    exploredLandmarkIds: [...current.exploredLandmarkIds, landmarkId],
    stars: current.stars + 1,
  };
  writeWorldExplorerProgress(next);
  return next;
}

export function recordQuizCompleted(earnedStars = 3): WorldExplorerProgress {
  const current = readWorldExplorerProgress();
  const next: WorldExplorerProgress = {
    ...current,
    quizCompletedCount: current.quizCompletedCount + 1,
    stars: current.stars + earnedStars,
  };
  writeWorldExplorerProgress(next);
  return next;
}
