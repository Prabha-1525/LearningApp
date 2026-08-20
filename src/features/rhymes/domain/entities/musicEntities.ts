export type MusicTopicId =
  | 'instruments'
  | 'rhythm'
  | 'guessSound'
  | 'patterns'
  | 'piano'
  | 'quiz';

export type InstrumentFamily =
  | 'keyboard'
  | 'strings'
  | 'percussion'
  | 'brass'
  | 'woodwind';

export interface Instrument {
  readonly id: string;
  readonly nameKey: string;
  readonly emoji: string;
  readonly family: InstrumentFamily;
  readonly familyKey: string;
  readonly factKey: string;
  readonly soundDescriptionKey: string;
  readonly baseFrequency: number; // in Hz
  readonly noteSequence: readonly number[]; // array of note frequencies
  readonly accentColor: string;
}

export interface RhythmBeat {
  readonly id: string;
  readonly type: 'hit' | 'rest';
  readonly soundEmoji: string;
  readonly label: string;
  readonly durationMs: number;
}

export interface RhythmLevel {
  readonly id: string;
  readonly levelNumber: number;
  readonly titleKey: string;
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly beats: readonly RhythmBeat[];
  readonly tempoBpm: number;
  readonly accentColor: string;
}

export interface GuessSoundQuestion {
  readonly id: string;
  readonly targetInstrumentId: string;
  readonly options: readonly string[]; // instrument IDs
  readonly promptKey: string;
  readonly explanationKey: string;
}

export interface MusicPatternPuzzle {
  readonly id: string;
  readonly titleKey: string;
  readonly sequence: readonly string[]; // instrument emojis/ids
  readonly targetIndex: number;
  readonly options: readonly {
    readonly id: string;
    readonly emoji: string;
    readonly nameKey: string;
    readonly isCorrect: boolean;
  }[];
  readonly explanationKey: string;
}

export interface MelodyNote {
  readonly note: string; // 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4' | 'B4' | 'C5'
  readonly solfege: string; // 'Do' | 'Re' | 'Mi' | 'Fa' | 'So' | 'La' | 'Ti' | 'Do'
  readonly keyColor: string;
  readonly freq: number;
}

export interface MelodySong {
  readonly id: string;
  readonly titleKey: string;
  readonly emoji: string;
  readonly notes: readonly {
    readonly note: string;
    readonly durationMs: number;
  }[];
}

export interface MusicQuizQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly promptEmoji?: string;
  readonly options: readonly {
    readonly id: string;
    readonly textKey: string;
    readonly icon?: string;
    readonly isCorrect: boolean;
  }[];
  readonly explanationKey: string;
}

export interface TopicProgress {
  readonly completed: boolean;
  readonly stars: number;
}

export interface MusicProgress {
  readonly topicsProgress: Record<MusicTopicId, TopicProgress>;
  readonly instrumentsExplored: number;
  readonly rhythmLevelsCompleted: number;
  readonly soundGuessesCorrect: number;
  readonly totalStars: number;
}

export const DEFAULT_MUSIC_PROGRESS: MusicProgress = {
  topicsProgress: {
    instruments: {completed: false, stars: 0},
    rhythm: {completed: false, stars: 0},
    guessSound: {completed: false, stars: 0},
    patterns: {completed: false, stars: 0},
    piano: {completed: false, stars: 0},
    quiz: {completed: false, stars: 0},
  },
  instrumentsExplored: 0,
  rhythmLevelsCompleted: 0,
  soundGuessesCorrect: 0,
  totalStars: 0,
};
