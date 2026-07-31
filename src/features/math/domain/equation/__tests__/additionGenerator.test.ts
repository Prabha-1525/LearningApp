import {
  ADDITION_LESSON_COUNT,
  ADDITION_LESSONS,
  ADDITION_QUESTIONS_PER_LESSON,
  additionUniquePairCount,
  buildAdditionDistractors,
  buildAdditionQuestion,
  enumerateLesson1Pairs,
  enumerateLesson2Pairs,
  generateAdditionQuestion,
  getAdditionLesson,
} from '../additionGenerator';
import {validateChoices} from '../../generators/random';

describe('additionGenerator', () => {
  it('defines 5 progressive lessons', () => {
    expect(ADDITION_LESSONS).toHaveLength(ADDITION_LESSON_COUNT);
    expect(ADDITION_QUESTIONS_PER_LESSON).toBe(10);
    expect(getAdditionLesson(1).titleEn).toBe('Sums up to 10');
    expect(getAdditionLesson(5).titleEn).toBe('Hundreds, tens and ones');
  });

  it('has hundreds of unique pairs across the curriculum', () => {
    expect(additionUniquePairCount(1)).toBeGreaterThan(40);
    expect(additionUniquePairCount(2)).toBeGreaterThanOrEqual(36);
    expect(additionUniquePairCount(3)).toBe(810);
    expect(additionUniquePairCount(4)).toBe(8100);
    expect(additionUniquePairCount(5)).toBe(8100);
    const total =
      additionUniquePairCount(1) +
      additionUniquePairCount(2) +
      additionUniquePairCount(3) +
      additionUniquePairCount(4) +
      additionUniquePairCount(5);
    expect(total).toBeGreaterThan(16000);
  });

  it('lesson 1 only yields single-digit sums ≤ 10', () => {
    for (let i = 0; i < 40; i += 1) {
      const q = generateAdditionQuestion(1);
      expect(q.left).toBeGreaterThanOrEqual(1);
      expect(q.left).toBeLessThanOrEqual(9);
      expect(q.right).toBeGreaterThanOrEqual(1);
      expect(q.right).toBeLessThanOrEqual(9);
      expect(q.answer).toBe(q.left + q.right);
      expect(q.answer).toBeLessThanOrEqual(10);
      expect(q.answer).toBeGreaterThanOrEqual(2);
      expect(q.visualMode).toBe('objects');
    }
  });

  it('lesson 2 only yields single-digit sums between 11 and 18', () => {
    for (let i = 0; i < 40; i += 1) {
      const q = generateAdditionQuestion(2);
      expect(q.left).toBeGreaterThanOrEqual(1);
      expect(q.left).toBeLessThanOrEqual(9);
      expect(q.right).toBeGreaterThanOrEqual(1);
      expect(q.right).toBeLessThanOrEqual(9);
      expect(q.answer).toBeGreaterThanOrEqual(11);
      expect(q.answer).toBeLessThanOrEqual(18);
      expect(q.visualMode).toBe('objects');
    }
  });

  it('lesson 3 is two-digit + one-digit with place-value visuals', () => {
    for (let i = 0; i < 30; i += 1) {
      const q = generateAdditionQuestion(3);
      expect(q.left).toBeGreaterThanOrEqual(10);
      expect(q.left).toBeLessThanOrEqual(99);
      expect(q.right).toBeGreaterThanOrEqual(1);
      expect(q.right).toBeLessThanOrEqual(9);
      expect(q.visualMode).toBe('placeValue');
    }
  });

  it('lesson 4 is two-digit + two-digit with base-10 visuals', () => {
    for (let i = 0; i < 30; i += 1) {
      const q = generateAdditionQuestion(4);
      expect(q.left).toBeGreaterThanOrEqual(10);
      expect(q.left).toBeLessThanOrEqual(99);
      expect(q.right).toBeGreaterThanOrEqual(10);
      expect(q.right).toBeLessThanOrEqual(99);
      expect(q.visualMode).toBe('base10');
    }
  });

  it('lesson 5 is three-digit + one-digit', () => {
    for (let i = 0; i < 30; i += 1) {
      const q = generateAdditionQuestion(5);
      expect(q.left).toBeGreaterThanOrEqual(100);
      expect(q.left).toBeLessThanOrEqual(999);
      expect(q.right).toBeGreaterThanOrEqual(1);
      expect(q.right).toBeLessThanOrEqual(9);
      expect(q.visualMode).toBe('placeValue');
    }
  });

  it('always returns 4 unique choices with exactly one correct', () => {
    for (let lesson = 1; lesson <= 5; lesson += 1) {
      const q = generateAdditionQuestion(lesson);
      expect(validateChoices(q.choices, String(q.answer), 4)).toBe(true);
      const labels = q.choices.map(c => c.label);
      expect(new Set(labels).size).toBe(4);
    }
  });

  it('avoids repeating question ids within a session', () => {
    const recent: string[] = [];
    const pool = enumerateLesson1Pairs();
    const count = Math.min(12, pool.length);
    for (let i = 0; i < count; i += 1) {
      const q = generateAdditionQuestion(1, recent);
      expect(recent.includes(q.id)).toBe(false);
      recent.push(q.id);
    }
    expect(new Set(recent).size).toBe(count);
  });

  it('builds unique distractors that never include the answer', () => {
    const distractors = buildAdditionDistractors(25, 34, 59, 4);
    expect(distractors).not.toContain('59');
    expect(new Set(distractors).size).toBe(distractors.length);
  });

  it('buildAdditionQuestion matches left + right', () => {
    const q = buildAdditionQuestion(1, 3, 4);
    expect(q.answer).toBe(7);
    expect(q.id).toBe('addition.L1|3+4');
    expect(q.leftDigits.ones).toBe(3);
    expect(q.rightDigits.ones).toBe(4);
  });

  it('enumerates only valid lesson 1 and 2 pairs', () => {
    for (const [a, b] of enumerateLesson1Pairs()) {
      expect(a + b).toBeLessThanOrEqual(10);
    }
    for (const [a, b] of enumerateLesson2Pairs()) {
      const sum = a + b;
      expect(sum).toBeGreaterThanOrEqual(11);
      expect(sum).toBeLessThanOrEqual(18);
    }
  });
});
