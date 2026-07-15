import type {ChildId, ModuleId} from '@core/domain';

/**
 * Parent-facing analytics contract.
 * Modules append LearningSessionEvent later; dashboard reads ParentChildReport.
 */
export type DayBucket = {
  readonly dateKey: string; // YYYY-MM-DD
  readonly label: string; // Mon, Tue…
  readonly minutes: number;
  readonly lessonsCompleted: number;
  readonly practiceCount: number;
  readonly mistakes: number;
};

export type ParentRecommendation = {
  readonly id: string;
  readonly titleKey: string;
  readonly detailKey: string;
  readonly priority: 'high' | 'medium' | 'low';
  readonly moduleId: ModuleId | null;
};

export type ParentPeriodReport = {
  readonly period: 'week' | 'month';
  readonly lessonsCompleted: number;
  readonly practiceSessions: number;
  readonly minutesSpent: number;
  readonly mistakes: number;
  readonly averageSessionMinutes: number;
  readonly practiceFrequencyLabelKey: string;
  readonly buckets: readonly DayBucket[];
};

export type ParentAchievementSummary = {
  readonly id: string;
  readonly titleKey: string;
  readonly unlocked: boolean;
};

export type ParentChildReport = {
  readonly childId: ChildId;
  readonly childName: string;
  readonly currentLevel: number;
  readonly xpIntoLevel: number;
  readonly xpToNextLevel: number;
  readonly streakDays: number;
  readonly longestStreak: number;
  readonly stars: number;
  readonly coins: number;
  readonly achievements: readonly ParentAchievementSummary[];
  readonly weekly: ParentPeriodReport;
  readonly monthly: ParentPeriodReport;
  readonly recommendations: readonly ParentRecommendation[];
};
