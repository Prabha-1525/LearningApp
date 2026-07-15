import {asChildId} from '@core/domain';

import {rewardEngine} from '../engines/RewardEngine';
import {levelFromTotalXp, levelProgressRatio} from '../policies/levelCurve';
import {nextStreak} from '../policies/streakCalendar';

describe('levelCurve', () => {
  it('derives level from xp', () => {
    const low = levelFromTotalXp(0);
    expect(low.level).toBe(1);
    expect(levelProgressRatio(low.xpIntoLevel, low.xpToNextLevel)).toBe(0);

    const mid = levelFromTotalXp(200);
    expect(mid.level).toBeGreaterThan(1);
  });
});

describe('streakCalendar', () => {
  it('starts and continues streaks', () => {
    expect(nextStreak(null, 0, '2026-07-14')).toEqual({
      currentStreak: 1,
      longestDelta: 1,
    });
    expect(nextStreak('2026-07-13', 3, '2026-07-14')).toEqual({
      currentStreak: 4,
      longestDelta: 4,
    });
    expect(nextStreak('2026-07-10', 5, '2026-07-14')).toEqual({
      currentStreak: 1,
      longestDelta: 1,
    });
  });
});

describe('RewardEngine', () => {
  it('grants stars coins xp and can level up', () => {
    const childId = asChildId('child-1');
    const empty = rewardEngine.createEmptySnapshot(childId);
    const result = rewardEngine.applyGrant(
      empty,
      {
        childId,
        source: 'lesson',
        reasonCode: 'lesson_complete',
        stars: 3,
        coins: 10,
        xp: 80,
      },
      'ledger_1' as never,
    );

    expect(result.snapshot.wallet.stars).toBe(3);
    expect(result.snapshot.wallet.coins).toBe(10);
    expect(result.snapshot.xp.xpTotal).toBe(80);
    expect(result.celebrations.length).toBeGreaterThan(0);
    expect(result.ledgerEvent.deltaStars).toBe(3);
  });

  it('claims daily reward once per day', () => {
    const childId = asChildId('child-2');
    const empty = rewardEngine.createEmptySnapshot(childId);
    const first = rewardEngine.claimDailyReward(
      empty,
      {childId, reasonCode: 'daily'},
      'ledger_d1' as never,
      '2026-07-14',
      {stars: 2, coins: 5, xp: 10},
    );
    expect('error' in first).toBe(false);
    if ('error' in first) {
      return;
    }
    const second = rewardEngine.claimDailyReward(
      first.snapshot,
      {childId, reasonCode: 'daily'},
      'ledger_d2' as never,
      '2026-07-14',
      {stars: 2, coins: 5, xp: 10},
    );
    expect(second).toEqual({error: 'already_claimed'});
  });
});
