export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export type RadiusToken = typeof radius;

/** @deprecated Prefer `radius`. */
export const radiusTokens = {
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
} as const;
