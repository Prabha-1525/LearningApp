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
    GEMINI_API_KEY: '',
    GEMINI_MODEL: 'gemini-2.0-flash',
    TTS_PROXY_URL: '',
    PREFERRED_AI_PROVIDER: 'gemini',
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
  useSharedValue: v => ({value: v}),
  useAnimatedStyle: fn => fn(),
  withTiming: v => v,
  withSpring: v => v,
}));

jest.mock('react-native-reanimated', () => {
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: Component => Component,
      call: () => undefined,
    },
    View,
    createAnimatedComponent: Component => Component,
    useSharedValue: value => ({value}),
    useAnimatedStyle: fn => fn(),
    withTiming: value => value,
    withSpring: value => value,
    Easing: {
      out: fn => fn,
      cubic: jest.fn(),
    },
    runOnJS: fn => fn,
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: View => View,
  ScreenContainer: View => View,
}));

jest.mock('react-native-tts', () => {
  const finishHandlers: Array<() => void> = [];
  const api = {
    getInitStatus: jest.fn(() => Promise.resolve(true)),
    setDefaultLanguage: jest.fn(() => Promise.resolve(true)),
    setDefaultRate: jest.fn(),
    stop: jest.fn(),
    speak: jest.fn(() => {
      setTimeout(() => {
        finishHandlers.forEach(handler => handler());
      }, 5);
    }),
    addEventListener: jest.fn((type: string, handler: () => void) => {
      if (type === 'tts-finish') {
        finishHandlers.push(handler);
      }
      return {remove: jest.fn()};
    }),
  };
  return {default: api, ...api};
});

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

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      canGoBack: () => true,
      getParent: () => ({navigate: jest.fn()}),
    }),
    useRoute: () => ({params: {}}),
    useFocusEffect: jest.fn(),
  };
});
