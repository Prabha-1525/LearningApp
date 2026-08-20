/**
 * Number Sequence game data.
 * Both numeric and visual sequences with missing next item.
 */

export type SequenceQuestion = {
  readonly id: string;
  readonly type: 'number' | 'visual';
  readonly sequence: readonly string[];
  readonly options: readonly string[];
  readonly answer: string;
  readonly hintKey: string;
};

export type SequenceLevel = {
  readonly level: number;
  readonly questions: readonly SequenceQuestion[];
};

export const SEQUENCE_LEVELS: readonly SequenceLevel[] = [
  {
    level: 1,
    questions: [
      {
        id: 's1-num-1',
        type: 'number',
        sequence: ['1️⃣', '2️⃣', '3️⃣', '❓'],
        options: ['4️⃣', '6️⃣', '8️⃣'],
        answer: '4️⃣',
        hintKey: 'brainGames.sequence.hint',
      },
      {
        id: 's1-num-2',
        type: 'number',
        sequence: ['2️⃣', '4️⃣', '6️⃣', '❓'],
        options: ['8️⃣', '7️⃣', '5️⃣'],
        answer: '8️⃣',
        hintKey: 'brainGames.sequence.hint',
      },
      {
        id: 's1-growth-1',
        type: 'visual',
        sequence: ['🌱', '🌿', '🌳', '❓'],
        options: ['🪵', '🌱', '🍂'],
        answer: '🪵',
        hintKey: 'brainGames.sequence.growthHint',
      },
    ],
  },
  {
    level: 2,
    questions: [
      {
        id: 's2-num-1',
        type: 'number',
        sequence: ['5️⃣', '1️⃣0️⃣', '1️⃣5️⃣', '❓'],
        options: ['2️⃣0️⃣', '1️⃣8️⃣', '2️⃣5️⃣'],
        answer: '2️⃣0️⃣',
        hintKey: 'brainGames.sequence.hint',
      },
      {
        id: 's2-size-1',
        type: 'visual',
        sequence: ['🔵', '⚪', '🔹', '❓'],
        options: ['·', '🔵', '🔷'],
        answer: '·',
        hintKey: 'brainGames.sequence.sizeHint',
      },
      {
        id: 's2-day-1',
        type: 'visual',
        sequence: ['🐣', '🐤', '🐔', '❓'],
        options: ['🥚', '🍗', '🐦'],
        answer: '🥚',
        hintKey: 'brainGames.sequence.cycleHint',
      },
    ],
  },
  {
    level: 3,
    questions: [
      {
        id: 's3-num-1',
        type: 'number',
        sequence: ['1️⃣', '1️⃣', '2️⃣', '3️⃣', '5️⃣', '❓'],
        options: ['8️⃣', '6️⃣', '7️⃣'],
        answer: '8️⃣',
        hintKey: 'brainGames.sequence.fibHint',
      },
      {
        id: 's3-season-1',
        type: 'visual',
        sequence: ['🌸', '☀️', '🍂', '❄️', '❓'],
        options: ['🌸', '🌧️', '🍁'],
        answer: '🌸',
        hintKey: 'brainGames.sequence.seasonHint',
      },
    ],
  },
];
