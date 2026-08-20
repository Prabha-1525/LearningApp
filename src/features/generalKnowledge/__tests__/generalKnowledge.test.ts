import {
  GK_CATEGORIES,
  GRAND_GK_CHALLENGE_QUESTIONS,
} from '../domain/catalog/gkData';
import {
  isLessonUnlocked,
  readGKProgress,
  recordGKLessonResult,
  recordGrandChallengeScore,
} from '../data/progress/gkProgress';
import {
  evaluateNewBadges,
  type BadgeEvalContext,
} from '@core/gamification/domain/catalog/badgeRules';

describe('General Knowledge (GK) Module', () => {
  describe('Curriculum Data & Catalog Integrity', () => {
    it('provides 7 knowledge categories with rich content', () => {
      expect(GK_CATEGORIES.length).toBe(7);
      GK_CATEGORIES.forEach(c => {
        expect(c.id).toBeDefined();
        expect(c.titleKey).toContain('generalKnowledge.categories');
        expect(c.emoji).toBeDefined();
        expect(c.lessons.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('ensures every lesson has title, facts, practice activity, and 3 quiz questions', () => {
      GK_CATEGORIES.forEach(c => {
        c.lessons.forEach(l => {
          expect(l.id).toBeDefined();
          expect(l.practice).toBeDefined();
          expect(l.practice.choices.length).toBeGreaterThanOrEqual(3);
          expect(l.practice.choices.some(ch => ch.isCorrect)).toBe(true);

          expect(l.quizQuestions.length).toBe(3);
          l.quizQuestions.forEach(q => {
            const correctOpts = q.options.filter(o => o.isCorrect);
            expect(correctOpts.length).toBe(1);
          });
        });
      });
    });

    it('provides 10 mixed questions for the Grand GK Challenge Arena', () => {
      expect(GRAND_GK_CHALLENGE_QUESTIONS.length).toBe(10);
      GRAND_GK_CHALLENGE_QUESTIONS.forEach(q => {
        const correct = q.options.filter(o => o.isCorrect);
        expect(correct.length).toBe(1);
      });
    });
  });

  describe('Progressive Lesson Unlocking Engine', () => {
    it('always unlocks the first lesson (index 0) in any category by default', () => {
      const initialProgress = readGKProgress();
      const firstVehicle = GK_CATEGORIES[0].lessons[0];
      const isUnlocked = isLessonUnlocked(
        'vehicles',
        firstVehicle.id,
        initialProgress,
      );
      expect(isUnlocked).toBe(true);
    });

    it('keeps subsequent lessons locked until prior lesson is completed with >= 2 stars', () => {
      const initialProgress = {
        lessonsProgress: {},
        completedCategories: [],
        challengeScore: 0,
        totalStars: 0,
      };
      const secondVehicle = GK_CATEGORIES[0].lessons[1];
      const isUnlocked = isLessonUnlocked(
        'vehicles',
        secondVehicle.id,
        initialProgress,
      );
      expect(isUnlocked).toBe(false);
    });

    it('unlocks the next lesson upon scoring 2+ stars in a quiz', () => {
      const firstVehicle = GK_CATEGORIES[0].lessons[0];
      const secondVehicle = GK_CATEGORIES[0].lessons[1];

      const res = recordGKLessonResult('vehicles', firstVehicle.id, 3);
      expect(res.nextLessonUnlockedId).toBe(secondVehicle.id);
      expect(res.progress.lessonsProgress[firstVehicle.id].completed).toBe(
        true,
      );
      expect(res.progress.lessonsProgress[firstVehicle.id].stars).toBe(3);

      const isSecondUnlocked = isLessonUnlocked(
        'vehicles',
        secondVehicle.id,
        res.progress,
      );
      expect(isSecondUnlocked).toBe(true);
    });

    it('records Grand Challenge scores properly', () => {
      const p = recordGrandChallengeScore(9);
      expect(p.challengeScore).toBe(9);
    });
  });

  describe('Gamification & Badge Rules for General Knowledge', () => {
    it('evaluates Curious Kid badge when 4 GK lessons are completed', () => {
      const ctx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        gkLessonsCompleted: 4,
      };

      const badges = evaluateNewBadges(ctx);
      const hasBadge = badges.some(b => b.id === 'curious_kid');
      expect(hasBadge).toBe(true);
    });

    it('evaluates Vehicle Explorer badge when 3 vehicle lessons are completed', () => {
      const ctx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        vehicleLessonsCompleted: 3,
      };

      const badges = evaluateNewBadges(ctx);
      const hasBadge = badges.some(b => b.id === 'vehicle_explorer');
      expect(hasBadge).toBe(true);
    });

    it('evaluates GK Champion badge when 4 categories are completed and 18 stars earned', () => {
      const ctx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        gkCategoriesCompleted: 4,
        gkStars: 18,
      };

      const badges = evaluateNewBadges(ctx);
      const hasBadge = badges.some(b => b.id === 'gk_champion');
      expect(hasBadge).toBe(true);
    });
  });
});
