import type {ChildId, ModuleId} from '@core/domain';
import type {IsoDateTimeString} from '@shared/types';

import type {
  AchievementId,
  AvatarUnlockId,
  BadgeId,
  GamificationSnapshot,
  RewardLedgerEventRecord,
} from '../schema/RewardDatabase';

export type RewardGrantIntent = {
  readonly childId: ChildId;
  readonly source: RewardLedgerEventRecord['source'];
  readonly moduleId?: ModuleId | null;
  readonly reasonCode: string;
  readonly stars?: number;
  readonly coins?: number;
  readonly xp?: number;
  readonly achievementId?: AchievementId | null;
  readonly badgeId?: BadgeId | null;
  readonly avatarUnlockId?: AvatarUnlockId | null;
  readonly celebrationKey?: string | null;
  readonly at?: IsoDateTimeString;
};

export type CelebrationKind =
  | 'stars'
  | 'coins'
  | 'level_up'
  | 'achievement'
  | 'badge'
  | 'avatar'
  | 'daily'
  | 'streak';

export type CelebrationEvent = {
  readonly kind: CelebrationKind;
  readonly titleKey: string;
  readonly detailKey?: string;
  readonly starsEarned: number;
  readonly coinsEarned: number;
  readonly xpEarned: number;
  readonly levelReached?: number;
  readonly animation: 'burst' | 'confetti' | 'pulse' | 'shine';
};

export type GrantResult = {
  readonly snapshot: GamificationSnapshot;
  readonly ledgerEvent: RewardLedgerEventRecord;
  readonly celebrations: readonly CelebrationEvent[];
  readonly leveledUp: boolean;
};
