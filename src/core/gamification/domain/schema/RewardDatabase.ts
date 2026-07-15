/**
 * Reward Database Design (logical schema).
 *
 * Local-first in MMKV/Redux; maps 1:1 to Firestore collections later.
 * Modules emit RewardGrantIntent — they never mutate wallet tables directly.
 */

import type {Brand, IsoDateTimeString} from '@shared/types';
import type {ChildId, ModuleId} from '@core/domain';

export type RewardDefinitionId = Brand<string, 'RewardDefinitionId'>;
export type AchievementId = Brand<string, 'AchievementId'>;
export type BadgeId = Brand<string, 'BadgeId'>;
export type AvatarUnlockId = Brand<string, 'AvatarUnlockId'>;
export type LedgerEventId = Brand<string, 'LedgerEventId'>;

export type CurrencyCode = 'stars' | 'coins';

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legend';

/** Catalog row — static definitions (seeded, versioned). */
export type RewardDefinitionRecord = {
  readonly id: RewardDefinitionId;
  readonly kind:
    | 'currency'
    | 'xp'
    | 'achievement'
    | 'badge'
    | 'avatar'
    | 'daily';
  readonly code: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly rarity: RewardRarity;
  readonly payload: Readonly<Record<string, string | number | boolean>>;
  readonly version: number;
};

/** Per-child wallet. */
export type PlayerWalletRecord = {
  readonly childId: ChildId;
  readonly stars: number;
  readonly coins: number;
  readonly updatedAt: IsoDateTimeString;
};

/** XP + derived level cache. */
export type PlayerXpRecord = {
  readonly childId: ChildId;
  readonly xpTotal: number;
  readonly level: number;
  readonly xpIntoLevel: number;
  readonly xpToNextLevel: number;
  readonly updatedAt: IsoDateTimeString;
};

export type AchievementUnlockRecord = {
  readonly childId: ChildId;
  readonly achievementId: AchievementId;
  readonly unlockedAt: IsoDateTimeString;
  readonly moduleId: ModuleId | null;
};

export type BadgeOwnedRecord = {
  readonly childId: ChildId;
  readonly badgeId: BadgeId;
  readonly earnedAt: IsoDateTimeString;
};

export type DailyRewardStateRecord = {
  readonly childId: ChildId;
  /** 0–6 index into daily calendar cycle */
  readonly dayIndex: number;
  readonly lastClaimDate: string | null; // YYYY-MM-DD local
  readonly claimedToday: boolean;
};

export type StreakStateRecord = {
  readonly childId: ChildId;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly lastActiveDate: string | null; // YYYY-MM-DD
};

export type AvatarUnlockRecord = {
  readonly childId: ChildId;
  readonly avatarUnlockId: AvatarUnlockId;
  readonly unlockedAt: IsoDateTimeString;
  readonly equipped: boolean;
};

/**
 * Append-only ledger — source of truth for audits & sync outbox.
 * Never delete; reconcile wallets from ledger in recovery tools.
 */
export type RewardLedgerEventRecord = {
  readonly id: LedgerEventId;
  readonly childId: ChildId;
  readonly at: IsoDateTimeString;
  readonly source:
    | 'lesson'
    | 'puzzle'
    | 'daily'
    | 'streak'
    | 'manual'
    | 'module';
  readonly moduleId: ModuleId | null;
  readonly reasonCode: string;
  readonly deltaStars: number;
  readonly deltaCoins: number;
  readonly deltaXp: number;
  readonly achievementId: AchievementId | null;
  readonly badgeId: BadgeId | null;
  readonly avatarUnlockId: AvatarUnlockId | null;
  readonly celebrationKey: string | null;
  readonly synced: boolean;
};

/** Aggregate snapshot hydrated into Redux. */
export type GamificationSnapshot = {
  wallet: PlayerWalletRecord;
  xp: PlayerXpRecord;
  achievements: AchievementUnlockRecord[];
  badges: BadgeOwnedRecord[];
  daily: DailyRewardStateRecord;
  streak: StreakStateRecord;
  avatars: AvatarUnlockRecord[];
};
