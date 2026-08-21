export type AnimalSubModuleId =
  | 'meet_animals'
  | 'land_animals'
  | 'animal_sounds'
  | 'habitats'
  | 'animal_diets'
  | 'birds'
  | 'sea_animals'
  | 'amphibians_reptiles'
  | 'insects'
  | 'animal_babies'
  | 'matching'
  | 'classification'
  | 'count'
  | 'patterns'
  | 'puzzles'
  | 'quiz'
  | 'challenge';

export interface AnimalSubModuleConfig {
  readonly id: AnimalSubModuleId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly bgLightColor: string;
  readonly lessonCount: number;
}

export type AnimalHabitatType =
  | 'forest'
  | 'grassland'
  | 'desert'
  | 'polar'
  | 'ocean'
  | 'river'
  | 'farm';

export type AnimalDietType =
  | 'plants'
  | 'grass'
  | 'meat'
  | 'bamboo'
  | 'fruits'
  | 'fish'
  | 'insects'
  | 'seeds';

export interface AnimalItem {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly category:
    | 'land'
    | 'bird'
    | 'sea'
    | 'amphibian'
    | 'reptile'
    | 'insect';
  readonly soundName: string;
  readonly soundOnomatopoeia: string;
  readonly soundFrequencyHz?: number;
  readonly habitat: AnimalHabitatType;
  readonly habitatDisplayName: string;
  readonly habitatEmoji: string;
  readonly food: AnimalDietType;
  readonly foodDisplayName: string;
  readonly foodEmoji: string;
  readonly babyName: string;
  readonly simpleFact: string;
  readonly appearanceDescription: string;
  readonly traits: readonly string[];
  readonly color: string;
  readonly lightColor: string;
  readonly darkColor: string;
}

export interface AnimalSoundItem {
  readonly id: string;
  readonly animalId: string;
  readonly animalName: string;
  readonly emoji: string;
  readonly soundText: string;
  readonly promptAudio: string;
  readonly options: readonly {
    readonly id: string;
    readonly name: string;
    readonly emoji: string;
  }[];
  readonly correctAnimalId: string;
}

export interface AnimalHabitatItem {
  readonly id: string;
  readonly animalId: string;
  readonly animalName: string;
  readonly animalEmoji: string;
  readonly prompt: string;
  readonly correctHabitat: AnimalHabitatType;
  readonly correctHabitatName: string;
  readonly correctHabitatEmoji: string;
  readonly options: readonly {
    readonly id: AnimalHabitatType;
    readonly name: string;
    readonly emoji: string;
  }[];
  readonly explanation: string;
}

export interface AnimalDietItem {
  readonly id: string;
  readonly animalId: string;
  readonly animalName: string;
  readonly animalEmoji: string;
  readonly question: string;
  readonly correctFood: AnimalDietType;
  readonly correctFoodName: string;
  readonly correctFoodEmoji: string;
  readonly options: readonly {
    readonly id: AnimalDietType;
    readonly name: string;
    readonly emoji: string;
  }[];
  readonly explanation: string;
}

export interface BabyAnimalItem {
  readonly id: string;
  readonly parentAnimalId: string;
  readonly parentName: string;
  readonly parentEmoji: string;
  readonly babyName: string;
  readonly babyEmoji: string;
  readonly options: readonly string[];
  readonly correctBabyName: string;
  readonly fact: string;
}

export interface AnimalMatchingPair {
  readonly id: string;
  readonly leftLabel: string;
  readonly leftEmoji: string;
  readonly rightLabel: string;
  readonly rightEmoji: string;
  readonly matchKey: string;
  readonly pairType: 'sound' | 'habitat' | 'food' | 'baby' | 'category';
}

export interface AnimalClassificationItem {
  readonly id: string;
  readonly traitCategory:
    | 'can_fly'
    | 'lives_in_water'
    | 'farm_animals'
    | 'sea_animals';
  readonly question: string;
  readonly promptAudio: string;
  readonly targetAnimalIds: readonly string[];
  readonly options: readonly {
    readonly id: string;
    readonly name: string;
    readonly emoji: string;
    readonly matches: boolean;
  }[];
}

export interface AnimalCountItem {
  readonly id: string;
  readonly targetAnimalId: string;
  readonly targetAnimalName: string;
  readonly targetEmoji: string;
  readonly correctCount: number;
  readonly displayedItems: readonly {
    readonly id: string;
    readonly animalId: string;
    readonly emoji: string;
  }[];
  readonly options: readonly number[];
}

export interface AnimalPatternItem {
  readonly id: string;
  readonly patternType: 'AB' | 'AAB' | 'ABC' | 'AABB';
  readonly sequence: readonly {
    readonly animalId: string;
    readonly emoji: string;
  }[];
  readonly correctAnimalId: string;
  readonly correctEmoji: string;
  readonly options: readonly {
    readonly animalId: string;
    readonly emoji: string;
  }[];
}

export interface AnimalPuzzleItem {
  readonly id: string;
  readonly prompt: string;
  readonly items: readonly {
    readonly id: string;
    readonly animalId: string;
    readonly name: string;
    readonly emoji: string;
    readonly category: string;
  }[];
  readonly answerId: string;
  readonly explanation: string;
}

export interface AnimalQuizQuestion {
  readonly id: string;
  readonly type:
    | 'identification'
    | 'sound'
    | 'habitat'
    | 'food'
    | 'baby'
    | 'fact'
    | 'classification';
  readonly question: string;
  readonly targetEmoji?: string;
  readonly promptAudio?: string;
  readonly options: readonly {
    readonly id: string;
    readonly text: string;
    readonly emoji?: string;
  }[];
  readonly answerId: string;
  readonly explanation: string;
}

export interface AnimalLessonState {
  readonly completed: boolean;
  readonly stars: number;
  readonly score: number;
  readonly unlocked: boolean;
}

export interface AnimalsProgress {
  readonly completedSubModules: readonly AnimalSubModuleId[];
  readonly lessonsProgress: Readonly<Record<string, AnimalLessonState>>;
  readonly animalsLearned: readonly string[];
  readonly birdsLearned: readonly string[];
  readonly seaAnimalsLearned: readonly string[];
  readonly soundsMastered: readonly string[];
  readonly habitatsMastered: readonly string[];
  readonly dietsMastered: readonly string[];
  readonly babiesMastered: readonly string[];
  readonly patternsSolved: readonly string[];
  readonly puzzlesSolved: readonly string[];
  readonly totalStars: number;
}

export const DEFAULT_ANIMALS_PROGRESS: AnimalsProgress = {
  completedSubModules: [],
  lessonsProgress: {},
  animalsLearned: [],
  birdsLearned: [],
  seaAnimalsLearned: [],
  soundsMastered: [],
  habitatsMastered: [],
  dietsMastered: [],
  babiesMastered: [],
  patternsSolved: [],
  puzzlesSolved: [],
  totalStars: 0,
};
