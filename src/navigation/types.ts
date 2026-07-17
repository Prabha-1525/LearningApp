/**
 * Typed navigation contracts for React Navigation.
 */
export type AuthStackParamList = {
  SignIn: undefined;
  ParentalGate: undefined;
};

export type MainStackParamList = {
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
