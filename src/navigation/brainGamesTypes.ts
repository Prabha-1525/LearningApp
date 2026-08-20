export type BrainGamesStackParamList = {
  Home: undefined;
  MemoryMatch: {level?: number};
  MatchingPairs: {level?: number};
  PatternCompleter: {level?: number};
  OddOneOut: {level?: number};
  NumberSequence: {level?: number};
  SortIt: {level?: number};
  FindDifference: {level?: number};
  GameComplete: {
    gameId: string;
    stars: number;
    nextGame?: keyof BrainGamesStackParamList;
  };
};
