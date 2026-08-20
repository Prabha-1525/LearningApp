export type WorldExplorerStackParamList = {
  Home: undefined;
  CountryList: {continent?: string};
  CountryDetails: {countryCode: string};
  FlagLearning: {countryCode?: string};
  Continents: undefined;
  Capitals: undefined;
  Landmarks: undefined;
  Quiz: {difficulty?: 'beginner' | 'intermediate' | 'advanced'};
};
