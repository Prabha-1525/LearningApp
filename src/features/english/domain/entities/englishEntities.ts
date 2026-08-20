export type EnglishSubModuleId =
  | 'alphabet'
  | 'capital_small'
  | 'letter_sounds'
  | 'letter_objects'
  | 'beginning_sounds'
  | 'phonics'
  | 'sound_blending'
  | 'word_building'
  | 'cvc_words'
  | 'sight_words'
  | 'tongue_twisters'
  | 'sentence_reading'
  | 'short_stories'
  | 'reading_challenge';

export interface AlphabetLetter {
  readonly id: string;
  readonly upper: string;
  readonly lower: string;
  readonly soundIpa: string;
  readonly soundHint: string;
  readonly word: string;
  readonly emoji: string;
  readonly sentence: string;
  readonly audioSpeech: string;
  readonly color: string;
}

export interface LetterMatchPair {
  readonly id: string;
  readonly upper: string;
  readonly lower: string;
  readonly distractors: readonly string[];
}

export interface LetterSoundItem {
  readonly letter: string;
  readonly soundHint: string;
  readonly exampleWord: string;
  readonly emoji: string;
  readonly audioText: string;
  readonly options: readonly {
    readonly id: string;
    readonly text: string;
    readonly isCorrect: boolean;
  }[];
}

export interface LetterObjectItem {
  readonly letter: string;
  readonly objectName: string;
  readonly emoji: string;
  readonly sentence: string;
  readonly distractors: readonly {
    readonly objectName: string;
    readonly emoji: string;
  }[];
}

export interface BeginningSoundItem {
  readonly word: string;
  readonly firstLetter: string;
  readonly soundHint: string;
  readonly emoji: string;
  readonly distractorSounds: readonly string[];
}

export interface PhonicsItem {
  readonly id: string;
  readonly letters: readonly string[];
  readonly sounds: readonly string[];
  readonly blendedWord: string;
  readonly emoji: string;
  readonly explanation: string;
}

export interface BlendingWordItem {
  readonly id: string;
  readonly letters: readonly string[];
  readonly phonemes: readonly string[];
  readonly blendedWord: string;
  readonly emoji: string;
  readonly sentence: string;
}

export interface WordBuildingTask {
  readonly id: string;
  readonly targetWord: string;
  readonly emoji: string;
  readonly scrambledLetters: readonly string[];
  readonly category: string;
}

export interface CVCWordItem {
  readonly id: string;
  readonly word: string;
  readonly onset: string;
  readonly rime: string;
  readonly vowel: 'a' | 'e' | 'i' | 'o' | 'u';
  readonly family: string;
  readonly emoji: string;
  readonly sentence: string;
}

export interface SightWordItem {
  readonly id: string;
  readonly word: string;
  readonly exampleSentence: string;
  readonly emoji: string;
  readonly color: string;
}

export interface TongueTwisterItem {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly targetSound: string;
  readonly highlightedLetter: string;
  readonly emoji: string;
  readonly speedText: string;
}

export interface SentenceReadingItem {
  readonly id: string;
  readonly text: string;
  readonly words: readonly string[];
  readonly emoji: string;
  readonly level: 1 | 2 | 3;
  readonly comprehensionQuestion: {
    readonly question: string;
    readonly options: readonly string[];
    readonly answer: string;
  };
}

export interface ShortStoryPage {
  readonly text: string;
  readonly emoji: string;
  readonly words: readonly string[];
}

export interface ShortStoryItem {
  readonly id: string;
  readonly title: string;
  readonly coverEmoji: string;
  readonly pages: readonly ShortStoryPage[];
  readonly fullStoryText: string;
  readonly questions: readonly {
    readonly id: string;
    readonly question: string;
    readonly options: readonly string[];
    readonly answer: string;
  }[];
}

export type EnglishQuestionType =
  | 'multiple-choice'
  | 'image-choice'
  | 'letter-match'
  | 'sound-identify'
  | 'missing-letter'
  | 'word-builder'
  | 'sentence-completion'
  | 'story-comprehension';

export interface EnglishQuestionOption {
  readonly id: string;
  readonly text: string;
  readonly emoji?: string;
  readonly isCorrect: boolean;
}

export interface EnglishQuizQuestion {
  readonly id: string;
  readonly type: EnglishQuestionType;
  readonly prompt: string;
  readonly promptEmoji?: string;
  readonly targetAudio?: string;
  readonly options: readonly EnglishQuestionOption[];
  readonly explanation: string;
  readonly missingWord?: string;
  readonly scrambledLetters?: readonly string[];
  readonly targetWord?: string;
}

export interface EnglishLessonState {
  readonly completed: boolean;
  readonly stars: number;
  readonly score: number;
  readonly unlocked: boolean;
}

export interface EnglishProgress {
  readonly completedSubModules: readonly EnglishSubModuleId[];
  readonly lessonsProgress: Record<string, EnglishLessonState>;
  readonly totalStars: number;
  readonly wordsMastered: readonly string[];
  readonly sightWordsMastered: readonly string[];
  readonly storiesCompleted: readonly string[];
  readonly readingChallengeScore: number;
  readonly readingChallengePassed: boolean;
}

export const DEFAULT_ENGLISH_PROGRESS: EnglishProgress = {
  completedSubModules: [],
  lessonsProgress: {
    alphabet_intro: {completed: false, stars: 0, score: 0, unlocked: true},
    capital_small_match: {completed: false, stars: 0, score: 0, unlocked: true},
  },
  totalStars: 0,
  wordsMastered: [],
  sightWordsMastered: [],
  storiesCompleted: [],
  readingChallengeScore: 0,
  readingChallengePassed: false,
};

export interface SubModuleConfig {
  readonly id: EnglishSubModuleId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly bgLightColor: string;
  readonly orderIndex: number;
  readonly routeName: string;
}
