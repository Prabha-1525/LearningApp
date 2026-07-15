import type {ChildId} from '@core/domain';

import {dailyRewardTable} from '../domain/catalog/rewardCatalog';
import {rewardEngine} from '../domain/engines/RewardEngine';
import type {
  CelebrationEvent,
  GrantResult,
  RewardGrantIntent,
} from '../domain/entities/RewardGrant';
import type {GamificationRepository} from '../domain/ports/GamificationRepository';
import type {LedgerEventId} from '../domain/schema/RewardDatabase';

function newLedgerId(): LedgerEventId {
  return `ledger_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}` as LedgerEventId;
}

export type GrantRewardsResult =
  | {readonly ok: true; readonly value: GrantResult}
  | {readonly ok: false; readonly error: Error};

export async function grantRewards(
  repo: GamificationRepository,
  intent: RewardGrantIntent,
): Promise<GrantRewardsResult> {
  const loaded = await repo.loadSnapshot(intent.childId);
  if (!loaded.ok) {
    return {ok: false, error: loaded.error};
  }

  const withActivity = rewardEngine.recordDailyActivity(loaded.value);
  const result = rewardEngine.applyGrant(withActivity, intent, newLedgerId());

  const saved = await repo.saveSnapshot(result.snapshot);
  if (!saved.ok) {
    return {ok: false, error: saved.error};
  }
  const ledged = await repo.appendLedger(result.ledgerEvent);
  if (!ledged.ok) {
    return {ok: false, error: ledged.error};
  }

  return {ok: true, value: result};
}

export async function claimDailyRewards(
  repo: GamificationRepository,
  childId: ChildId,
): Promise<
  | {readonly ok: true; readonly value: GrantResult}
  | {readonly ok: false; readonly error: Error | 'already_claimed'}
> {
  const loaded = await repo.loadSnapshot(childId);
  if (!loaded.ok) {
    return {ok: false, error: loaded.error};
  }

  const dayIndex = loaded.value.daily.dayIndex % dailyRewardTable.length;
  const table = dailyRewardTable[dayIndex] ?? dailyRewardTable[0];
  if (table == null) {
    return {ok: false, error: new Error('daily table missing')};
  }

  const claimed = rewardEngine.claimDailyReward(
    loaded.value,
    {
      childId,
      reasonCode: `daily_day_${dayIndex}`,
    },
    newLedgerId(),
    undefined,
    table,
  );

  if ('error' in claimed) {
    return {ok: false, error: claimed.error};
  }

  const saved = await repo.saveSnapshot(claimed.snapshot);
  if (!saved.ok) {
    return {ok: false, error: saved.error};
  }
  await repo.appendLedger(claimed.ledgerEvent);
  return {ok: true, value: claimed};
}

export type {CelebrationEvent, GrantResult, RewardGrantIntent};
