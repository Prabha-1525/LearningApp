/**
 * Brain Games domain entities.
 * All game IDs and types are strictly typed here.
 */

export type BrainGameId =
  | 'memory-match'
  | 'matching-pairs'
  | 'pattern-completer'
  | 'odd-one-out'
  | 'number-sequence'
  | 'sort-it'
  | 'find-the-difference';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type BrainGameMeta = {
  readonly id: BrainGameId;
  readonly icon: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly accentColor: string;
  readonly defaultDifficulty: DifficultyLevel;
};

/** All registered Brain Games in unlock order */
export const BRAIN_GAMES: readonly BrainGameMeta[] = [
  {
    id: 'memory-match',
    icon: '🧠',
    titleKey: 'brainGames.games.memoryMatch.title',
    descriptionKey: 'brainGames.games.memoryMatch.desc',
    accentColor: '#7C3AED',
    defaultDifficulty: 'beginner',
  },
  {
    id: 'matching-pairs',
    icon: '🔗',
    titleKey: 'brainGames.games.matchingPairs.title',
    descriptionKey: 'brainGames.games.matchingPairs.desc',
    accentColor: '#0F8B8D',
    defaultDifficulty: 'beginner',
  },
  {
    id: 'pattern-completer',
    icon: '🔢',
    titleKey: 'brainGames.games.patternCompleter.title',
    descriptionKey: 'brainGames.games.patternCompleter.desc',
    accentColor: '#D97706',
    defaultDifficulty: 'beginner',
  },
  {
    id: 'odd-one-out',
    icon: '👀',
    titleKey: 'brainGames.games.oddOneOut.title',
    descriptionKey: 'brainGames.games.oddOneOut.desc',
    accentColor: '#DC2626',
    defaultDifficulty: 'beginner',
  },
  {
    id: 'number-sequence',
    icon: '🔢',
    titleKey: 'brainGames.games.numberSequence.title',
    descriptionKey: 'brainGames.games.numberSequence.desc',
    accentColor: '#059669',
    defaultDifficulty: 'beginner',
  },
  {
    id: 'sort-it',
    icon: '📦',
    titleKey: 'brainGames.games.sortIt.title',
    descriptionKey: 'brainGames.games.sortIt.desc',
    accentColor: '#2563EB',
    defaultDifficulty: 'beginner',
  },
  {
    id: 'find-the-difference',
    icon: '🔍',
    titleKey: 'brainGames.games.findDifference.title',
    descriptionKey: 'brainGames.games.findDifference.desc',
    accentColor: '#BE185D',
    defaultDifficulty: 'beginner',
  },
];
