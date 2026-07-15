import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import type {LocaleCode} from './types';
import en from './locales/en.json';
import ta from './locales/ta.json';

/**
 * Decision: i18next + react-i18next is the RN ecosystem standard.
 * react-native-localize picks device language on first launch; Redux settings
 * can override afterwards (persisted).
 */
const resources = {
  en: {translation: en},
  ta: {translation: ta},
} as const;

function detectDeviceLocale(): LocaleCode {
  const locales = RNLocalize.getLocales();
  const languageTag = locales[0]?.languageCode;
  if (languageTag === 'ta') {
    return 'ta';
  }
  return 'en';
}

let initialized = false;

export function initI18n(locale?: LocaleCode): typeof i18n {
  if (initialized) {
    if (locale) {
      void i18n.changeLanguage(locale);
    }
    return i18n;
  }

  void i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: locale ?? detectDeviceLocale(),
    fallbackLng: 'en',
    interpolation: {escapeValue: false},
  });

  initialized = true;
  return i18n;
}

export async function changeAppLanguage(locale: LocaleCode): Promise<void> {
  await i18n.changeLanguage(locale);
}

export {i18n};
