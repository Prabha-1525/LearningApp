import type {AnimalSubModuleId} from '../features/animals/domain/entities/animalEntities';

export type AnimalsStackParamList = {
  AnimalsHome: undefined;
  MeetAnimals: undefined;
  LandAnimals: undefined;
  AnimalSounds: undefined;
  AnimalHabitats: undefined;
  AnimalDiets: undefined;
  Birds: undefined;
  SeaAnimals: undefined;
  AmphibiansReptiles: undefined;
  Insects: undefined;
  AnimalBabies: undefined;
  AnimalMatching: undefined;
  AnimalClassification: undefined;
  AnimalCount: undefined;
  AnimalPatterns: undefined;
  AnimalPuzzles: undefined;
  AnimalChallenge: undefined;
  LessonComplete: {
    subModuleId: AnimalSubModuleId;
    title: string;
    stars: number;
    score: number;
    totalQuestions: number;
    nextSubModuleId?: AnimalSubModuleId;
  };
};
