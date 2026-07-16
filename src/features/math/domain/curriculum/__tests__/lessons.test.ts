import {MATH_LESSONS, MATH_HUB_ACTIVITIES, getLesson} from '../lessons';
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

  it('lists all core topics on the hub without locks', () => {
    const playable = MATH_HUB_ACTIVITIES.filter(a => !a.comingSoon);
    expect(playable.length).toBeGreaterThanOrEqual(12);
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
