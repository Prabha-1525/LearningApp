import {
  EMOTION_SCENARIOS,
  EMOTIONS_LIST,
  HEALTHY_HABITS_LIST,
  HYGIENE_HABITS,
  LIFE_SKILLS_QUIZ_QUESTIONS,
  LIFE_SKILLS_TOPIC_CARDS,
  MANNERS_SCENARIOS,
  MORNING_ROUTINE_STEPS,
  SAFETY_TIPS_LIST,
} from '../domain/catalog/lifeSkillsData';
import {
  readLifeSkillsProgress,
  recordHygieneHabitMastered,
  recordLifeSkillsTopicCompletion,
  recordMannersScenarioSolved,
  recordRoutineSequenced,
} from '../data/progress/lifeSkillsProgress';
import {
  evaluateNewBadges,
  type BadgeEvalContext,
} from '@core/gamification/domain/catalog/badgeRules';

describe('Life Skills Module', () => {
  describe('Catalog & Curriculum Data', () => {
    it('provides 7 topic cards for the Life Skills hub', () => {
      expect(LIFE_SKILLS_TOPIC_CARDS.length).toBe(7);
      LIFE_SKILLS_TOPIC_CARDS.forEach(c => {
        expect(c.id).toBeDefined();
        expect(c.titleKey).toContain('lifeSkills.topics');
        expect(c.emoji).toBeDefined();
      });
    });

    it('provides 6 daily hygiene habits', () => {
      expect(HYGIENE_HABITS.length).toBe(6);
      HYGIENE_HABITS.forEach(h => {
        expect(h.id).toBeDefined();
        expect(h.titleKey).toContain('lifeSkills.hygiene');
        expect(h.sparkleColor).toBeDefined();
      });
    });

    it('provides 6 core emotions and 6 empathy scenarios', () => {
      expect(EMOTIONS_LIST.length).toBe(6);
      expect(EMOTION_SCENARIOS.length).toBe(6);
      EMOTION_SCENARIOS.forEach(sc => {
        expect(sc.options.length).toBeGreaterThanOrEqual(3);
        expect(sc.options).toContain(sc.correctEmotionId);
      });
    });

    it('provides 6 manners scenarios with polite magic word options', () => {
      expect(MANNERS_SCENARIOS.length).toBe(6);
      MANNERS_SCENARIOS.forEach(m => {
        const correct = m.options.filter(o => o.isCorrect);
        expect(correct.length).toBe(1);
      });
    });

    it('provides 6 morning routine steps ordered sequentially from 1 to 6', () => {
      expect(MORNING_ROUTINE_STEPS.length).toBe(6);
      MORNING_ROUTINE_STEPS.forEach((step, idx) => {
        expect(step.orderIndex).toBe(idx + 1);
        expect(step.timeHint).toBeDefined();
      });
    });

    it('provides 6 healthy habit cards', () => {
      expect(HEALTHY_HABITS_LIST.length).toBe(6);
    });

    it('provides 6 vital personal safety rules', () => {
      expect(SAFETY_TIPS_LIST.length).toBe(6);
      SAFETY_TIPS_LIST.forEach(st => {
        expect(st.ruleKey).toBeDefined();
        expect(st.safeChoiceKey).toBeDefined();
      });
    });

    it('provides 10 quiz arena questions with single correct answers', () => {
      expect(LIFE_SKILLS_QUIZ_QUESTIONS.length).toBe(10);
      LIFE_SKILLS_QUIZ_QUESTIONS.forEach(q => {
        const correct = q.options.filter(o => o.isCorrect);
        expect(correct.length).toBe(1);
      });
    });
  });

  describe('Progress Persistence', () => {
    it('returns default progress when nothing is stored', () => {
      const p = readLifeSkillsProgress();
      expect(p).toBeDefined();
      expect(p.totalStars).toBeGreaterThanOrEqual(0);
    });

    it('updates topic progress on completion', () => {
      const updated = recordLifeSkillsTopicCompletion('hygiene', 3);
      expect(updated.topicsProgress.hygiene.completed).toBe(true);
      expect(updated.topicsProgress.hygiene.stars).toBe(3);
    });

    it('records individual mastery metrics', () => {
      const p1 = recordHygieneHabitMastered();
      expect(p1.hygieneHabitsMastered).toBeGreaterThanOrEqual(1);

      const p2 = recordMannersScenarioSolved();
      expect(p2.mannersScenariosSolved).toBeGreaterThanOrEqual(1);

      const p3 = recordRoutineSequenced();
      expect(p3.routinesSequenced).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Gamification & Badge Rules for Life Skills', () => {
    it('evaluates Kind Kid badge when manners scenarios are solved', () => {
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
        mannersScenariosSolved: 2,
      };

      const badges = evaluateNewBadges(ctx);
      const hasBadge = badges.some(b => b.id === 'kind_kid');
      expect(hasBadge).toBe(true);
    });

    it('evaluates Clean Habits badge when 4 hygiene habits are mastered', () => {
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
        hygieneHabitsMastered: 4,
      };

      const badges = evaluateNewBadges(ctx);
      const hasBadge = badges.some(b => b.id === 'clean_habits');
      expect(hasBadge).toBe(true);
    });

    it('evaluates Life Skills Star badge when 5 topics are completed with 15 stars', () => {
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
        lifeSkillsTopicsCompleted: 5,
        lifeSkillsStars: 15,
      };

      const badges = evaluateNewBadges(ctx);
      const hasBadge = badges.some(b => b.id === 'life_skills_star');
      expect(hasBadge).toBe(true);
    });
  });
});
