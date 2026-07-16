import {generateQuestion, uniqueQuestionCount} from '../questionEngine';
import {nextDifficultyLevel} from '../random';

describe('math question engine', () => {
  it('generates many unique counting questions', () => {
    const unique = uniqueQuestionCount('counting', 1, 150);
    expect(unique).toBeGreaterThanOrEqual(80);
  });

  it('generates many unique addition questions', () => {
    const unique = uniqueQuestionCount('addition', 2, 150);
    expect(unique).toBeGreaterThanOrEqual(50);
  });

  it('avoids immediate repeats when recent ids provided', () => {
    const first = generateQuestion('missing', 1, []);
    const second = generateQuestion('missing', 1, [first.id]);
    expect(second.id).not.toBe(first.id);
  });

  it('raises difficulty after strong performance', () => {
    expect(nextDifficultyLevel(10, 9, 1)).toBe(2);
    expect(nextDifficultyLevel(10, 3, 2)).toBe(1);
  });
});
