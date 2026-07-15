export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
} as const;

export type SpaceToken = typeof space;
export type SpaceKey = keyof typeof space;

/** @deprecated Prefer `space` — kept for early scaffold callers. */
export const spaceTokens = {
  xs: space.xxs,
  sm: space.xs,
  md: space.md,
  lg: space.lg,
  xl: space.xl,
  xxl: space.xxxl,
} as const;
