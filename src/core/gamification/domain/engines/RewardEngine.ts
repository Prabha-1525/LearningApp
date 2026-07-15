import type {ChildId} from '@core/domain';
import type {IsoDateTimeString} from '@shared/types';

import type {
  CelebrationEvent,
  GrantResult,
  RewardGrantIntent,
} from '../entities/RewardGrant';
import {levelFromTotalXp} from '../policies/levelCurve';
import {clampGrant} from '../policies/rewardCaps';
import {nextStreak, toLocalDateKey} from '../policies/streakCalendar';
import type {
  GamificationSnapshot,
  LedgerEventId,
  PlayerXpRecord,
  RewardLedgerEventRecord,
} from '../schema/RewardDatabase';

function nowIso(): IsoDateTimeString {
  return new Date().toISOString() as IsoDateTimeString;
}

function emptySnapshot(childId: ChildId): GamificationSnapshot {
  const at = nowIso();
  return {
    wallet: {childId, stars: 0, coins: 0, updatedAt: at},
    xp: {
      childId,
      xpTotal: 0,
      level: 1,
      xpIntoLevel: 0,
      xpToNextLevel: levelFromTotalXp(0).xpToNextLevel,
      updatedAt: at,
    },
    achievements: [],
    badges: [],
    daily: {
      childId,
      dayIndex: 0,
      lastClaimDate: null,
      claimedToday: false,
    },
    streak: {
      childId,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    },
    avatars: [],
  };
}

function withXp(
  childId: ChildId,
  xpTotal: number,
  at: IsoDateTimeString,
): PlayerXpRecord {
  const derived = levelFromTotalXp(xpTotal);
  return {
    childId,
    xpTotal,
    level: derived.level,
    xpIntoLevel: derived.xpIntoLevel,
    xpToNextLevel: derived.xpToNextLevel,
    updatedAt: at,
  };
}

/**
 * Pure gamification engine — no IO.
 * Modules call use cases → engine.applyGrant(snapshot, intent).
 */
export class RewardEngine {
  createEmptySnapshot(childId: ChildId): GamificationSnapshot {
    return emptySnapshot(childId);
  }

  applyGrant(
    snapshot: GamificationSnapshot,
    intent: RewardGrantIntent,
    ledgerId: LedgerEventId,
  ): GrantResult {
    const at = intent.at ?? nowIso();
    const clamped = clampGrant({
      stars: intent.stars ?? 0,
      coins: intent.coins ?? 0,
      xp: intent.xp ?? 0,
    });

    const previousLevel = snapshot.xp.level;
    const xpTotal = snapshot.xp.xpTotal + clamped.xp;
    const xp = withXp(intent.childId, xpTotal, at);
    const leveledUp = xp.level > previousLevel;

    const wallet = {
      ...snapshot.wallet,
      stars: snapshot.wallet.stars + clamped.stars,
      coins: snapshot.wallet.coins + clamped.coins,
      updatedAt: at,
    };

    let achievements = snapshot.achievements;
    if (
      intent.achievementId &&
      !achievements.some(a => a.achievementId === intent.achievementId)
    ) {
      achievements = [
        ...achievements,
        {
          childId: intent.childId,
          achievementId: intent.achievementId,
          unlockedAt: at,
          moduleId: intent.moduleId ?? null,
        },
      ];
    }

    let badges = snapshot.badges;
    if (intent.badgeId && !badges.some(b => b.badgeId === intent.badgeId)) {
      badges = [
        ...badges,
        {
          childId: intent.childId,
          badgeId: intent.badgeId,
          earnedAt: at,
        },
      ];
    }

    let avatars = snapshot.avatars;
    if (
      intent.avatarUnlockId &&
      !avatars.some(a => a.avatarUnlockId === intent.avatarUnlockId)
    ) {
      avatars = [
        ...avatars.map(a => ({...a, equipped: false})),
        {
          childId: intent.childId,
          avatarUnlockId: intent.avatarUnlockId,
          unlockedAt: at,
          equipped: true,
        },
      ];
    }

    const ledgerEvent: RewardLedgerEventRecord = {
      id: ledgerId,
      childId: intent.childId,
      at,
      source: intent.source,
      moduleId: intent.moduleId ?? null,
      reasonCode: intent.reasonCode,
      deltaStars: clamped.stars,
      deltaCoins: clamped.coins,
      deltaXp: clamped.xp,
      achievementId: intent.achievementId ?? null,
      badgeId: intent.badgeId ?? null,
      avatarUnlockId: intent.avatarUnlockId ?? null,
      celebrationKey: intent.celebrationKey ?? null,
      synced: false,
    };

    const celebrations = this.buildCelebrations({
      clamped,
      leveledUp,
      levelReached: xp.level,
      intent,
    });

    return {
      snapshot: {
        ...snapshot,
        wallet,
        xp,
        achievements,
        badges,
        avatars,
      },
      ledgerEvent,
      celebrations,
      leveledUp,
    };
  }

  /** Touch daily activity streak (login / lesson complete). */
  recordDailyActivity(
    snapshot: GamificationSnapshot,
    today = toLocalDateKey(),
  ): GamificationSnapshot {
    const {currentStreak, longestDelta} = nextStreak(
      snapshot.streak.lastActiveDate,
      snapshot.streak.currentStreak,
      today,
    );
    return {
      ...snapshot,
      streak: {
        ...snapshot.streak,
        currentStreak,
        longestStreak: Math.max(
          snapshot.streak.longestStreak,
          longestDelta || snapshot.streak.longestStreak,
          currentStreak,
        ),
        lastActiveDate: today,
      },
      daily: {
        ...snapshot.daily,
        claimedToday:
          snapshot.daily.lastClaimDate === today
            ? snapshot.daily.claimedToday
            : false,
      },
    };
  }

  claimDailyReward(
    snapshot: GamificationSnapshot,
    intentBase: Omit<RewardGrantIntent, 'stars' | 'coins' | 'xp' | 'source'>,
    ledgerId: LedgerEventId,
    today = toLocalDateKey(),
    rewardForDay: {stars: number; coins: number; xp: number},
  ): GrantResult | {readonly error: 'already_claimed'} {
    if (snapshot.daily.lastClaimDate === today && snapshot.daily.claimedToday) {
      return {error: 'already_claimed'};
    }

    const withStreak = this.recordDailyActivity(snapshot, today);
    const dayIndex = (withStreak.daily.dayIndex + 1) % 7;

    const grant = this.applyGrant(
      {
        ...withStreak,
        daily: {
          ...withStreak.daily,
          dayIndex,
          lastClaimDate: today,
          claimedToday: true,
        },
      },
      {
        ...intentBase,
        source: 'daily',
        stars: rewardForDay.stars,
        coins: rewardForDay.coins,
        xp: rewardForDay.xp,
        celebrationKey: intentBase.celebrationKey ?? 'daily_claim',
        reasonCode: intentBase.reasonCode || 'daily_reward',
      },
      ledgerId,
    );

    return {
      ...grant,
      snapshot: {
        ...grant.snapshot,
        daily: {
          ...grant.snapshot.daily,
          dayIndex,
          lastClaimDate: today,
          claimedToday: true,
        },
      },
      celebrations: [
        ...grant.celebrations,
        {
          kind: 'daily',
          titleKey: 'gamification.celebration.daily',
          starsEarned: rewardForDay.stars,
          coinsEarned: rewardForDay.coins,
          xpEarned: rewardForDay.xp,
          animation: 'shine',
        },
        ...(withStreak.streak.currentStreak > 1
          ? [
              {
                kind: 'streak' as const,
                titleKey: 'gamification.celebration.streak',
                detailKey: 'gamification.celebration.streakDetail',
                starsEarned: 0,
                coinsEarned: 0,
                xpEarned: 0,
                animation: 'pulse' as const,
              },
            ]
          : []),
      ],
    };
  }

  private buildCelebrations(input: {
    clamped: {stars: number; coins: number; xp: number};
    leveledUp: boolean;
    levelReached: number;
    intent: RewardGrantIntent;
  }): CelebrationEvent[] {
    const events: CelebrationEvent[] = [];
    if (input.clamped.stars > 0) {
      events.push({
        kind: 'stars',
        titleKey: 'gamification.celebration.stars',
        starsEarned: input.clamped.stars,
        coinsEarned: 0,
        xpEarned: 0,
        animation: 'burst',
      });
    }
    if (input.clamped.coins > 0) {
      events.push({
        kind: 'coins',
        titleKey: 'gamification.celebration.coins',
        starsEarned: 0,
        coinsEarned: input.clamped.coins,
        xpEarned: 0,
        animation: 'shine',
      });
    }
    if (input.leveledUp) {
      events.push({
        kind: 'level_up',
        titleKey: 'gamification.celebration.levelUp',
        starsEarned: 0,
        coinsEarned: 0,
        xpEarned: input.clamped.xp,
        levelReached: input.levelReached,
        animation: 'confetti',
      });
    }
    if (input.intent.achievementId) {
      events.push({
        kind: 'achievement',
        titleKey: 'gamification.celebration.achievement',
        starsEarned: 0,
        coinsEarned: 0,
        xpEarned: 0,
        animation: 'confetti',
      });
    }
    if (input.intent.badgeId) {
      events.push({
        kind: 'badge',
        titleKey: 'gamification.celebration.badge',
        starsEarned: 0,
        coinsEarned: 0,
        xpEarned: 0,
        animation: 'shine',
      });
    }
    if (input.intent.avatarUnlockId) {
      events.push({
        kind: 'avatar',
        titleKey: 'gamification.celebration.avatar',
        starsEarned: 0,
        coinsEarned: 0,
        xpEarned: 0,
        animation: 'pulse',
      });
    }
    return events;
  }
}

export const rewardEngine = new RewardEngine();
