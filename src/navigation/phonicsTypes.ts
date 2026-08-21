import type {PhonicsSubModuleId} from '../features/phonics/domain/entities/phonicsEntities';

export type PhonicsStackParamList = {
  PhonicsHome: undefined;
  LetterSounds: undefined;
  SoundRecognition: undefined;
  LetterMatching: undefined;
  BeginningSounds: undefined;
  EndingSounds: undefined;
  SlowBlending: undefined;
  CVCWords: undefined;
  WordBuilder: undefined;
  WordFamilies: undefined;
  WordTransform: undefined;
  HearChooseWord: undefined;
  PictureToWord: undefined;
  ReadWords: undefined;
  ReadSentences: undefined;
  PhonicsGames: undefined;
  PhonicsChallenge: undefined;
  PhonicsLessonComplete: {
    subModuleId: PhonicsSubModuleId;
    title: string;
    starsEarned: number;
    scorePercent: number;
    unlockedNextId?: PhonicsSubModuleId;
  };
};
