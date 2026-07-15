import {palette} from './palette';
import {radius, radiusTokens} from './radius';
import {space, spaceTokens} from './spacing';
import {typography, typographyTokens} from './typography';
import {lightTheme} from './themes';

/**
 * Flat token bag for non-React callers and early scaffold code.
 * Prefer `useTheme()` inside components.
 */
export const theme = {
  colors: {
    background: lightTheme.colors.canvas,
    surface: lightTheme.colors.surface,
    textPrimary: lightTheme.colors.ink,
    textSecondary: lightTheme.colors.inkMuted,
    border: lightTheme.colors.border,
    accent: lightTheme.colors.actionPrimary,
    danger: lightTheme.colors.danger,
    focus: lightTheme.colors.focus,
    canvas: lightTheme.colors.canvas,
    ink: lightTheme.colors.ink,
    inkMuted: lightTheme.colors.inkMuted,
    teal: palette.teal,
    sun: palette.sun,
    coral: palette.coral,
    leaf: palette.leaf,
  },
  space: spaceTokens,
  radius: radiusTokens,
  typography: typographyTokens,
  palette,
  spacing: space,
  radii: radius,
  type: typography,
} as const;

/** @deprecated Use semantic theme via useTheme().colors */
export const colorTokens = theme.colors;

export type {AppTheme, ThemeMode, SemanticColors} from './themes';
