import {
  generateMissingQuestion,
  getMissingLesson,
  MISSING_LESSON_COUNT,
  MISSING_LESSONS,
  MISSING_QUESTIONS_PER_LESSON,
  MISSING_SEQUENCE_LENGTH,
  MISSING_THREE_DIGIT_AFTER,
  rangeForMissingLesson,
} from '../missingCurriculum';

describe('missingCurriculum', () => {
  it('defines 10 simple lessons', () => {
    expect(MISSING_LESSONS).toHaveLength(MISSING_LESSON_COUNT);
    expect(MISSING_QUESTIONS_PER_LESSON).toBe(10);
    expect(getMissingLesson(1).titleEn).toBe('Lesson 1');
    expect(getMissingLesson(10).titleEn).toBe('Lesson 10');
  });

  it('uses 1–2 digits for lessons 1–5 and 3 digits after', () => {
    expect(rangeForMissingLesson(1)).toEqual({min: 1, max: 99});
    expect(rangeForMissingLesson(MISSING_THREE_DIGIT_AFTER)).toEqual({
      min: 1,
      max: 99,
    });
    expect(rangeForMissingLesson(6)).toEqual({min: 100, max: 999});
  });

  it('generates a 5-length sequence with one gap and 4 choices', () => {
    const q = generateMissingQuestion(1);
    expect(q.sequence).toHaveLength(MISSING_SEQUENCE_LENGTH);
    expect(q.sequence.filter(n => n == null)).toHaveLength(1);
    expect(q.choices).toHaveLength(4);
    expect(q.choices.filter(c => c.correct)).toHaveLength(1);
    expect(q.choices.some(c => c.label === String(q.answer))).toBe(true);
    expect(q.answer).toBeGreaterThanOrEqual(1);
    expect(q.answer).toBeLessThanOrEqual(99);
  });

  it('can generate 3-digit answers after lesson 5', () => {
    const q = generateMissingQuestion(7);
    expect(q.answer).toBeGreaterThanOrEqual(100);
    expect(q.answer).toBeLessThanOrEqual(999);
  });
});
