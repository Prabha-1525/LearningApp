import {STORIES_DATA, STORY_CATEGORIES} from '../domain/catalog/storiesData';
import {
  getStoryOverallProgress,
  markStoryCompleted,
  readStoryProgress,
  resetStoryProgress,
  saveStoryBookmark,
  toggleFavoriteStory,
  updateStoryAudioSettings,
} from '../data/progress/storyProgress';
import {storyAudio} from '../domain/audio/storyAudioEngine';
import {BADGE_RULES} from '@core/gamification/domain/catalog/badgeRules';

describe('Story Time Catalog', () => {
  it('defines 8 complete stories with multiple scenes and characters', () => {
    expect(STORIES_DATA).toHaveLength(8);
    const ids = STORIES_DATA.map(s => s.id);
    expect(new Set(ids).size).toBe(8);

    STORIES_DATA.forEach(story => {
      expect(story.id).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.description).toBeTruthy();
      expect(story.durationMinutes).toBeGreaterThan(0);
      expect(story.coverEmoji).toBeTruthy();
      expect(story.moralLesson).toBeTruthy();
      expect(story.characters.length).toBeGreaterThanOrEqual(1);
      expect(story.scenes.length).toBeGreaterThanOrEqual(5);

      story.scenes.forEach(scene => {
        expect(scene.id).toBeTruthy();
        expect(scene.text).toBeTruthy();
        expect(scene.narrationText).toBeTruthy();
        expect(scene.characters.length).toBeGreaterThanOrEqual(1);
        expect(scene.bgColors.length).toBe(2);
      });
    });
  });

  it('defines 8 rich story categories', () => {
    expect(STORY_CATEGORIES).toHaveLength(8);
    const categoryIds = STORY_CATEGORIES.map(c => c.id);
    expect(categoryIds).toContain('moral');
    expect(categoryIds).toContain('animals');
    expect(categoryIds).toContain('friendship');
    expect(categoryIds).toContain('nature');
    expect(categoryIds).toContain('adventure');
    expect(categoryIds).toContain('school');
    expect(categoryIds).toContain('indian');
    expect(categoryIds).toContain('bedtime');
  });
});

describe('Story Progress & Bookmarking', () => {
  beforeEach(() => {
    resetStoryProgress();
  });

  it('initializes with default empty progress', () => {
    const p = readStoryProgress();
    expect(p.completedStoryIds).toEqual([]);
    expect(p.favoriteStoryIds).toEqual([]);
    expect(p.audioSettings.autoNarration).toBe(true);
  });

  it('saves story scene bookmarks accurately', () => {
    const updated = saveStoryBookmark('little_rabbit', 2, 5);
    expect(updated.lastReadStoryId).toBe('little_rabbit');
    expect(updated.storyProgressMap.little_rabbit?.currentSceneIndex).toBe(2);
    expect(updated.storyProgressMap.little_rabbit?.completed).toBe(false);
  });

  it('marks story completed and calculates overall percentage and stars', () => {
    const res = markStoryCompleted('little_rabbit', 3);
    expect(res.isFirstCompletion).toBe(true);
    expect(res.progress.completedStoryIds).toContain('little_rabbit');
    expect(res.progress.storyProgressMap.little_rabbit?.completed).toBe(true);
    expect(res.progress.totalStars).toBe(3);

    const overall = getStoryOverallProgress(res.progress);
    expect(overall.completedStories).toBe(1);
    expect(overall.totalStories).toBe(8);
    expect(overall.percent).toBe(13); // 1 / 8 = 12.5% -> 13%
  });

  it('toggles story favorites', () => {
    let res = toggleFavoriteStory('little_rabbit');
    expect(res.isFavorite).toBe(true);
    expect(res.progress.favoriteStoryIds).toContain('little_rabbit');

    res = toggleFavoriteStory('little_rabbit');
    expect(res.isFavorite).toBe(false);
    expect(res.progress.favoriteStoryIds).not.toContain('little_rabbit');
  });

  it('updates audio preferences', () => {
    const updated = updateStoryAudioSettings({autoNarration: false});
    expect(updated.audioSettings.autoNarration).toBe(false);
  });
});

describe('Story Audio Engine', () => {
  it('triggers speech and synthesized tones without throwing', () => {
    expect(() => storyAudio.playTone(440, 50)).not.toThrow();
    expect(() => storyAudio.playPageTurn()).not.toThrow();
    expect(() => storyAudio.playCelebrationFanfare()).not.toThrow();
    expect(() => storyAudio.speak('Once upon a time...')).not.toThrow();
  });
});

describe('Story Gamification Badges', () => {
  it('evaluates all 5 Story badges properly', () => {
    const storyRules = BADGE_RULES.filter(
      r =>
        r.badgeId === 'badge.first_story' ||
        r.badgeId === 'badge.story_lover' ||
        r.badgeId === 'badge.story_explorer' ||
        r.badgeId === 'badge.reading_star' ||
        r.badgeId === 'badge.story_champion',
    );
    expect(storyRules).toHaveLength(5);

    const firstRule = storyRules.find(r => r.id === 'first_story');
    expect(
      firstRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        storiesCompletedCount: 1,
      }),
    ).toBe(true);

    const loverRule = storyRules.find(r => r.id === 'story_lover');
    expect(
      loverRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        storiesCompletedCount: 3,
      }),
    ).toBe(true);

    const explorerRule = storyRules.find(r => r.id === 'story_explorer');
    expect(
      explorerRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        storiesCompletedCount: 5,
      }),
    ).toBe(true);

    const readingStarRule = storyRules.find(r => r.id === 'reading_star');
    expect(
      readingStarRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        storiesCompletedCount: 7,
      }),
    ).toBe(true);

    const championRule = storyRules.find(r => r.id === 'story_champion');
    expect(
      championRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        storiesCompletedCount: 8,
      }),
    ).toBe(true);
  });
});
