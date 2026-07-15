export type LocaleCode = 'en' | 'ta';

export type TranslationKey = string;

export type I18nPort = {
  t(
    key: TranslationKey,
    params?: Readonly<Record<string, string | number>>,
  ): string;
  locale: LocaleCode;
  setLocale(locale: LocaleCode): void;
};
