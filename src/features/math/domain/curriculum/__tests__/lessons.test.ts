import {MATH_LESSONS, MATH_ADVENTURE_TOPICS, getLesson} from '../index';
import {isLessonUnlocked} from '../../../data/mathProgress';

describe('math curriculum', () => {
  it('includes thirteen lessons with intros', () => {
    expect(MATH_LESSONS).toHaveLength(13);
    expect(MATH_LESSONS[0]?.id).toBe('numbers');
    expect(MATH_LESSONS[12]?.id).toBe('practice');
    for (const lesson of MATH_LESSONS) {
      expect(lesson.introTa.length).toBeGreaterThan(0);
      expect(lesson.introEn.length).toBeGreaterThan(0);
    }
  });

  it('lists MathAdventure topics without locks on playable lessons', () => {
    expect(MATH_ADVENTURE_TOPICS.length).toBe(13);
    const playable = MATH_ADVENTURE_TOPICS.filter(a => !a.comingSoon);
    expect(playable.length).toBeGreaterThanOrEqual(10);
    for (const activity of playable) {
      if (activity.lessonId) {
        expect(isLessonUnlocked(activity.lessonId)).toBe(true);
      }
    }
  });

  it('resolves lessons by id', () => {
    expect(getLesson('counting').titleEn).toBe('Counting');
  });
});
