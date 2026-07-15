/**
 * Sunny Studio — raw color primitives.
 * Screens/components should prefer semantic theme colors, not these directly.
 */
export const palette = {
  canvas: '#EAF6FB',
  surface: '#FFFFFF',
  ink: '#1A2A32',
  inkMuted: '#5B6B74',
  teal: '#0F8B8D',
  tealPressed: '#0C7072',
  sun: '#F4B400',
  sunPressed: '#D9A000',
  coral: '#FF6B4A',
  leaf: '#3D9A5F',
  berry: '#E4578C',
  sky: '#4DB7E8',
  mango: '#FF9F1C',
  indigoSoft: '#5B7CFA',
  violetPlay: '#8B5CF6',
  sand: '#FFE8C2',
  border: '#D5E3EA',
  danger: '#D64545',
  dangerSoft: '#FDECEC',
  overlay: 'rgba(26, 42, 50, 0.45)',
  white: '#FFFFFF',
  transparent: 'transparent',

  nightCanvas: '#0F1C24',
  nightSurface: '#1A2E38',
  nightInk: '#E8F1F5',
  nightInkMuted: '#9BB0BA',
  nightBorder: '#2A4150',
  nightTeal: '#2AABB0',
  nightSun: '#E0A800',
  nightCoral: '#FF8A6E',
  nightOverlay: 'rgba(0, 0, 0, 0.55)',
} as const;

export type Palette = typeof palette;
