import type {TextStyle} from 'react-native';

/**
 * Typography roles for Sunny Studio.
 * Custom fonts (Fredoka / Nunito) can be linked later; system UI is the fallback.
 */
export const typography = {
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  headline: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  bodySm: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  button: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyRole = keyof typeof typography;

/** @deprecated Prefer `typography`. */
export const typographyTokens = {
  title: typography.title,
  headline: typography.headline,
  body: typography.bodySm,
  caption: typography.caption,
} as const;
