/**
 * Pattern Completer game data.
 * Show a sequence with '?' and child picks the correct next item.
 */

export type PatternQuestion = {
  readonly id: string;
  readonly sequence: readonly string[]; // includes '?' for blank
  readonly options: readonly string[];
  readonly answer: string;
  readonly hintKey: string;
};

export type PatternLevel = {
  readonly level: number;
  readonly questions: readonly PatternQuestion[];
};

export const PATTERN_LEVELS: readonly PatternLevel[] = [
  {
    level: 1,
    questions: [
      {
        id: 'p1-color-1',
        sequence: ['🔴', '🔵', '🔴', '🔵', '❓'],
        options: ['🔴', '🟢', '🟡'],
        answer: '🔴',
        hintKey: 'brainGames.patterns.colorHint',
      },
      {
        id: 'p1-color-2',
        sequence: ['🟡', '🟡', '🔵', '🟡', '🟡', '❓'],
        options: ['🟡', '🔴', '🔵'],
        answer: '🔵',
        hintKey: 'brainGames.patterns.colorHint',
      },
      {
        id: 'p1-animal-1',
        sequence: ['🐶', '🐱', '🐶', '🐱', '❓'],
        options: ['🐶', '🐭', '🐸'],
        answer: '🐶',
        hintKey: 'brainGames.patterns.animalHint',
      },
    ],
  },
  {
    level: 2,
    questions: [
      {
        id: 'p2-shape-1',
        sequence: ['⭐', '🔴', '⭐', '🔴', '⭐', '❓'],
        options: ['⭐', '🔴', '🔵'],
        answer: '🔴',
        hintKey: 'brainGames.patterns.shapeHint',
      },
      {
        id: 'p2-num-1',
        sequence: ['1️⃣', '2️⃣', '1️⃣', '2️⃣', '3️⃣', '❓'],
        options: ['3️⃣', '4️⃣', '1️⃣'],
        answer: '1️⃣',
        hintKey: 'brainGames.patterns.numberHint',
      },
      {
        id: 'p2-fruit-1',
        sequence: ['🍎', '🍌', '🍊', '🍎', '🍌', '❓'],
        options: ['🍊', '🍇', '🍓'],
        answer: '🍊',
        hintKey: 'brainGames.patterns.fruitHint',
      },
    ],
  },
  {
    level: 3,
    questions: [
      {
        id: 'p3-complex-1',
        sequence: ['🔴', '🔴', '🔵', '🔴', '🔴', '❓'],
        options: ['🔵', '🔴', '🟡'],
        answer: '🔵',
        hintKey: 'brainGames.patterns.colorHint',
      },
      {
        id: 'p3-animals-1',
        sequence: ['🐶', '🐶', '🐱', '🐶', '🐶', '❓'],
        options: ['🐱', '🐶', '🐭'],
        answer: '🐱',
        hintKey: 'brainGames.patterns.animalHint',
      },
      {
        id: 'p3-weather-1',
        sequence: ['☀️', '🌧️', '☀️', '🌧️', '☀️', '❓'],
        options: ['🌧️', '☀️', '⛅'],
        answer: '🌧️',
        hintKey: 'brainGames.patterns.weatherHint',
      },
    ],
  },
];
