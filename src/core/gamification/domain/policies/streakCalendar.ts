/** Local calendar day key YYYY-MM-DD for streak / daily rewards. */
export function toLocalDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetween(a: string, b: string): number {
  const parse = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1);
  };
  const diff = parse(b) - parse(a);
  return Math.round(diff / (24 * 60 * 60 * 1000));
}

export function nextStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  today: string,
): {currentStreak: number; longestDelta: number} {
  if (lastActiveDate == null) {
    return {currentStreak: 1, longestDelta: 1};
  }
  if (lastActiveDate === today) {
    return {currentStreak, longestDelta: 0};
  }
  const gap = daysBetween(lastActiveDate, today);
  if (gap === 1) {
    const next = currentStreak + 1;
    return {currentStreak: next, longestDelta: next};
  }
  return {currentStreak: 1, longestDelta: 1};
}
