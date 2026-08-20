export type CoinDenomination = 1 | 2 | 5 | 10 | 20;
export type NoteDenomination = 10 | 20 | 50 | 100 | 200 | 500;

export type MoneyTabId = 'coins' | 'notes' | 'counting' | 'shopping' | 'quiz';

export type CoinInfo = {
  readonly value: CoinDenomination;
  readonly label: string;
  readonly nameKey: string;
  readonly color: string;
  readonly rimColor: string;
  readonly innerColor?: string;
  readonly diameter: number;
  readonly metalKey: string;
  readonly funFactKey: string;
  readonly isBiMetallic?: boolean;
};

export type NoteInfo = {
  readonly value: NoteDenomination;
  readonly label: string;
  readonly nameKey: string;
  readonly baseColor: string;
  readonly bgGradient: readonly [string, string];
  readonly motifKey: string;
  readonly colorNameKey: string;
};

export type ShoppingItem = {
  readonly id: string;
  readonly nameKey: string;
  readonly defaultName: string;
  readonly emoji: string;
  readonly price: number;
  readonly category: 'fruit' | 'food' | 'stationery' | 'toy';
};

export type ChangePuzzle = {
  readonly id: string;
  readonly item: ShoppingItem;
  readonly paidAmount: number;
  readonly changeAmount: number;
  readonly options: readonly number[];
  readonly explanationKey: string;
};

export type CountingChallenge = {
  readonly id: string;
  readonly targetAmount: number;
  readonly promptKey: string;
  readonly allowedCoins: readonly CoinDenomination[];
  readonly allowedNotes: readonly NoteDenomination[];
  readonly explanationKey: string;
};

export type MoneyQuizOption = {
  readonly id: string;
  readonly text?: string;
  readonly labelKey?: string;
  readonly emoji?: string;
  readonly isCorrect: boolean;
};

export type MoneyQuizQuestion = {
  readonly id: string;
  readonly type:
    | 'identify_coin'
    | 'identify_note'
    | 'count_total'
    | 'equivalence'
    | 'shopping'
    | 'change';
  readonly questionKey: string;
  readonly promptText?: string;
  readonly coins?: readonly CoinDenomination[];
  readonly notes?: readonly NoteDenomination[];
  readonly options: readonly MoneyQuizOption[];
  readonly explanationKey: string;
};

export type MoneyProgress = {
  readonly completedTabs: readonly string[];
  readonly totalStars: number;
  readonly shoppingPurchases: number;
  readonly changePuzzlesSolved: number;
  readonly coinChallengesCompleted: number;
  readonly quizScore: number;
  readonly lastPlayedAt?: string;
};

export const DEFAULT_MONEY_PROGRESS: MoneyProgress = {
  completedTabs: [],
  totalStars: 0,
  shoppingPurchases: 0,
  changePuzzlesSolved: 0,
  coinChallengesCompleted: 0,
  quizScore: 0,
};
