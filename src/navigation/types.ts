/**
 * Typed navigation contracts for React Navigation.
 */
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  ChildProfileSetup: undefined;
  ParentalGate: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  Rewards: undefined;
  Badges: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: {screen?: keyof MainTabParamList} | undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  ProgressOverview: undefined;
  ModuleHost: {moduleId: string};
};

export type RootStackParamList = {
  Boot: undefined;
  Auth: undefined;
  Main: undefined;
};
