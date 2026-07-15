export const breakpoints = {
  phoneMax: 599,
  tabletPortraitMax: 899,
  tabletLandscapeMin: 900,
} as const;

export type LayoutBucket = 'phone' | 'tabletPortrait' | 'tabletLandscape';

export function getLayoutBucket(width: number): LayoutBucket {
  if (width <= breakpoints.phoneMax) {
    return 'phone';
  }
  if (width <= breakpoints.tabletPortraitMax) {
    return 'tabletPortrait';
  }
  return 'tabletLandscape';
}

export function getModuleGridColumns(width: number): number {
  const bucket = getLayoutBucket(width);
  switch (bucket) {
    case 'phone':
      return 2;
    case 'tabletPortrait':
      return 3;
    case 'tabletLandscape':
      return 4;
  }
}

export function getScreenHorizontalPadding(width: number): number {
  const bucket = getLayoutBucket(width);
  if (bucket === 'phone') {
    return 24;
  }
  return 32;
}
