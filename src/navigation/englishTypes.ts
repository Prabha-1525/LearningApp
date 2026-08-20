import type {EnglishSubModuleId} from '../features/english/domain/entities/englishEntities';

export type EnglishStackParamList = {
  Home: undefined;
  Alphabet: undefined;
  CapitalSmall: undefined;
  LetterSounds: undefined;
  LetterObjects: undefined;
  Phonics: undefined;
  SoundBlending: undefined;
  WordBuilding: undefined;
  CVCWords: undefined;
  SightWords: undefined;
  TongueTwisters: undefined;
  SentenceReading: undefined;
  ShortStories: undefined;
  ReadingChallenge: undefined;
  LessonComplete: {
    subModuleId: EnglishSubModuleId;
    title: string;
    stars: number;
    score: number;
    totalQuestions: number;
    nextSubModuleId?: EnglishSubModuleId;
  };
};
