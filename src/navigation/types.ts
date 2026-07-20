/**
 * Typed navigation contracts for React Navigation.
 */
export type AuthStackParamList = {
  SignIn: undefined;
  ParentalGate: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  Badges: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  ProgressOverview: undefined;
  ModuleHost: {moduleId: string};
};

export type RootStackParamList = {
  Boot: undefined;
  Welcome: undefined;
  Auth: undefined;
  Main: undefined;
};
