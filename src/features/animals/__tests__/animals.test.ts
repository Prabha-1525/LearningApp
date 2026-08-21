import {
  ANIMALS_SUB_MODULES,
  LAND_ANIMALS,
  BIRDS_DATA,
  SEA_ANIMALS_DATA,
  AMPHIBIANS_REPTILES_DATA,
  INSECTS_DATA,
  BABY_ANIMALS_DATA,
  ANIMAL_SOUND_ITEMS,
  ANIMAL_HABITAT_ITEMS,
  ANIMAL_DIET_ITEMS,
  ANIMAL_MATCHING_PAIRS,
  ANIMAL_CLASSIFICATION_ITEMS,
  ANIMAL_COUNT_ITEMS,
  ANIMAL_PATTERNS,
  ANIMAL_PUZZLES,
  ANIMAL_QUIZZES,
} from '../domain/catalog/animalsData';
import {
  isAnimalSubModuleUnlocked,
  recordAnimalLessonResult,
  readAnimalsProgress,
  getAnimalsOverallProgress,
  resetAnimalsProgress,
} from '../data/progress/animalsProgress';
import {animalsAudio} from '../domain/audio/animalsAudioEngine';
import {BADGE_RULES} from '@core/gamification/domain/catalog/badgeRules';

describe('Animals Module Catalog', () => {
  it('defines 16 structured submodules with sequential IDs', () => {
    expect(ANIMALS_SUB_MODULES).toHaveLength(16);
    const ids = ANIMALS_SUB_MODULES.map(s => s.id);
    expect(new Set(ids).size).toBe(16);
    expect(ids).toContain('meet_animals');
    expect(ids).toContain('land_animals');
    expect(ids).toContain('animal_sounds');
    expect(ids).toContain('habitats');
    expect(ids).toContain('animal_diets');
    expect(ids).toContain('birds');
    expect(ids).toContain('sea_animals');
    expect(ids).toContain('amphibians_reptiles');
    expect(ids).toContain('insects');
    expect(ids).toContain('animal_babies');
    expect(ids).toContain('matching');
    expect(ids).toContain('classification');
    expect(ids).toContain('count');
    expect(ids).toContain('patterns');
    expect(ids).toContain('puzzles');
    expect(ids).toContain('challenge');
  });

  it('contains comprehensive animal catalog data across categories', () => {
    expect(LAND_ANIMALS.length).toBeGreaterThanOrEqual(14);
    expect(BIRDS_DATA.length).toBeGreaterThanOrEqual(10);
    expect(SEA_ANIMALS_DATA.length).toBeGreaterThanOrEqual(10);
    expect(AMPHIBIANS_REPTILES_DATA.length).toBeGreaterThanOrEqual(5);
    expect(INSECTS_DATA.length).toBeGreaterThanOrEqual(5);
    expect(BABY_ANIMALS_DATA.length).toBeGreaterThanOrEqual(8);

    LAND_ANIMALS.forEach(animal => {
      expect(animal.id).toBeTruthy();
      expect(animal.name).toBeTruthy();
      expect(animal.emoji).toBeTruthy();
      expect(animal.soundFrequencyHz).toBeGreaterThan(0);
      expect(animal.simpleFact).toBeTruthy();
      expect(animal.habitatDisplayName).toBeTruthy();
      expect(animal.foodDisplayName).toBeTruthy();
      expect(animal.babyName).toBeTruthy();
    });

    BIRDS_DATA.forEach(bird => {
      expect(bird.category).toBe('bird');
      expect(bird.emoji).toBeTruthy();
    });

    SEA_ANIMALS_DATA.forEach(sea => {
      expect(sea.category).toBe('sea');
      expect(sea.emoji).toBeTruthy();
    });
  });

  it('contains interactive sounds, habitats, diets, and puzzle items', () => {
    expect(ANIMAL_SOUND_ITEMS.length).toBeGreaterThanOrEqual(6);
    expect(ANIMAL_HABITAT_ITEMS.length).toBeGreaterThanOrEqual(6);
    expect(ANIMAL_DIET_ITEMS.length).toBeGreaterThanOrEqual(6);
    expect(ANIMAL_MATCHING_PAIRS.length).toBeGreaterThanOrEqual(5);
    expect(ANIMAL_CLASSIFICATION_ITEMS.length).toBeGreaterThanOrEqual(3);
    expect(ANIMAL_COUNT_ITEMS.length).toBeGreaterThanOrEqual(4);
    expect(ANIMAL_PATTERNS.length).toBeGreaterThanOrEqual(4);
    expect(ANIMAL_PUZZLES.length).toBeGreaterThanOrEqual(4);
    expect(ANIMAL_QUIZZES.challenge.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Animals Progress & Unlocking Logic', () => {
  beforeEach(() => {
    resetAnimalsProgress();
  });

  it('initializes with default progress and unlocks the first submodule', () => {
    const p = readAnimalsProgress();
    expect(p.completedSubModules).toEqual([]);
    expect(isAnimalSubModuleUnlocked('meet_animals', p)).toBe(true);
    expect(isAnimalSubModuleUnlocked('land_animals', p)).toBe(false);
  });

  it('unlocks subsequent submodules upon completion and calculates progress percentage', () => {
    let result = recordAnimalLessonResult(
      'meet_animals',
      'meet_animals_intro',
      3,
      4,
      'Dog',
    );
    expect(result.progress.completedSubModules).toContain('meet_animals');
    expect(isAnimalSubModuleUnlocked('land_animals', result.progress)).toBe(
      true,
    );
    expect(isAnimalSubModuleUnlocked('animal_sounds', result.progress)).toBe(
      false,
    );

    result = recordAnimalLessonResult(
      'land_animals',
      'land_animals_mastery',
      3,
      15,
      'Lion',
    );
    expect(isAnimalSubModuleUnlocked('animal_sounds', result.progress)).toBe(
      true,
    );

    const overall = getAnimalsOverallProgress(result.progress);
    expect(overall.percent).toBeGreaterThan(0);
    expect(overall.completedCount).toBe(2);
    expect(overall.animalsCount).toBeGreaterThanOrEqual(2);
  });
});

describe('Animals Audio Engine', () => {
  it('triggers synthesized tone frequencies and speech audio without throwing', () => {
    expect(() => animalsAudio.playTone(440, 50)).not.toThrow();
    expect(() => animalsAudio.playAnimalSound(300, 'Woof Woof')).not.toThrow();
    expect(() => animalsAudio.playSuccessChime()).not.toThrow();
    expect(() => animalsAudio.playMatchSound()).not.toThrow();
    expect(() => animalsAudio.playCelebrationFanfare()).not.toThrow();
    expect(() => animalsAudio.speak('Look at the lion!')).not.toThrow();
  });
});

describe('Animals Gamification Badges', () => {
  it('evaluates all 8 Animals badges properly', () => {
    const animalRules = BADGE_RULES.filter(
      r =>
        r.badgeId.startsWith('badge.animal_') ||
        r.badgeId === 'badge.bird_watcher' ||
        r.badgeId === 'badge.ocean_explorer' ||
        r.badgeId === 'badge.habitat_helper',
    );
    expect(animalRules).toHaveLength(8);

    const explorerRule = animalRules.find(r => r.id === 'animal_explorer');
    expect(
      explorerRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        animalsLearnedCount: 4,
      }),
    ).toBe(true);

    const soundRule = animalRules.find(r => r.id === 'animal_sound_detective');
    expect(
      soundRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        animalSoundsCount: 3,
      }),
    ).toBe(true);

    const birdRule = animalRules.find(r => r.id === 'bird_watcher');
    expect(
      birdRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        birdsLearnedCount: 4,
      }),
    ).toBe(true);

    const oceanRule = animalRules.find(r => r.id === 'ocean_explorer');
    expect(
      oceanRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        seaAnimalsCount: 4,
      }),
    ).toBe(true);

    const championRule = animalRules.find(r => r.id === 'animal_champion');
    expect(
      championRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        animalsLessonsCompleted: 10,
        animalsStars: 30,
      }),
    ).toBe(true);
  });
});
