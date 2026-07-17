import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useAppDispatch, useAppSelector} from '@app/store';
import {
  bootstrapAuthSession,
  mergeGuestProgressToGoogle,
  readLocalLearnerProfile,
} from '@infrastructure/auth';
import {
  ChildProfileSetupScreen,
  SplashScreen,
  WelcomeScreen,
} from '@screens/auth';
import {useTheme} from '@shared/ui';

import {MainNavigator} from './MainNavigator';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

type Gate = 'boot' | 'welcome' | 'profileSetup' | 'main';

function SessionGate() {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const [gate, setGate] = useState<Gate>('boot');
  const [authError, setAuthError] = useState<string | null>(null);
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
      const result = await bootstrapAuthSession(dispatch);
      if (cancelled) {
        return;
      }
      if (!result.ok) {
        setAuthError(result.error.message);
        setGate('welcome');
        return;
      }
      if (result.value.authenticated && !result.value.needsChildSetup) {
        setGate('main');
        return;
      }
      if (result.value.needsChildSetup) {
        setGate('profileSetup');
        return;
      }
      const local = readLocalLearnerProfile();
      if (local.pendingChildSetup) {
        setGate('profileSetup');
        return;
      }
      setGate('welcome');
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

  const showMergePrompt = useCallback(() => {
    Alert.alert(t('welcome.merge.title'), t('welcome.merge.message'), [
      {
        text: t('welcome.merge.cancel'),
        style: 'cancel',
        onPress: () => setGate('profileSetup'),
      },
      {
        text: t('welcome.merge.confirm'),
        onPress: () => {
          void (async () => {
            const result = await mergeGuestProgressToGoogle(dispatch);
            if (!result.ok) {
              Alert.alert(t('welcome.errors.title'), result.error.message);
              setGate('profileSetup');
              return;
            }
            setGate('main');
          })();
        },
      },
    ]);
  }, [dispatch, t]);

  if (gate === 'boot') {
    return <SplashScreen />;
  }

  if (gate === 'profileSetup') {
    return <ChildProfileSetupScreen onComplete={() => setGate('main')} />;
  }

  if (gate === 'main') {
    return <MainNavigator />;
  }

  return (
    <WelcomeScreen
      authError={authError}
      onAuthErrorCleared={() => setAuthError(null)}
      onNeedsChildSetup={() => setGate('profileSetup')}
      onReady={() => setGate('main')}
      onMergePrompt={showMergePrompt}
    />
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <SessionGate />
    </NavigationContainer>
  );
}
