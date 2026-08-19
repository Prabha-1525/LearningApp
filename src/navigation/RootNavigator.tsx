import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import {useAppDispatch, useAppSelector} from '@app/store';
import {
  bootstrapAuthSession,
  readLocalLearnerProfile,
} from '@infrastructure/auth';
import {SplashScreen} from '@screens/auth';
import {useTheme} from '@shared/ui';

import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

type Gate = 'boot' | 'auth' | 'main';

const SPLASH_MIN_MS = 3000;

function SessionGate() {
  const dispatch = useAppDispatch();
  const [gate, setGate] = useState<Gate>('boot');
  const isAuthenticated = useAppSelector(
    state => state.session.isAuthenticated,
  );
  const onboardingComplete = useAppSelector(
    state => state.settings.onboardingComplete,
  );
  const themeMode = useAppSelector(state => state.settings.themeMode);
  const {setMode} = useTheme();

  useEffect(() => {
    setMode(themeMode);
  }, [setMode, themeMode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const startedAt = Date.now();
      const result = await bootstrapAuthSession(dispatch);
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, SPLASH_MIN_MS - elapsed);
      if (remaining > 0) {
        await new Promise<void>(resolve => setTimeout(resolve, remaining));
      }
      if (cancelled) {
        return;
      }
      if (!result.ok) {
        setGate('auth');
        return;
      }
      if (result.value.authenticated && !result.value.needsChildSetup) {
        setGate('main');
        return;
      }
      const local = readLocalLearnerProfile();
      if (local.pendingChildSetup || result.value.needsChildSetup) {
        setGate('auth');
        return;
      }
      setGate('auth');
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && onboardingComplete && gate !== 'boot') {
      setGate('main');
    }
  }, [isAuthenticated, onboardingComplete, gate]);

  if (gate === 'boot') {
    return <SplashScreen />;
  }

  if (gate === 'main') {
    return <MainNavigator />;
  }

  return <AuthNavigator />;
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <SessionGate />
    </NavigationContainer>
  );
}
