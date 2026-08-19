import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {useAppDispatch} from '@app/store';
import {mergeGuestProgressToGoogle} from '@infrastructure/auth';
import {
  ChildProfileSetupScreen,
  SignInScreen,
  WelcomeScreen,
} from '@screens/auth';
import type {AuthStackParamList} from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function WelcomeRoute({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'Welcome'>) {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const [authError, setAuthError] = useState<string | null>(null);

  const showMergePrompt = useCallback(() => {
    Alert.alert(t('welcome.merge.title'), t('welcome.merge.message'), [
      {
        text: t('welcome.merge.cancel'),
        style: 'cancel',
        onPress: () => navigation.navigate('ChildProfileSetup'),
      },
      {
        text: t('welcome.merge.confirm'),
        onPress: () => {
          void (async () => {
            const result = await mergeGuestProgressToGoogle(dispatch);
            if (!result.ok) {
              Alert.alert(t('welcome.errors.title'), result.error.message);
              navigation.navigate('ChildProfileSetup');
            }
          })();
        },
      },
    ]);
  }, [dispatch, navigation, t]);

  return (
    <WelcomeScreen
      authError={authError}
      onAuthErrorCleared={() => setAuthError(null)}
      onNeedsChildSetup={() => navigation.navigate('ChildProfileSetup')}
      onReady={() => {}}
      onMergePrompt={showMergePrompt}
    />
  );
}

function ChildProfileSetupRoute() {
  return <ChildProfileSetupScreen onComplete={() => {}} />;
}

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Welcome" component={WelcomeRoute} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen
        name="ChildProfileSetup"
        component={ChildProfileSetupRoute}
      />
    </Stack.Navigator>
  );
}
