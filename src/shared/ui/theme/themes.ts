import {palette} from './palette';

export type ThemeMode = 'light' | 'night';

export type SemanticColors = {
  canvas: string;
  surface: string;
  ink: string;
  inkMuted: string;
  border: string;
  overlay: string;
  actionPrimary: string;
  actionPrimaryPressed: string;
  actionPrimaryLabel: string;
  actionSecondaryBorder: string;
  actionSecondaryLabel: string;
  actionSun: string;
  actionSunPressed: string;
  actionSunLabel: string;
  success: string;
  reward: string;
  danger: string;
  dangerSoft: string;
  sand: string;
  focus: string;
  star: string;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: SemanticColors;
  statusBar: 'dark-content' | 'light-content';
};

export const lightTheme: AppTheme = {
  mode: 'light',
  statusBar: 'dark-content',
  colors: {
    canvas: palette.canvas,
    surface: palette.surface,
    ink: palette.ink,
    inkMuted: palette.inkMuted,
    border: palette.border,
    overlay: palette.overlay,
    actionPrimary: palette.teal,
    actionPrimaryPressed: palette.tealPressed,
    actionPrimaryLabel: palette.white,
    actionSecondaryBorder: palette.teal,
    actionSecondaryLabel: palette.teal,
    actionSun: palette.sun,
    actionSunPressed: palette.sunPressed,
    actionSunLabel: palette.ink,
    success: palette.leaf,
    reward: palette.coral,
    danger: palette.danger,
    dangerSoft: palette.dangerSoft,
    sand: palette.sand,
    focus: palette.teal,
    star: palette.sun,
  },
};

export const nightTheme: AppTheme = {
  mode: 'night',
  statusBar: 'light-content',
  colors: {
    canvas: palette.nightCanvas,
    surface: palette.nightSurface,
    ink: palette.nightInk,
    inkMuted: palette.nightInkMuted,
    border: palette.nightBorder,
    overlay: palette.nightOverlay,
    actionPrimary: palette.nightTeal,
    actionPrimaryPressed: palette.teal,
    actionPrimaryLabel: palette.white,
    actionSecondaryBorder: palette.nightTeal,
    actionSecondaryLabel: palette.nightTeal,
    actionSun: palette.nightSun,
    actionSunPressed: palette.sunPressed,
    actionSunLabel: palette.nightCanvas,
    success: palette.leaf,
    reward: palette.nightCoral,
    danger: palette.danger,
    dangerSoft: '#3A2222',
    sand: '#3A3428',
    focus: palette.nightTeal,
    star: palette.nightSun,
  },
};

export function resolveTheme(mode: ThemeMode): AppTheme {
  return mode === 'night' ? nightTheme : lightTheme;
}
