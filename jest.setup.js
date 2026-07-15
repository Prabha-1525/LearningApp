/* eslint-env jest */

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-config', () => ({
  default: {
    APP_ENV: 'development',
    API_BASE_URL: 'https://api.example.com',
    FIREBASE_ENABLED: 'false',
    AUTH_REQUIRED: 'false',
    OPENAI_PROXY_URL: '',
    GEMINI_PROXY_URL: '',
    TTS_PROXY_URL: '',
    PREFERRED_AI_PROVIDER: 'openai',
  },
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{languageCode: 'en', countryCode: 'US'}],
}));

jest.mock('react-native-mmkv', () => {
  const memory = new Map();
  return {
    createMMKV: () => ({
      getString: key => memory.get(`s:${key}`),
      getBoolean: key => memory.get(`b:${key}`),
      getNumber: key => memory.get(`n:${key}`),
      set: (key, value) => {
        if (typeof value === 'boolean') {
          memory.set(`b:${key}`, value);
        } else if (typeof value === 'number') {
          memory.set(`n:${key}`, value);
        } else {
          memory.set(`s:${key}`, value);
        }
      },
      remove: key => {
        memory.delete(`s:${key}`);
        memory.delete(`b:${key}`);
        memory.delete(`n:${key}`);
        return true;
      },
      clearAll: () => memory.clear(),
    }),
  };
});

jest.mock('react-native-worklets', () => ({
  __esModule: true,
  default: {},
  useSharedValue: (v: unknown) => ({value: v}),
  useAnimatedStyle: (fn: () => unknown) => fn(),
  withTiming: (v: unknown) => v,
  withSpring: (v: unknown) => v,
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (Component: unknown) => Component,
      call: () => undefined,
    },
    View,
    createAnimatedComponent: (Component: unknown) => Component,
    useSharedValue: (value: unknown) => ({value}),
    useAnimatedStyle: (fn: () => unknown) => fn(),
    withTiming: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    Easing: {
      out: (fn: unknown) => fn,
      cubic: jest.fn(),
    },
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: View => View,
  ScreenContainer: View => View,
}));

jest.mock('@react-native-firebase/app', () => ({}), {virtual: true});
jest.mock('@react-native-firebase/auth', () => ({default: () => ({})}), {
  virtual: true,
});
jest.mock('@react-native-firebase/firestore', () => ({default: () => ({})}), {
  virtual: true,
});
jest.mock('@react-native-firebase/analytics', () => ({default: () => ({})}), {
  virtual: true,
});
