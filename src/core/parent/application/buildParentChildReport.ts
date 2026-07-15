import type {ChildId} from '@core/domain';
import {ModuleId} from '@core/domain';

import type {GamificationSnapshot} from '@core/gamification';

import type {
  DayBucket,
  ParentChildReport,
  ParentPeriodReport,
} from '../domain/ParentChildReport';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function buildWeekBuckets(): DayBucket[] {
  // Deterministic demo series until LearningSessionEvent pipeline ships.
  const minutes = [12, 18, 0, 22, 15, 10, 8];
  const lessons = [1, 1, 0, 2, 1, 1, 0];
  const practices = [1, 2, 0, 2, 1, 1, 1];
  const mistakes = [3, 2, 0, 4, 1, 2, 1];

  return WEEK_LABELS.map((label, index) => ({
    dateKey: `2026-07-${8 + index}`,
    label,
    minutes: minutes[index] ?? 0,
    lessonsCompleted: lessons[index] ?? 0,
    practiceCount: practices[index] ?? 0,
    mistakes: mistakes[index] ?? 0,
  }));
}

function sumBuckets(
  buckets: readonly DayBucket[],
  period: 'week' | 'month',
): ParentPeriodReport {
  const lessonsCompleted = buckets.reduce(
    (sum, day) => sum + day.lessonsCompleted,
    0,
  );
  const practiceSessions = buckets.reduce(
    (sum, day) => sum + day.practiceCount,
    0,
  );
  const minutesSpent = buckets.reduce((sum, day) => sum + day.minutes, 0);
  const mistakes = buckets.reduce((sum, day) => sum + day.mistakes, 0);
  const activeDays = buckets.filter(day => day.minutes > 0).length;

  return {
    period,
    lessonsCompleted,
    practiceSessions,
    minutesSpent,
    mistakes,
    averageSessionMinutes:
      activeDays === 0 ? 0 : Math.round(minutesSpent / activeDays),
    practiceFrequencyLabelKey:
      activeDays >= 5
        ? 'parent.frequency.high'
        : activeDays >= 3
        ? 'parent.frequency.medium'
        : 'parent.frequency.low',
    buckets,
  };
}

function buildMonthBuckets(week: readonly DayBucket[]): DayBucket[] {
  // Four weekly rollups for a simple monthly graph.
  const repeats = [0, 1, 2, 3].map(weekIndex => {
    const scale = 0.85 + weekIndex * 0.08;
    const minutes = Math.round(
      week.reduce((sum, day) => sum + day.minutes, 0) * scale,
    );
    const lessons = Math.round(
      week.reduce((sum, day) => sum + day.lessonsCompleted, 0) * scale,
    );
    const practices = Math.round(
      week.reduce((sum, day) => sum + day.practiceCount, 0) * scale,
    );
    const mistakes = Math.round(
      week.reduce((sum, day) => sum + day.mistakes, 0) * scale,
    );
    return {
      dateKey: `2026-0${weekIndex + 1}`,
      label: `W${weekIndex + 1}`,
      minutes,
      lessonsCompleted: lessons,
      practiceCount: practices,
      mistakes,
    } satisfies DayBucket;
  });
  return repeats;
}

/**
 * Builds a ParentChildReport from gamification + session analytics.
 * Session series is seed data until modules emit LearningSessionEvent.
 */
export function buildParentChildReport(input: {
  childId: ChildId;
  childName: string;
  gamification: GamificationSnapshot | null;
}): ParentChildReport {
  const weekBuckets = buildWeekBuckets();
  const weekly = sumBuckets(weekBuckets, 'week');
  const monthly = sumBuckets(buildMonthBuckets(weekBuckets), 'month');
  const g = input.gamification;

  const recommendations = [
    {
      id: 'rec-practice',
      titleKey: 'parent.recs.shortSessions.title',
      detailKey: 'parent.recs.shortSessions.detail',
      priority: 'high' as const,
      moduleId: ModuleId.Chess,
    },
    {
      id: 'rec-mistakes',
      titleKey: 'parent.recs.reviewMistakes.title',
      detailKey: 'parent.recs.reviewMistakes.detail',
      priority: 'medium' as const,
      moduleId: ModuleId.Chess,
    },
    {
      id: 'rec-streak',
      titleKey: 'parent.recs.keepStreak.title',
      detailKey: 'parent.recs.keepStreak.detail',
      priority: 'low' as const,
      moduleId: null,
    },
  ];

  return {
    childId: input.childId,
    childName: input.childName,
    currentLevel: g?.xp.level ?? 1,
    xpIntoLevel: g?.xp.xpIntoLevel ?? 0,
    xpToNextLevel: g?.xp.xpToNextLevel ?? 40,
    streakDays:
      g?.streak.currentStreak ??
      weekly.buckets.filter(b => b.minutes > 0).length,
    longestStreak: g?.streak.longestStreak ?? 4,
    stars: g?.wallet.stars ?? weekly.lessonsCompleted * 2,
    coins: g?.wallet.coins ?? 20,
    achievements: [
      {
        id: 'first_lesson',
        titleKey: 'gamification.achievements.firstLesson',
        unlocked: weekly.lessonsCompleted > 0,
      },
      {
        id: 'curious',
        titleKey: 'gamification.badges.curious',
        unlocked: (g?.badges.length ?? 0) > 0 || weekly.practiceSessions >= 3,
      },
      {
        id: 'streak_3',
        titleKey: 'parent.achievementItems.streak3',
        unlocked:
          (g?.streak.currentStreak ?? 0) >= 3 ||
          weekly.buckets.filter(b => b.minutes > 0).length >= 3,
      },
    ],
    weekly,
    monthly,
    recommendations,
  };
}
