/**
 * Matching Pairs game data.
 * Left side items matched to right side related items.
 */

export type MatchingPair = {
  readonly id: string;
  readonly left: string;
  readonly right: string;
  readonly hintKey?: string;
};

export type MatchingLevel = {
  readonly level: number;
  readonly pairs: readonly MatchingPair[];
};

export const MATCHING_LEVELS: readonly MatchingLevel[] = [
  {
    level: 1,
    pairs: [
      {id: 'dog-bone', left: '🐶', right: '🦴'},
      {id: 'bee-honey', left: '🐝', right: '🍯'},
      {id: 'rain-umbrella', left: '🌧️', right: '☔'},
    ],
  },
  {
    level: 2,
    pairs: [
      {id: 'queen-crown', left: '👸', right: '👑'},
      {id: 'bird-nest', left: '🐦', right: '🪺'},
      {id: 'sun-glasses', left: '☀️', right: '🕶️'},
      {id: 'fish-water', left: '🐟', right: '🌊'},
    ],
  },
  {
    level: 3,
    pairs: [
      {id: 'rabbit-carrot', left: '🐰', right: '🥕'},
      {id: 'monkey-banana', left: '🐒', right: '🍌'},
      {id: 'cat-fish', left: '🐱', right: '🐟'},
      {id: 'cow-milk', left: '🐄', right: '🥛'},
      {id: 'hen-egg', left: '🐔', right: '🥚'},
    ],
  },
];
