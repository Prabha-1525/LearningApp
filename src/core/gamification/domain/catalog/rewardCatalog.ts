import type {RewardDefinitionRecord} from '../schema/RewardDatabase';

/**
 * Static reward catalog (definitions DB).
 * Not lesson content — economy/achievement metadata only.
 */
export const rewardCatalog: readonly RewardDefinitionRecord[] = [
  {
    id: 'reward.currency.star' as RewardDefinitionRecord['id'],
    kind: 'currency',
    code: 'STAR',
    titleKey: 'gamification.currency.stars',
    descriptionKey: 'gamification.currency.starsDesc',
    rarity: 'common',
    payload: {currency: 'stars'},
    version: 1,
  },
  {
    id: 'reward.currency.coin' as RewardDefinitionRecord['id'],
    kind: 'currency',
    code: 'COIN',
    titleKey: 'gamification.currency.coins',
    descriptionKey: 'gamification.currency.coinsDesc',
    rarity: 'common',
    payload: {currency: 'coins'},
    version: 1,
  },
  {
    id: 'reward.achievement.first_lesson' as RewardDefinitionRecord['id'],
    kind: 'achievement',
    code: 'FIRST_LESSON',
    titleKey: 'gamification.achievements.firstLesson',
    descriptionKey: 'gamification.achievements.firstLessonDesc',
    rarity: 'common',
    payload: {trigger: 'lesson_complete', count: 1},
    version: 1,
  },
  {
    id: 'reward.badge.curious' as RewardDefinitionRecord['id'],
    kind: 'badge',
    code: 'CURIOUS',
    titleKey: 'gamification.badges.curious',
    descriptionKey: 'gamification.badges.curiousDesc',
    rarity: 'common',
    payload: {iconKey: 'curious'},
    version: 1,
  },
  {
    id: 'reward.avatar.sunny' as RewardDefinitionRecord['id'],
    kind: 'avatar',
    code: 'AVATAR_SUNNY',
    titleKey: 'gamification.avatars.sunny',
    descriptionKey: 'gamification.avatars.sunnyDesc',
    rarity: 'common',
    payload: {avatarKey: 'sunny', unlockLevel: 1},
    version: 1,
  },
  {
    id: 'reward.avatar.spark' as RewardDefinitionRecord['id'],
    kind: 'avatar',
    code: 'AVATAR_SPARK',
    titleKey: 'gamification.avatars.spark',
    descriptionKey: 'gamification.avatars.sparkDesc',
    rarity: 'rare',
    payload: {avatarKey: 'spark', unlockLevel: 3},
    version: 1,
  },
  {
    id: 'reward.daily.day1' as RewardDefinitionRecord['id'],
    kind: 'daily',
    code: 'DAILY_1',
    titleKey: 'gamification.daily.day1',
    descriptionKey: 'gamification.daily.day1Desc',
    rarity: 'common',
    payload: {stars: 2, coins: 5, xp: 10, dayIndex: 0},
    version: 1,
  },
  {
    id: 'reward.daily.day7' as RewardDefinitionRecord['id'],
    kind: 'daily',
    code: 'DAILY_7',
    titleKey: 'gamification.daily.day7',
    descriptionKey: 'gamification.daily.day7Desc',
    rarity: 'rare',
    payload: {stars: 5, coins: 20, xp: 40, dayIndex: 6},
    version: 1,
  },
] as const;

export const dailyRewardTable: readonly {
  stars: number;
  coins: number;
  xp: number;
}[] = [
  {stars: 2, coins: 5, xp: 10},
  {stars: 2, coins: 8, xp: 12},
  {stars: 3, coins: 10, xp: 15},
  {stars: 3, coins: 12, xp: 18},
  {stars: 4, coins: 15, xp: 22},
  {stars: 4, coins: 18, xp: 28},
  {stars: 5, coins: 25, xp: 40},
];
