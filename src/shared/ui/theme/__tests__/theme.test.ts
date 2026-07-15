import {
  getLayoutBucket,
  getModuleGridColumns,
  getScreenHorizontalPadding,
} from '../breakpoints';
import {resolveTheme} from '../themes';

describe('design system tokens', () => {
  it('resolves light and night themes', () => {
    expect(resolveTheme('light').mode).toBe('light');
    expect(resolveTheme('night').mode).toBe('night');
    expect(resolveTheme('light').colors.canvas).not.toBe(
      resolveTheme('night').colors.canvas,
    );
  });

  it('maps widths to layout buckets and grid columns', () => {
    expect(getLayoutBucket(390)).toBe('phone');
    expect(getLayoutBucket(768)).toBe('tabletPortrait');
    expect(getLayoutBucket(1024)).toBe('tabletLandscape');

    expect(getModuleGridColumns(390)).toBe(2);
    expect(getModuleGridColumns(768)).toBe(3);
    expect(getModuleGridColumns(1024)).toBe(4);

    expect(getScreenHorizontalPadding(390)).toBe(24);
    expect(getScreenHorizontalPadding(768)).toBe(32);
  });
});
