/**
 * Kid-safe economy caps — prevents grind / accidental huge grants.
 */
export const rewardCaps = {
  maxStarsPerGrant: 20,
  maxCoinsPerGrant: 50,
  maxXpPerGrant: 100,
  maxStarsPerDay: 200,
  maxCoinsPerDay: 500,
  dailyRewardCycleDays: 7,
  maxStreakDisplay: 999,
} as const;

export function clampGrant(input: {stars: number; coins: number; xp: number}): {
  stars: number;
  coins: number;
  xp: number;
} {
  return {
    stars: Math.max(
      0,
      Math.min(rewardCaps.maxStarsPerGrant, Math.floor(input.stars)),
    ),
    coins: Math.max(
      0,
      Math.min(rewardCaps.maxCoinsPerGrant, Math.floor(input.coins)),
    ),
    xp: Math.max(0, Math.min(rewardCaps.maxXpPerGrant, Math.floor(input.xp))),
  };
}
