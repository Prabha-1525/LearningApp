import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {DEFAULT_MONEY_PROGRESS, type MoneyProgress} from './types';

const MONEY_PROGRESS_KEY = StorageKeys.module('math', 'moneyProgress');

export function readMoneyProgress(): MoneyProgress {
  const raw = mmkvStorage.getString(MONEY_PROGRESS_KEY);
  if (!raw) {
    return DEFAULT_MONEY_PROGRESS;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<MoneyProgress>;
    return {
      completedTabs: parsed.completedTabs ?? [],
      totalStars: parsed.totalStars ?? 0,
      shoppingPurchases: parsed.shoppingPurchases ?? 0,
      changePuzzlesSolved: parsed.changePuzzlesSolved ?? 0,
      coinChallengesCompleted: parsed.coinChallengesCompleted ?? 0,
      quizScore: parsed.quizScore ?? 0,
      lastPlayedAt: parsed.lastPlayedAt,
    };
  } catch {
    return DEFAULT_MONEY_PROGRESS;
  }
}

export function writeMoneyProgress(progress: MoneyProgress): void {
  mmkvStorage.setString(
    MONEY_PROGRESS_KEY,
    JSON.stringify({
      ...progress,
      lastPlayedAt: new Date().toISOString(),
    }),
  );
  try {
    const {getActiveCloudUid, scheduleProgressSync} =
      require('@infrastructure/auth') as typeof import('@infrastructure/auth');
    const uid = getActiveCloudUid();
    if (uid) {
      scheduleProgressSync(uid, 'math');
    }
  } catch {
    // Cloud sync optional
  }
}

export function recordMoneyTabCompleted(
  tabId: string,
  starsEarned = 1,
): MoneyProgress {
  const current = readMoneyProgress();
  const tabs = new Set(current.completedTabs);
  tabs.add(tabId);
  const updated: MoneyProgress = {
    ...current,
    completedTabs: Array.from(tabs),
    totalStars: current.totalStars + starsEarned,
  };
  writeMoneyProgress(updated);
  return updated;
}

export function recordCoinChallengeDone(): MoneyProgress {
  const current = readMoneyProgress();
  const updated: MoneyProgress = {
    ...current,
    coinChallengesCompleted: current.coinChallengesCompleted + 1,
    totalStars: current.totalStars + 1,
  };
  writeMoneyProgress(updated);
  return updated;
}

export function recordShoppingPurchase(): MoneyProgress {
  const current = readMoneyProgress();
  const updated: MoneyProgress = {
    ...current,
    shoppingPurchases: current.shoppingPurchases + 1,
    totalStars: current.totalStars + 1,
  };
  writeMoneyProgress(updated);
  return updated;
}

export function recordChangePuzzleSolved(): MoneyProgress {
  const current = readMoneyProgress();
  const updated: MoneyProgress = {
    ...current,
    changePuzzlesSolved: current.changePuzzlesSolved + 1,
    totalStars: current.totalStars + 1,
  };
  writeMoneyProgress(updated);
  return updated;
}

export function recordMoneyQuizScore(score: number): MoneyProgress {
  const current = readMoneyProgress();
  const updated: MoneyProgress = {
    ...current,
    quizScore: Math.max(current.quizScore, score),
    totalStars: current.totalStars + Math.min(3, Math.ceil(score / 3)),
  };
  writeMoneyProgress(updated);
  return updated;
}
