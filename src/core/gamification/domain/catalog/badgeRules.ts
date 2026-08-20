import type {BadgeId} from '../schema/RewardDatabase';

export type BadgeEvalContext = {
  readonly completedLessonCount: number;
  readonly perfectLessonCount: number; // 3-star lessons
  readonly missingLessonsCompleted: number;
  readonly missingPerfectCount: number;
  readonly missingAllComplete: boolean;
  readonly countingLessonsCompleted: number;
  readonly countingPerfectCount: number;
  readonly chessLessonsCompleted?: number;
  readonly chessLessonsList?: readonly string[];
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
    evaluate: ctx => ctx.countingPerfectCount >= 3,
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

  // CHESS BADGES
  {
    id: 'pawn_beginner',
    badgeId: asBadgeId('badge.pawn_beginner'),
    titleKey: 'chess.badges.pawnBeginner',
    descriptionKey: 'chess.badges.pawnBeginnerDesc',
    icon: '♙',
    evaluate: ctx => ctx.chessLessonsList?.includes('pawn') ?? false,
  },
  {
    id: 'rook_explorer',
    badgeId: asBadgeId('badge.rook_explorer'),
    titleKey: 'chess.badges.rookExplorer',
    descriptionKey: 'chess.badges.rookExplorerDesc',
    icon: '♖',
    evaluate: ctx => ctx.chessLessonsList?.includes('rook') ?? false,
  },
  {
    id: 'knight_master',
    badgeId: asBadgeId('badge.knight_master'),
    titleKey: 'chess.badges.knightMaster',
    descriptionKey: 'chess.badges.knightMasterDesc',
    icon: '♘',
    evaluate: ctx => ctx.chessLessonsList?.includes('knight') ?? false,
  },
  {
    id: 'bishop_star',
    badgeId: asBadgeId('badge.bishop_star'),
    titleKey: 'chess.badges.bishopStar',
    descriptionKey: 'chess.badges.bishopStarDesc',
    icon: '♗',
    evaluate: ctx => ctx.chessLessonsList?.includes('bishop') ?? false,
  },
  {
    id: 'queen_champion',
    badgeId: asBadgeId('badge.queen_champion'),
    titleKey: 'chess.badges.queenChampion',
    descriptionKey: 'chess.badges.queenChampionDesc',
    icon: '♕',
    evaluate: ctx => ctx.chessLessonsList?.includes('queen') ?? false,
  },
  {
    id: 'king_guardian',
    badgeId: asBadgeId('badge.king_guardian'),
    titleKey: 'chess.badges.kingGuardian',
    descriptionKey: 'chess.badges.kingGuardianDesc',
    icon: '♔',
    evaluate: ctx => ctx.chessLessonsList?.includes('king') ?? false,
  },
  {
    id: 'chess_learner',
    badgeId: asBadgeId('badge.chess_learner'),
    titleKey: 'chess.badges.chessLearner',
    descriptionKey: 'chess.badges.chessLearnerDesc',
    icon: '⚔️',
    evaluate: ctx => (ctx.chessLessonsCompleted ?? 0) >= 6,
  },
  {
    id: 'chess_master',
    badgeId: asBadgeId('badge.chess_master'),
    titleKey: 'chess.badges.chessMaster',
    descriptionKey: 'chess.badges.chessMasterDesc',
    icon: '👑',
    evaluate: ctx => (ctx.chessLessonsCompleted ?? 0) >= 12,
  },
];

export function evaluateNewBadges(ctx: BadgeEvalContext): readonly BadgeRule[] {
  return BADGE_RULES.filter(
    rule => !ctx.ownedBadgeIds.has(rule.badgeId) && rule.evaluate(ctx),
  );
}
