import {
  COLOR_MATCHING_ITEMS,
  COLOR_MIXING_RECIPES,
  COLORING_PAGES,
  COLORS_DATA,
  CREATIVE_CHALLENGES,
  DRAWING_SUB_MODULES,
  GUIDED_DRAWING_LESSONS,
  SHAPES_DATA,
  SIMPLE_OBJECT_DRAWING_DATA,
  SUBMODULE_QUIZZES,
  TRACING_PATHS,
} from '../domain/catalog/drawingData';
import {
  DEFAULT_DRAWING_PROGRESS,
  type DrawingProgress,
  type GalleryArtwork,
} from '../domain/entities/drawingEntities';
import {
  deleteGalleryArtwork,
  getDrawingOverallProgress,
  isDrawingSubModuleUnlocked,
  readDrawingProgress,
  readGalleryArtworks,
  recordDrawingLessonResult,
  saveGalleryArtwork,
  toggleFavoriteArtwork,
  writeDrawingProgress,
} from '../data/progress/drawingProgress';
import {
  asBadgeId,
  evaluateNewBadges,
} from '@core/gamification/domain/catalog/badgeRules';

describe('Colors & Drawing Module', () => {
  beforeEach(() => {
    writeDrawingProgress(DEFAULT_DRAWING_PROGRESS);
  });

  describe('Curriculum Catalog & Data', () => {
    it('has all 10 progressive sub-modules configured', () => {
      expect(DRAWING_SUB_MODULES).toHaveLength(10);
      const sub0 = DRAWING_SUB_MODULES[0];
      const sub1 = DRAWING_SUB_MODULES[1];
      const sub2 = DRAWING_SUB_MODULES[2];
      const sub3 = DRAWING_SUB_MODULES[3];
      const sub4 = DRAWING_SUB_MODULES[4];
      const sub5 = DRAWING_SUB_MODULES[5];
      const sub6 = DRAWING_SUB_MODULES[6];
      const sub7 = DRAWING_SUB_MODULES[7];
      const sub8 = DRAWING_SUB_MODULES[8];
      const sub9 = DRAWING_SUB_MODULES[9];

      expect(sub0?.id).toBe('colors');
      expect(sub1?.id).toBe('color_match');
      expect(sub2?.id).toBe('color_mix');
      expect(sub3?.id).toBe('coloring');
      expect(sub4?.id).toBe('trace');
      expect(sub5?.id).toBe('shapes');
      expect(sub6?.id).toBe('draw_objects');
      expect(sub7?.id).toBe('guided_drawing');
      expect(sub8?.id).toBe('free_drawing');
      expect(sub9?.id).toBe('creative_challenge');
    });

    it('contains 11 distinct colors with valid hex codes and objects', () => {
      expect(COLORS_DATA).toHaveLength(11);
      COLORS_DATA.forEach(color => {
        expect(color.id).toBeTruthy();
        expect(color.name).toBeTruthy();
        expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(color.audioPronunciation).toContain(color.name);
        expect(color.objects.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('includes primary colors Red, Blue, Yellow', () => {
      const primaryColors = COLORS_DATA.filter(c => c.isPrimary);
      expect(primaryColors).toHaveLength(3);
      const ids = primaryColors.map(c => c.id);
      expect(ids).toContain('red');
      expect(ids).toContain('blue');
      expect(ids).toContain('yellow');
    });

    it('contains color matching challenges with correct answer options', () => {
      expect(COLOR_MATCHING_ITEMS.length).toBeGreaterThanOrEqual(5);
      COLOR_MATCHING_ITEMS.forEach(item => {
        expect(item.id).toBeTruthy();
        expect(item.targetColorId).toBeTruthy();
        const hasCorrectOption = item.options.some(
          opt => opt.colorId === item.targetColorId,
        );
        expect(hasCorrectOption).toBe(true);
      });
    });

    it('contains primary to secondary color mixing recipes', () => {
      expect(COLOR_MIXING_RECIPES.length).toBeGreaterThanOrEqual(5);
      const orangeRecipe = COLOR_MIXING_RECIPES.find(
        r => r.id === 'mix_orange',
      );
      expect(orangeRecipe).toBeDefined();
      expect(orangeRecipe?.color1.name).toBe('Red');
      expect(orangeRecipe?.color2.name).toBe('Yellow');
      expect(orangeRecipe?.resultColor.name).toBe('Orange');

      const greenRecipe = COLOR_MIXING_RECIPES.find(r => r.id === 'mix_green');
      expect(greenRecipe?.resultColor.name).toBe('Green');

      const purpleRecipe = COLOR_MIXING_RECIPES.find(
        r => r.id === 'mix_purple',
      );
      expect(purpleRecipe?.resultColor.name).toBe('Purple');
    });

    it('contains multi-region coloring pages with valid coordinates', () => {
      expect(COLORING_PAGES.length).toBeGreaterThanOrEqual(8);
      COLORING_PAGES.forEach(page => {
        expect(page.id).toBeTruthy();
        expect(page.regions.length).toBeGreaterThanOrEqual(2);
        page.regions.forEach(region => {
          expect(region.id).toBeTruthy();
          expect(region.suggestedColorHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
          expect(region.width).toBeGreaterThan(0);
          expect(region.height).toBeGreaterThan(0);
        });
      });
    });

    it('contains progressive tracing paths', () => {
      expect(TRACING_PATHS.length).toBeGreaterThanOrEqual(5);
      TRACING_PATHS.forEach(p => {
        expect(p.points.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('contains 6 basic geometric shapes with stroke sequences', () => {
      expect(SHAPES_DATA).toHaveLength(6);
      const shapeIds = SHAPES_DATA.map(s => s.id);
      expect(shapeIds).toEqual([
        'circle',
        'square',
        'triangle',
        'rectangle',
        'star',
        'heart',
      ]);
      SHAPES_DATA.forEach(shape => {
        expect(shape.strokeSequence.length).toBeGreaterThan(0);
        expect(shape.guidePoints.length).toBeGreaterThan(0);
      });
    });

    it('contains simple object drawings and step-by-step guided lessons', () => {
      expect(SIMPLE_OBJECT_DRAWING_DATA.length).toBeGreaterThanOrEqual(5);
      expect(GUIDED_DRAWING_LESSONS.length).toBeGreaterThanOrEqual(3);
      GUIDED_DRAWING_LESSONS.forEach(lesson => {
        expect(lesson.steps.length).toBe(lesson.totalSteps);
        lesson.steps.forEach(step => {
          expect(step.instruction).toBeTruthy();
        });
      });
    });

    it('contains creative imagination challenges', () => {
      expect(CREATIVE_CHALLENGES.length).toBeGreaterThanOrEqual(5);
      CREATIVE_CHALLENGES.forEach(ch => {
        expect(ch.prompt).toBeTruthy();
        expect(ch.inspirationalTips.length).toBeGreaterThan(0);
      });
    });

    it('contains valid quizzes with corresponding correct answer choices', () => {
      Object.entries(SUBMODULE_QUIZZES).forEach(([, questions]) => {
        questions.forEach(q => {
          const match = q.options.find(opt => opt.id === q.answerId);
          expect(match).toBeDefined();
        });
      });
    });
  });

  describe('Progress Persistence & Unlock Logic', () => {
    it('returns default progress when initial', () => {
      const p = readDrawingProgress();
      expect(p.completedSubModules).toEqual([]);
      expect(p.totalStars).toBe(0);
    });

    it('unlocks initial submodules by default', () => {
      expect(isDrawingSubModuleUnlocked('colors')).toBe(true);
      expect(isDrawingSubModuleUnlocked('color_match')).toBe(true);
      expect(isDrawingSubModuleUnlocked('coloring')).toBe(true);
      expect(isDrawingSubModuleUnlocked('trace')).toBe(false);
    });

    it('unlocks subsequent submodules when previous is completed', () => {
      const progress: DrawingProgress = {
        ...DEFAULT_DRAWING_PROGRESS,
        completedSubModules: ['colors', 'color_match', 'color_mix', 'coloring'],
      };
      expect(isDrawingSubModuleUnlocked('trace', progress)).toBe(true);
    });

    it('records lesson result, stars and mastered items', () => {
      const res = recordDrawingLessonResult(
        'colors',
        'learn_colors_intro',
        3,
        100,
        'Red',
      );
      expect(res.isNewUnlock).toBe(true);
      expect(res.progress.totalStars).toBe(3);
      expect(res.progress.completedSubModules).toContain('colors');
      expect(res.progress.colorsLearned).toContain('Red');
    });

    it('computes overall module progress percentage accurately', () => {
      const empty = getDrawingOverallProgress(null);
      expect(empty.percent).toBe(0);

      const partial = getDrawingOverallProgress({
        completedSubModules: [
          'colors',
          'color_match',
          'color_mix',
          'coloring',
          'trace',
        ],
        totalStars: 15,
      });
      expect(partial.percent).toBe(50);
      expect(partial.colorsDone).toBe(true);
      expect(partial.coloringDone).toBe(true);
    });
  });

  describe('Art Gallery Persistence', () => {
    it('saves artwork, reads it back, toggles favorite, and deletes', () => {
      const art: GalleryArtwork = {
        id: 'test_art_1',
        title: 'Happy Sunshine',
        createdAt: new Date().toISOString(),
        strokes: [],
        type: 'free_drawing',
        isFavorite: false,
        emojiThumbnail: '☀️',
      };

      saveGalleryArtwork(art);
      let items = readGalleryArtworks();
      expect(items.some(a => a.id === 'test_art_1')).toBe(true);

      const isFav = toggleFavoriteArtwork('test_art_1');
      expect(isFav).toBe(true);
      items = readGalleryArtworks();
      expect(items.find(a => a.id === 'test_art_1')?.isFavorite).toBe(true);

      deleteGalleryArtwork('test_art_1');
      items = readGalleryArtworks();
      expect(items.some(a => a.id === 'test_art_1')).toBe(false);
    });
  });

  describe('Gamification & Badge Evaluation', () => {
    const emptyBadges = new Set([asBadgeId('badge.sample_other')]);

    it('awards color_explorer badge when 3 colors are learned', () => {
      const badges = evaluateNewBadges({
        completedLessonCount: 1,
        perfectLessonCount: 1,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        colorsLearnedCount: 3,
        drawingLessonsCompleted: 1,
        drawingStars: 3,
        currentStreak: 1,
        ownedBadgeIds: emptyBadges,
      });
      const badgeIds = badges.map(b => b.id);
      expect(badgeIds).toContain('color_explorer');
    });

    it('awards coloring_star and shape_artist badges on mastery', () => {
      const badges = evaluateNewBadges({
        completedLessonCount: 5,
        perfectLessonCount: 5,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        objectsColoredCount: 4,
        shapesDrawnCount: 5,
        drawingStars: 15,
        currentStreak: 2,
        ownedBadgeIds: emptyBadges,
      });
      const badgeIds = badges.map(b => b.id);
      expect(badgeIds).toContain('coloring_star');
      expect(badgeIds).toContain('shape_artist');
    });

    it('awards little_artist, creative_creator, and art_champion badges', () => {
      const badges = evaluateNewBadges({
        completedLessonCount: 10,
        perfectLessonCount: 10,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        guidedDrawingsCount: 3,
        creativeChallengesCount: 2,
        drawingLessonsCompleted: 8,
        drawingStars: 24,
        currentStreak: 3,
        ownedBadgeIds: emptyBadges,
      });
      const badgeIds = badges.map(b => b.id);
      expect(badgeIds).toContain('little_artist');
      expect(badgeIds).toContain('creative_creator');
      expect(badgeIds).toContain('art_champion');
    });
  });
});
