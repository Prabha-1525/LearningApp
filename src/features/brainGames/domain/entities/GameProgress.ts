import type {BrainGameId} from './BrainGame';

export type GameProgress = {
  /** Best stars earned (0–3) */
  readonly bestStars: number;
  /** Number of times played */
  readonly playCount: number;
  /** Highest difficulty cleared */
  readonly highestDifficulty: 'beginner' | 'intermediate' | 'advanced';
};

export type BrainGamesProgress = {
  readonly gamesProgress: Readonly<Record<BrainGameId, GameProgress>>;
  readonly totalStars: number;
  readonly totalGamesPlayed: number;
};

const defaultGameProgress: GameProgress = {
  bestStars: 0,
  playCount: 0,
  highestDifficulty: 'beginner',
};

export const DEFAULT_BRAIN_GAMES_PROGRESS: BrainGamesProgress = {
  gamesProgress: {
    'memory-match': defaultGameProgress,
    'matching-pairs': defaultGameProgress,
    'pattern-completer': defaultGameProgress,
    'odd-one-out': defaultGameProgress,
    'number-sequence': defaultGameProgress,
    'sort-it': defaultGameProgress,
    'find-the-difference': defaultGameProgress,
  },
  totalStars: 0,
  totalGamesPlayed: 0,
};
