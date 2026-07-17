import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import {appConfig} from '@app/config';
import {useAppDispatch, useAppSelector} from '@app/store';
import {setAuthRequired, setOnboardingComplete} from '@core/store';
import {SplashScreen, WelcomeScreen} from '@screens/auth';
import {useTheme} from '@shared/ui';

import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';

const SPLASH_MIN_MS = 1200;

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

/**
 * Root composition: Splash → Welcome (first run) → Main / Auth.
 * Feature navigators nest under Main / ModuleHost.
 */
function SessionGate() {
  const dispatch = useAppDispatch();
  const [splashDone, setSplashDone] = useState(false);
  const onboardingComplete = useAppSelector(
    state => state.settings.onboardingComplete,
  );
  const isAuthenticated = useAppSelector(
    state => state.session.isAuthenticated,
  );
  const authRequired = useAppSelector(state => state.settings.authRequired);
  const themeMode = useAppSelector(state => state.settings.themeMode);
  const {setMode} = useTheme();

  useEffect(() => {
    dispatch(setAuthRequired(appConfig.authRequired));
  }, [dispatch]);

  useEffect(() => {
    setMode(themeMode);
  }, [setMode, themeMode]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) {
    return <SplashScreen />;
  }

  if (!onboardingComplete) {
    return (
      <WelcomeScreen
        onParentPress={() => {
          dispatch(setOnboardingComplete(true));
        }}
      />
    );
  }

  if (authRequired && !isAuthenticated) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <SessionGate />
    </NavigationContainer>
  );
}
