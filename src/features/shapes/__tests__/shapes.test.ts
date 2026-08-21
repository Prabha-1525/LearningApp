import {
  SHAPES_AROUND_US_ITEMS,
  SHAPES_DATA,
  SHAPES_SUB_MODULES,
  SHAPE_COMPARISON_ITEMS,
  SHAPE_COUNT_ITEMS,
  SHAPE_MATCHING_PAIRS,
  SHAPE_MEMORY_CARDS,
  SHAPE_PATTERNS,
  SHAPE_PUZZLES,
  SHAPE_RECOGNITION_ITEMS,
  SHAPE_SORTING_LEVELS,
  SUBMODULE_QUIZZES,
} from '../domain/catalog/shapesData';
import {
  DEFAULT_SHAPES_PROGRESS,
  type ShapesProgress,
} from '../domain/entities/shapeEntities';
import {
  getShapesOverallProgress,
  isShapeSubModuleUnlocked,
  readShapesProgress,
  recordShapeLessonResult,
  writeShapesProgress,
} from '../data/progress/shapesProgress';
import {
  asBadgeId,
  evaluateNewBadges,
} from '@core/gamification/domain/catalog/badgeRules';

describe('Shapes Learning Module', () => {
  beforeEach(() => {
    writeShapesProgress(DEFAULT_SHAPES_PROGRESS);
  });

  describe('Curriculum Catalog & Datasets', () => {
    it('has all 11 progressive sub-modules configured', () => {
      expect(SHAPES_SUB_MODULES).toHaveLength(11);
      const sub0 = SHAPES_SUB_MODULES[0];
      const sub1 = SHAPES_SUB_MODULES[1];
      const sub2 = SHAPES_SUB_MODULES[2];
      const sub3 = SHAPES_SUB_MODULES[3];
      const sub4 = SHAPES_SUB_MODULES[4];
      const sub5 = SHAPES_SUB_MODULES[5];
      const sub6 = SHAPES_SUB_MODULES[6];
      const sub7 = SHAPES_SUB_MODULES[7];
      const sub8 = SHAPES_SUB_MODULES[8];
      const sub9 = SHAPES_SUB_MODULES[9];
      const sub10 = SHAPES_SUB_MODULES[10];

      expect(sub0?.id).toBe('learn_shapes');
      expect(sub1?.id).toBe('recognition');
      expect(sub2?.id).toBe('matching');
      expect(sub3?.id).toBe('properties');
      expect(sub4?.id).toBe('sorting');
      expect(sub5?.id).toBe('compare');
      expect(sub6?.id).toBe('around_us');
      expect(sub7?.id).toBe('count');
      expect(sub8?.id).toBe('patterns');
      expect(sub9?.id).toBe('puzzles');
      expect(sub10?.id).toBe('challenge');
    });

    it('contains 11 distinct shapes with sides, corners, and real-world examples', () => {
      expect(SHAPES_DATA).toHaveLength(11);
      SHAPES_DATA.forEach(shape => {
        expect(shape.id).toBeTruthy();
        expect(shape.name).toBeTruthy();
        expect(shape.emoji).toBeTruthy();
        expect(shape.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(shape.audioPronunciation).toContain(shape.name);
        expect(shape.realWorldExamples.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('includes fundamental basic shapes: circle, square, triangle, rectangle', () => {
      const ids = SHAPES_DATA.map(s => s.id);
      expect(ids).toContain('circle');
      expect(ids).toContain('square');
      expect(ids).toContain('triangle');
      expect(ids).toContain('rectangle');
    });

    it('correctly models circle as 0 sides and triangle as 3 sides', () => {
      const circle = SHAPES_DATA.find(s => s.id === 'circle');
      expect(circle?.sides).toBe(0);
      expect(circle?.corners).toBe(0);
      expect(circle?.isCurved).toBe(true);

      const triangle = SHAPES_DATA.find(s => s.id === 'triangle');
      expect(triangle?.sides).toBe(3);
      expect(triangle?.corners).toBe(3);
      expect(triangle?.isCurved).toBe(false);
    });

    it('contains recognition items with rotation and scaling variations', () => {
      expect(SHAPE_RECOGNITION_ITEMS.length).toBeGreaterThanOrEqual(5);
      SHAPE_RECOGNITION_ITEMS.forEach(item => {
        expect(item.targetShapeId).toBeTruthy();
        const hasCorrect = item.options.some(
          o => o.shapeId === item.targetShapeId,
        );
        expect(hasCorrect).toBe(true);
      });
    });

    it('contains shape matching pairs', () => {
      expect(SHAPE_MATCHING_PAIRS.length).toBeGreaterThanOrEqual(4);
      SHAPE_MATCHING_PAIRS.forEach(pair => {
        expect(pair.shapeId).toBeTruthy();
        expect(pair.leftEmoji).toBeTruthy();
        expect(pair.rightEmoji).toBeTruthy();
      });
    });

    it('contains multi-container shape sorting levels', () => {
      expect(SHAPE_SORTING_LEVELS).toHaveLength(3);
      SHAPE_SORTING_LEVELS.forEach(lvl => {
        expect(lvl.containers.length).toBeGreaterThanOrEqual(2);
        expect(lvl.items.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('contains shape comparisons with valid explanations', () => {
      expect(SHAPE_COMPARISON_ITEMS.length).toBeGreaterThanOrEqual(4);
      SHAPE_COMPARISON_ITEMS.forEach(cmp => {
        expect(cmp.shapeA).toBeDefined();
        expect(cmp.shapeB).toBeDefined();
        expect(cmp.correctShapeId).toBeTruthy();
        expect(cmp.explanation).toBeTruthy();
      });
    });

    it('contains real-world everyday objects matched to shapes', () => {
      expect(SHAPES_AROUND_US_ITEMS.length).toBeGreaterThanOrEqual(5);
      SHAPES_AROUND_US_ITEMS.forEach(around => {
        expect(around.objectEmoji).toBeTruthy();
        expect(around.correctShapeId).toBeTruthy();
      });
    });

    it('contains visual shape counting challenges', () => {
      expect(SHAPE_COUNT_ITEMS.length).toBeGreaterThanOrEqual(3);
      SHAPE_COUNT_ITEMS.forEach(cnt => {
        expect(cnt.displayedItems.length).toBeGreaterThanOrEqual(
          cnt.correctCount,
        );
        expect(cnt.options).toContain(cnt.correctCount);
      });
    });

    it('contains repeating shape patterns: AB, AAB, ABC, AABB', () => {
      expect(SHAPE_PATTERNS.length).toBeGreaterThanOrEqual(4);
      const types = SHAPE_PATTERNS.map(p => p.patternType);
      expect(types).toContain('AB');
      expect(types).toContain('AAB');
      expect(types).toContain('ABC');
      expect(types).toContain('AABB');
    });

    it('contains visual puzzles and memory cards', () => {
      expect(SHAPE_PUZZLES.length).toBeGreaterThanOrEqual(3);
      expect(SHAPE_MEMORY_CARDS.length).toBe(8);
    });

    it('contains valid quizzes with corresponding answer options', () => {
      Object.entries(SUBMODULE_QUIZZES).forEach(([, questions]) => {
        questions.forEach(q => {
          const match = q.options.find(opt => opt.id === q.answerId);
          expect(match).toBeDefined();
        });
      });
    });
  });

  describe('Progress Persistence & Unlocking', () => {
    it('initializes default progress correctly', () => {
      const p = readShapesProgress();
      expect(p.completedSubModules).toEqual([]);
      expect(p.totalStars).toBe(0);
    });

    it('unlocks initial 3 submodules by default', () => {
      expect(isShapeSubModuleUnlocked('learn_shapes')).toBe(true);
      expect(isShapeSubModuleUnlocked('recognition')).toBe(true);
      expect(isShapeSubModuleUnlocked('matching')).toBe(true);
      expect(isShapeSubModuleUnlocked('properties')).toBe(false);
    });

    it('unlocks properties when previous submodules are completed', () => {
      const progress: ShapesProgress = {
        ...DEFAULT_SHAPES_PROGRESS,
        completedSubModules: ['learn_shapes', 'recognition', 'matching'],
      };
      expect(isShapeSubModuleUnlocked('properties', progress)).toBe(true);
    });

    it('records lesson result and increments stars accurately', () => {
      const res = recordShapeLessonResult(
        'learn_shapes',
        'learn_shapes_intro',
        3,
        100,
        'Circle',
      );
      expect(res.isNewUnlock).toBe(true);
      expect(res.progress.totalStars).toBe(3);
      expect(res.progress.completedSubModules).toContain('learn_shapes');
      expect(res.progress.shapesLearned).toContain('Circle');
    });

    it('computes overall progress percentage accurately', () => {
      const empty = getShapesOverallProgress(null);
      expect(empty.percent).toBe(0);

      const partial = getShapesOverallProgress({
        ...DEFAULT_SHAPES_PROGRESS,
        completedSubModules: [
          'learn_shapes',
          'recognition',
          'matching',
          'properties',
          'sorting',
        ],
      });
      expect(partial.percent).toBe(45);
    });
  });

  describe('Gamification & Badge Evaluation', () => {
    const emptyBadges = new Set([asBadgeId('badge.sample_other')]);

    it('awards shape_explorer badge when shapes are learned', () => {
      const badges = evaluateNewBadges({
        completedLessonCount: 1,
        perfectLessonCount: 1,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        shapesLearnedCount: 4,
        shapesLessonsCompleted: 1,
        shapesStars: 3,
        currentStreak: 1,
        ownedBadgeIds: emptyBadges,
      });
      const badgeIds = badges.map(b => b.id);
      expect(badgeIds).toContain('shape_explorer');
    });

    it('awards shape_detective and shape_matcher badges on mastery', () => {
      const badges = evaluateNewBadges({
        completedLessonCount: 3,
        perfectLessonCount: 3,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        shapeRecognitionCount: 3,
        shapeMatchingCount: 3,
        shapesLessonsCompleted: 3,
        shapesStars: 9,
        currentStreak: 2,
        ownedBadgeIds: emptyBadges,
      });
      const badgeIds = badges.map(b => b.id);
      expect(badgeIds).toContain('shape_detective');
      expect(badgeIds).toContain('shape_matcher');
    });

    it('awards shape_sorter, pattern_finder, and shape_champion badges', () => {
      const badges = evaluateNewBadges({
        completedLessonCount: 10,
        perfectLessonCount: 10,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        shapeSortingCount: 3,
        shapePatternsCount: 3,
        shapePuzzlesCount: 3,
        shapesLessonsCompleted: 10,
        shapesStars: 30,
        currentStreak: 3,
        ownedBadgeIds: emptyBadges,
      });
      const badgeIds = badges.map(b => b.id);
      expect(badgeIds).toContain('shape_sorter');
      expect(badgeIds).toContain('pattern_finder');
      expect(badgeIds).toContain('shape_champion');
    });
  });
});
