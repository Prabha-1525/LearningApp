import {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch} from '@app/store';
import {asParentId} from '@core/domain';
import {setSession} from '@core/store';
import {createFirebaseAuthRepository} from '@infrastructure/firebase';
import {
  AppShell,
  AppText,
  ChildButton,
  ScreenHeader,
  space,
  useTheme,
} from '@shared/ui';

import type {AuthStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {theme, radius} = useTheme();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    const repo = createFirebaseAuthRepository();
    const result = await repo.signInWithEmail(email.trim(), password);
    setLoading(false);

    if (!result.ok) {
      // Dev-friendly local session when Firebase is off.
      if (email.trim().length > 0) {
        dispatch(
          setSession({
            accessToken: 'local-dev-token',
            parent: {
              id: asParentId('local-parent'),
              email: email.trim(),
              displayName: 'Parent',
            },
          }),
        );
        return;
      }
      setError(result.error.message);
      return;
    }

    dispatch(
      setSession({
        accessToken: result.value.accessToken,
        parent: result.value.parent,
      }),
    );
  };

  return (
    <AppShell testID="sign-in-screen">
      <ScreenHeader
        title={t('auth.signIn')}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.form}>
        <AppText variant="caption" tone="muted">
          {t('auth.email')}
        </AppText>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: radius.sm,
              color: theme.colors.ink,
            },
          ]}
        />
        <AppText variant="caption" tone="muted">
          {t('auth.password')}
        </AppText>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: radius.sm,
              color: theme.colors.ink,
            },
          ]}
        />
        {error ? (
          <AppText variant="caption" tone="danger">
            {error}
          </AppText>
        ) : null}
        <ChildButton
          label={t('auth.continue')}
          onPress={() => {
            void onSubmit();
          }}
          loading={loading}
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: space.sm,
    marginTop: space.md,
  },
  input: {
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: space.md,
  },
});
