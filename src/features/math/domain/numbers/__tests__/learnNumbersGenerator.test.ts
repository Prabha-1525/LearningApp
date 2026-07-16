import {
  generateLearnNumbersQuestion,
  uniqueLearnNumbersCount,
  validateLearnNumbersQuestion,
} from '../learnNumbersGenerator';
import {makeChoices, validateChoices} from '../../generators/random';

describe('learnNumbersGenerator', () => {
  it('always includes exactly one correct answer in 4 choices', () => {
    for (let i = 0; i < 40; i += 1) {
      const q = generateLearnNumbersQuestion(1, []);
      expect(validateLearnNumbersQuestion(q)).toBe(true);
      expect(q.choices).toHaveLength(4);
      expect(q.choices.filter(c => c.correct)).toHaveLength(1);
      expect(q.choices.some(c => c.label === String(q.number))).toBe(true);
    }
  });

  it('generates 80+ unique questions at level 1', () => {
    expect(uniqueLearnNumbersCount(1, 120)).toBeGreaterThanOrEqual(80);
  });

  it('object count matches answer number', () => {
    const q = generateLearnNumbersQuestion(2, []);
    expect(q.emojis.length).toBe(q.number);
  });

  it('varies activity modes for unlimited practice', () => {
    const modes = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      modes.add(generateLearnNumbersQuestion(1, []).activityMode);
    }
    expect(modes.size).toBeGreaterThan(1);
  });
});

describe('makeChoices validation', () => {
  it('never omits the correct answer', () => {
    const choices = makeChoices('7', ['5', '8', '9'], 4);
    expect(validateChoices(choices, '7', 4)).toBe(true);
  });
});
