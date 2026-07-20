import {bestStars, starsFromMistakes} from '../starScore';

describe('starScore', () => {
  it('maps mistakes to 1–3 stars', () => {
    expect(starsFromMistakes(0)).toBe(3);
    expect(starsFromMistakes(1)).toBe(2);
    expect(starsFromMistakes(2)).toBe(2);
    expect(starsFromMistakes(3)).toBe(1);
  });

  it('never decreases best stars', () => {
    expect(bestStars(3, 1)).toBe(3);
    expect(bestStars(1, 3)).toBe(3);
    expect(bestStars(2, 2)).toBe(2);
  });
});
