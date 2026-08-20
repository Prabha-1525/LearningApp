/**
 * Odd One Out game data.
 * Show 4 items — one is different, child must pick it.
 */

export type OddOneOutQuestion = {
  readonly id: string;
  readonly items: readonly string[]; // length 4, one is different
  readonly oddIndex: number; // index of the odd item
  readonly questionKey: string;
  readonly explanationKey: string;
};

export type OddOneOutLevel = {
  readonly level: number;
  readonly questions: readonly OddOneOutQuestion[];
};

export const ODD_ONE_OUT_LEVELS: readonly OddOneOutLevel[] = [
  {
    level: 1,
    questions: [
      {
        id: 'o1-fruit-1',
        items: ['🍎', '🍌', '🍎', '🍎'],
        oddIndex: 1,
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
      {
        id: 'o1-animal-1',
        items: ['🐶', '🐶', '🐱', '🐶'],
        oddIndex: 2,
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
      {
        id: 'o1-color-1',
        items: ['🔴', '🔴', '🔴', '🔵'],
        oddIndex: 3,
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
    ],
  },
  {
    level: 2,
    questions: [
      {
        id: 'o2-transport-1',
        items: ['🚗', '🚌', '✈️', '🚗'],
        oddIndex: 2,
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
      {
        id: 'o2-food-1',
        items: ['🍕', '🍔', '🌮', '🍰'],
        oddIndex: 3,
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
      {
        id: 'o2-water-1',
        items: ['🐟', '🐬', '🦁', '🐙'],
        oddIndex: 2, // lion doesn't live in water
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
    ],
  },
  {
    level: 3,
    questions: [
      {
        id: 'o3-number-1',
        items: ['2️⃣', '4️⃣', '6️⃣', '7️⃣'],
        oddIndex: 3, // 7 is odd, others are even
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
      {
        id: 'o3-sky-1',
        items: ['🐦', '🦋', '🦅', '🐢'],
        oddIndex: 3, // turtle can't fly
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
      {
        id: 'o3-cold-1',
        items: ['🧊', '❄️', '☃️', '🔥'],
        oddIndex: 3, // fire is hot, others are cold
        questionKey: 'brainGames.oddOneOut.question',
        explanationKey: 'brainGames.oddOneOut.explanation',
      },
    ],
  },
];
