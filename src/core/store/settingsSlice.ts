import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

import type {LocaleCode} from '@shared/i18n';
import type {ThemeMode} from '@shared/ui';

export type SettingsState = {
  readonly themeMode: ThemeMode;
  readonly soundEnabled: boolean;
  readonly locale: LocaleCode;
  readonly onboardingComplete: boolean;
  /** Kid-first MVP: auth can stay optional until Parent Dashboard. */
  readonly authRequired: boolean;
};

const initialState: SettingsState = {
  themeMode: 'light',
  soundEnabled: true,
  locale: 'en',
  onboardingComplete: false,
  authRequired: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setSoundEnabled(state, action: PayloadAction<boolean>) {
      state.soundEnabled = action.payload;
    },
    setLocale(state, action: PayloadAction<LocaleCode>) {
      state.locale = action.payload;
    },
    setOnboardingComplete(state, action: PayloadAction<boolean>) {
      state.onboardingComplete = action.payload;
    },
    setAuthRequired(state, action: PayloadAction<boolean>) {
      state.authRequired = action.payload;
    },
  },
});

export const {
  setThemeMode,
  setSoundEnabled,
  setLocale,
  setOnboardingComplete,
  setAuthRequired,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
