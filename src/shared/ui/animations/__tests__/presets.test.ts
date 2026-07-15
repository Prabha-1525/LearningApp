import {animationPresets} from '../presets';

describe('animationPresets', () => {
  it('exposes shared timing tokens for modules', () => {
    expect(animationPresets.enterMs).toBeGreaterThan(0);
    expect(animationPresets.pressScale).toBeLessThan(1);
    expect(animationPresets.spring.damping).toBeGreaterThan(0);
  });
});
