/**
 * Lesson star score from mistake count (1–3).
 * 0 mistakes → 3, minor → 2, many → 1.
 */
export function starsFromMistakes(wrongAttempts: number): 1 | 2 | 3 {
  if (wrongAttempts <= 0) {
    return 3;
  }
  if (wrongAttempts <= 2) {
    return 2;
  }
  return 1;
}

/** Only keep the better score — never decrease. */
export function bestStars(previous: number, earned: number): number {
  return Math.max(0, previous, earned);
}
