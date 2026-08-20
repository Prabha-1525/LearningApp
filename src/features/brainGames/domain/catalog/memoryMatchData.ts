/**
 * Memory Match game data.
 * Cards are emoji pairs — the engine will shuffle and flip them.
 */

export type MemoryMatchLevel = {
  readonly level: number;
  readonly gridSize: number; // total number of cards (must be even)
  readonly pairs: readonly string[]; // emoji symbols, count = gridSize / 2
};

export const MEMORY_MATCH_LEVELS: readonly MemoryMatchLevel[] = [
  {
    level: 1,
    gridSize: 4,
    pairs: ['🍎', '🍌'],
  },
  {
    level: 2,
    gridSize: 6,
    pairs: ['🐶', '🐱', '🐭'],
  },
  {
    level: 3,
    gridSize: 8,
    pairs: ['🌟', '🌈', '🎈', '🎀'],
  },
  {
    level: 4,
    gridSize: 12,
    pairs: ['🦁', '🐸', '🐧', '🦊', '🦋', '🐬'],
  },
];
