/**
 * Find the Difference game data.
 * Two emoji panels side-by-side — one item differs.
 */

export type DifferenceLevel = {
  readonly id: string;
  readonly level: number;
  readonly promptKey: string;
  /** Row × Column grids. Left is original, right has one swap at diffIndex. */
  readonly leftGrid: readonly string[];
  readonly rightGrid: readonly string[];
  /** Index in the right grid that is different */
  readonly diffIndex: number;
};

export const DIFFERENCE_LEVELS: readonly DifferenceLevel[] = [
  {
    id: 'diff-1-fruits',
    level: 1,
    promptKey: 'brainGames.findDifference.prompt',
    leftGrid: ['🍎', '🍌', '🍊', '🍎', '🍌', '🍊', '🍎', '🍌', '🍊'],
    rightGrid: ['🍎', '🍌', '🍊', '🍎', '🍇', '🍊', '🍎', '🍌', '🍊'],
    diffIndex: 4,
  },
  {
    id: 'diff-2-animals',
    level: 1,
    promptKey: 'brainGames.findDifference.prompt',
    leftGrid: ['🐶', '🐱', '🐶', '🐱', '🐶', '🐱', '🐶', '🐱', '🐶'],
    rightGrid: ['🐶', '🐱', '🐶', '🐱', '🐶', '🐱', '🦊', '🐱', '🐶'],
    diffIndex: 6,
  },
  {
    id: 'diff-3-colors',
    level: 2,
    promptKey: 'brainGames.findDifference.prompt',
    leftGrid: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡', '🔴', '🔵', '🟡'],
    rightGrid: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡', '🔴', '🟢', '🟡'],
    diffIndex: 7,
  },
  {
    id: 'diff-4-shapes',
    level: 2,
    promptKey: 'brainGames.findDifference.prompt',
    leftGrid: ['⭐', '🔶', '⭐', '🔶', '⭐', '🔶', '⭐', '🔶', '⭐'],
    rightGrid: ['⭐', '🔶', '⭐', '🔶', '⭐', '🔶', '⭐', '🔷', '⭐'],
    diffIndex: 7,
  },
  {
    id: 'diff-5-faces',
    level: 3,
    promptKey: 'brainGames.findDifference.prompt',
    leftGrid: ['😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀'],
    rightGrid: ['😀', '😀', '😀', '😀', '😎', '😀', '😀', '😀', '😀'],
    diffIndex: 4,
  },
];
