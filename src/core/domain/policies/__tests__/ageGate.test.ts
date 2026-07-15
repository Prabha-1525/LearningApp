import {evaluateAgeGate, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';

describe('evaluateAgeGate', () => {
  it('allows ages in the product range', () => {
    expect(evaluateAgeGate(TARGET_AGE_MIN)).toEqual({allowed: true});
    expect(evaluateAgeGate(TARGET_AGE_MAX)).toEqual({allowed: true});
    expect(evaluateAgeGate(6)).toEqual({allowed: true});
  });

  it('rejects ages outside the product range', () => {
    expect(evaluateAgeGate(TARGET_AGE_MIN - 1)).toEqual({
      allowed: false,
      reason: 'below_min',
    });
    expect(evaluateAgeGate(TARGET_AGE_MAX + 1)).toEqual({
      allowed: false,
      reason: 'above_max',
    });
  });
});
