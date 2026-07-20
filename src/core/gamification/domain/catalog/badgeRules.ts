import type {BadgeId} from '../schema/RewardDatabase';

/**
 * Context for badge rule evaluation — extend freely; rules stay isolated.
 */
export type BadgeEvalContext = {
  readonly completedLessonCount: number;
  readonly perfectLessonCount: number; // 3-star lessons
  readonly missingLessonsCompleted: number;
  readonly missingPerfectCount: number;
  readonly missingAllComplete: boolean;
  readonly currentStreak: number;
  readonly ownedBadgeIds: ReadonlySet<string>;
};

export type BadgeRule = {
  readonly id: string;
  readonly badgeId: BadgeId;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly icon: string;
  readonly evaluate: (ctx: BadgeEvalContext) => boolean;
};

function asBadgeId(value: string): BadgeId {
  return value as BadgeId;
}

/**
 * Declarative badge rules — add new entries without changing grant logic.
 */
export const BADGE_RULES: readonly BadgeRule[] = [
  {
    id: 'first_lesson',
    badgeId: asBadgeId('badge.first_lesson'),
    titleKey: 'gamification.badges.firstLesson',
    descriptionKey: 'gamification.badges.firstLessonDesc',
    icon: '🏅',
    evaluate: ctx => ctx.completedLessonCount >= 1,
  },
  {
    id: 'math_beginner',
    badgeId: asBadgeId('badge.math_beginner'),
    titleKey: 'gamification.badges.mathBeginner',
    descriptionKey: 'gamification.badges.mathBeginnerDesc',
    icon: '🔢',
    evaluate: ctx => ctx.missingLessonsCompleted >= 5,
  },
  {
    id: 'counting_master',
    badgeId: asBadgeId('badge.counting_master'),
    titleKey: 'gamification.badges.countingMaster',
    descriptionKey: 'gamification.badges.countingMasterDesc',
    icon: '🧮',
    evaluate: ctx => ctx.missingPerfectCount >= 3,
  },
  {
    id: 'perfect_learner',
    badgeId: asBadgeId('badge.perfect_learner'),
    titleKey: 'gamification.badges.perfectLearner',
    descriptionKey: 'gamification.badges.perfectLearnerDesc',
    icon: '🌟',
    evaluate: ctx => ctx.perfectLessonCount >= 10,
  },
  {
    id: 'daily_learner',
    badgeId: asBadgeId('badge.daily_learner'),
    titleKey: 'gamification.badges.dailyLearner',
    descriptionKey: 'gamification.badges.dailyLearnerDesc',
    icon: '📅',
    evaluate: ctx => ctx.currentStreak >= 2,
  },
  {
    id: 'math_champion',
    badgeId: asBadgeId('badge.math_champion'),
    titleKey: 'gamification.badges.mathChampion',
    descriptionKey: 'gamification.badges.mathChampionDesc',
    icon: '🏆',
    evaluate: ctx => ctx.missingAllComplete,
  },
];

export function evaluateNewBadges(ctx: BadgeEvalContext): readonly BadgeRule[] {
  return BADGE_RULES.filter(
    rule => !ctx.ownedBadgeIds.has(rule.badgeId) && rule.evaluate(ctx),
  );
}
