/** XP curve for ages 5–8 — gentle early levels, soft cap growth. */
export function xpRequiredForLevel(level: number): number {
  const safe = Math.max(1, level);
  return Math.round(40 + safe * 25 + Math.pow(safe, 1.35) * 8);
}

export function levelFromTotalXp(xpTotal: number): {
  level: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
} {
  let level = 1;
  let remaining = Math.max(0, xpTotal);

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
    if (level > 99) {
      break;
    }
  }

  const xpToNextLevel = xpRequiredForLevel(level);
  return {level, xpIntoLevel: remaining, xpToNextLevel};
}

export function levelProgressRatio(
  xpIntoLevel: number,
  xpToNextLevel: number,
): number {
  if (xpToNextLevel <= 0) {
    return 1;
  }
  return Math.max(0, Math.min(1, xpIntoLevel / xpToNextLevel));
}
