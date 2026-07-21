import {
  buildOddEvenQuestion,
  generateOddEvenQuestion,
  parityOf,
} from '../oddEvenGenerator';

describe('oddEvenGenerator', () => {
  it('classifies numbers by pairing', () => {
    expect(parityOf(2)).toBe('even');
    expect(parityOf(7)).toBe('odd');
    expect(parityOf(20)).toBe('even');
  });

  it('leaves exactly one object unpaired for odd numbers', () => {
    for (let number = 1; number <= 20; number += 1) {
      const question = buildOddEvenQuestion(number);
      expect(question.pairCount * 2 + (question.hasUnpaired ? 1 : 0)).toBe(
        number,
      );
      expect(question.hasUnpaired).toBe(number % 2 !== 0);
    }
  });

  it('always offers one correct Odd/Even choice', () => {
    for (let i = 0; i < 40; i += 1) {
      const question = generateOddEvenQuestion(2);
      expect(question.choices).toHaveLength(2);
      expect(question.choices.filter(choice => choice.correct)).toHaveLength(1);
      expect(question.choices.find(choice => choice.correct)?.id).toBe(
        question.parity,
      );
    }
  });
});
