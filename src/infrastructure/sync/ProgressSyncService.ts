import type {ChildId, FirestoreProgressBundle} from '@core/domain';
import {asChildId} from '@core/domain';
import {
  getChessLessonProgress,
  replaceChessLessonProgress,
  type ChessLessonProgress,
} from '@features/chess/data/lessonProgress';
import {
  getMathProgress,
  replaceMathProgress,
  type MathProgress,
} from '@features/math/data/mathProgress';
import {createMmkvGamificationRepository} from '@core/gamification';
import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import {
  createUserCloudRepository,
  type UserCloudRepository,
} from '../firebase/userCloudRepository';
import {
  clearSyncOutboxFor,
  enqueueSync,
  listSyncOutbox,
  type SyncOutboxItem,
} from './SyncOutbox';

const GENERAL_KEY = StorageKeys.module('progress', 'general');
const ACTIVE_UID_KEY = StorageKeys.core.activeChildId;

let flushing = false;

function readGeneral() {
  const raw = mmkvStorage.getString(GENERAL_KEY);
  if (!raw) {
    return {
      stars: 0,
      rewards: 0,
      badges: [] as string[],
      coins: 0,
      dailyStreak: 0,
      lastPlayed: null as string | null,
      completedLessons: 0,
      currentLesson: null as string | null,
      totalLearningTimeSeconds: 0,
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {
      stars: 0,
      rewards: 0,
      badges: [] as string[],
      coins: 0,
      dailyStreak: 0,
      lastPlayed: null,
      completedLessons: 0,
      currentLesson: null,
      totalLearningTimeSeconds: 0,
    };
  }
}

function writeGeneral(value: unknown): void {
  mmkvStorage.setString(GENERAL_KEY, JSON.stringify(value));
}

export function setActiveCloudUid(uid: string): void {
  mmkvStorage.setString(ACTIVE_UID_KEY, uid);
}

export function getActiveCloudUid(): string | undefined {
  return mmkvStorage.getString(ACTIVE_UID_KEY);
}

/**
 * Apply Firestore progress into MMKV (source of truth after login restore).
 */
export async function hydrateProgressFromCloud(
  uid: string,
  bundle: FirestoreProgressBundle,
): Promise<void> {
  if (bundle.math && typeof bundle.math === 'object') {
    replaceMathProgress(bundle.math as MathProgress);
  }
  if (bundle.chess && typeof bundle.chess === 'object') {
    replaceChessLessonProgress(bundle.chess as ChessLessonProgress);
  }
  if (bundle.general) {
    writeGeneral(bundle.general);
  }
  if (bundle.gamification && typeof bundle.gamification === 'object') {
    const repo = createMmkvGamificationRepository();
    await repo.saveSnapshot(
      bundle.gamification as Parameters<typeof repo.saveSnapshot>[0],
    );
  }
  setActiveCloudUid(uid);
}

/**
 * Queue a module for background Firebase sync after local MMKV write.
 */
export function scheduleProgressSync(
  uid: string,
  module: SyncOutboxItem['module'],
): void {
  enqueueSync(uid, module);
  void flushProgressSync();
}

export async function collectLocalProgressBundle(
  uid: string,
): Promise<Partial<FirestoreProgressBundle>> {
  const childId = asChildId(uid) as ChildId;
  const gamificationRepo = createMmkvGamificationRepository();
  const gamificationResult = await gamificationRepo.loadSnapshot(childId);
  return {
    math: getMathProgress(),
    chess: getChessLessonProgress(),
    general: readGeneral(),
    gamification: gamificationResult.ok ? gamificationResult.value : null,
  };
}

/**
 * Push pending outbox items to Firestore when online.
 */
export async function flushProgressSync(
  cloud: UserCloudRepository = createUserCloudRepository(),
): Promise<void> {
  if (flushing) {
    return;
  }
  flushing = true;
  try {
    let NetInfo: {fetch: () => Promise<{isConnected: boolean | null}>};
    try {
      NetInfo = require('@react-native-community/netinfo').default;
    } catch {
      return;
    }
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      return;
    }

    const pending = listSyncOutbox();
    if (pending.length === 0) {
      return;
    }

    const byUid = new Map<string, Set<SyncOutboxItem['module']>>();
    for (const item of pending) {
      const set = byUid.get(item.uid) ?? new Set();
      set.add(item.module);
      byUid.set(item.uid, set);
    }

    for (const [uid, modules] of byUid) {
      const local = await collectLocalProgressBundle(uid);
      const partial: {
        math?: unknown;
        chess?: unknown;
        english?: unknown;
        gamification?: unknown;
        general?: FirestoreProgressBundle['general'];
      } = {};
      for (const module of modules) {
        if (module === 'math') {
          partial.math = local.math;
        }
        if (module === 'chess') {
          partial.chess = local.chess;
        }
        if (module === 'english') {
          partial.english = local.english ?? null;
        }
        if (module === 'gamification') {
          partial.gamification = local.gamification;
        }
        if (module === 'general') {
          partial.general = local.general;
        }
      }
      const result = await cloud.uploadProgress(uid, partial);
      if (result.ok) {
        for (const module of modules) {
          clearSyncOutboxFor(uid, module);
        }
      } else if (__DEV__) {
        // Keep soft — child should not see sync failures mid-play.
        console.warn('[sync] upload failed', uid, result.error.message);
      }
    }
  } finally {
    flushing = false;
  }
}

export function startProgressSyncListener(): () => void {
  let unsubscribe: (() => void) | undefined;
  try {
    const NetInfo = require('@react-native-community/netinfo').default;
    unsubscribe = NetInfo.addEventListener(
      (state: {isConnected: boolean | null}) => {
        if (state.isConnected) {
          void flushProgressSync();
        }
      },
    );
  } catch {
    // NetInfo unavailable in tests
  }
  return () => {
    unsubscribe?.();
  };
}
