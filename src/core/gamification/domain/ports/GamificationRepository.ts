import type {ChildId} from '@core/domain';
import type {Result} from '@shared/lib';

import type {
  GamificationSnapshot,
  RewardLedgerEventRecord,
} from '../schema/RewardDatabase';

export type GamificationRepository = {
  loadSnapshot(childId: ChildId): Promise<Result<GamificationSnapshot>>;
  saveSnapshot(snapshot: GamificationSnapshot): Promise<Result<void>>;
  appendLedger(event: RewardLedgerEventRecord): Promise<Result<void>>;
  listUnsyncedLedger(
    childId: ChildId,
  ): Promise<Result<readonly RewardLedgerEventRecord[]>>;
  markLedgerSynced(ids: readonly string[]): Promise<Result<void>>;
};
