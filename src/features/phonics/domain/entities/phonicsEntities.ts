export type PhonicsSubModuleId =
  | 'letter_sounds'
  | 'sound_recognition'
  | 'letter_matching'
  | 'beginning_sounds'
  | 'ending_sounds'
  | 'slow_blending'
  | 'cvc_words'
  | 'word_builder'
  | 'word_families'
  | 'word_transform'
  | 'hear_choose_word'
  | 'picture_to_word'
  | 'read_words'
  | 'read_sentences'
  | 'phonics_games'
  | 'phonics_challenge';

export interface PhonicsLetterItem {
  readonly id: string;
  readonly letter: string;
  readonly lowercase: string;
  readonly soundSymbol: string;
  readonly soundPronunciation: string;
  readonly exampleWord: string;
  readonly exampleEmoji: string;
  readonly color: string;
}

export interface PhonicsCvcWordItem {
  readonly id: string;
  readonly word: string;
  readonly letters: readonly string[];
  readonly sounds: readonly string[];
  readonly soundSymbols: readonly string[];
  readonly emoji: string;
  readonly vowelGroup: 'a' | 'e' | 'i' | 'o' | 'u';
  readonly sentence?: string;
}

export interface PhonicsWordFamilyItem {
  readonly id: string;
  readonly familyEnding: string;
  readonly words: readonly string[];
  readonly emojis: readonly string[];
  readonly color: string;
}

export interface PhonicsTransformItem {
  readonly id: string;
  readonly startWord: string;
  readonly targetWord: string;
  readonly changedPosition: 'first' | 'middle' | 'last';
  readonly newLetter: string;
  readonly startEmoji: string;
  readonly targetEmoji: string;
}

export interface PhonicsSentenceItem {
  readonly id: string;
  readonly text: string;
  readonly words: readonly string[];
  readonly emoji: string;
  readonly focusWord: string;
}

export interface PhonicsExerciseQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly audioPrompt?: string;
  readonly visualEmoji?: string;
  readonly options: readonly string[];
  readonly correctOption: string;
  readonly explanation: string;
}

export interface PhonicsSubModule {
  readonly id: PhonicsSubModuleId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly icon: string;
  readonly color: string;
  readonly order: number;
  readonly questionsCount: number;
}

export interface SubModuleProgress {
  readonly completed: boolean;
  readonly stars: number;
  readonly scorePercent: number;
  readonly attempts: number;
  readonly lastPlayedTimestamp?: number;
}

export interface PhonicsProgress {
  readonly unlockedSubModuleIds: readonly PhonicsSubModuleId[];
  readonly completedSubModuleIds: readonly PhonicsSubModuleId[];
  readonly subModuleProgress: Record<string, SubModuleProgress>;
  readonly totalStars: number;
  readonly lettersLearnedCount: number;
  readonly cvcWordsLearnedCount: number;
  readonly wordFamiliesCompletedCount: number;
  readonly sentencesReadCount: number;
  readonly lastPlayedSubModuleId?: PhonicsSubModuleId;
}

export const DEFAULT_PHONICS_PROGRESS: PhonicsProgress = {
  unlockedSubModuleIds: ['letter_sounds'],
  completedSubModuleIds: [],
  subModuleProgress: {},
  totalStars: 0,
  lettersLearnedCount: 0,
  cvcWordsLearnedCount: 0,
  wordFamiliesCompletedCount: 0,
  sentencesReadCount: 0,
};
