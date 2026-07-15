import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useAppDispatch} from '@app/store';
import {setOnboardingComplete} from '@core/store';
import {
  AppShell,
  AppText,
  BrandMark,
  MascotSpot,
  PrimaryButton,
  SecondaryButton,
  space,
} from '@shared/ui';

type WelcomeScreenProps = {
  readonly onParentPress?: () => void;
};

export function WelcomeScreen({onParentPress}: WelcomeScreenProps) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <AppShell testID="welcome-screen">
      <View style={styles.content}>
        <BrandMark size="lg" />
        <MascotSpot mood="happy" size={132} label={t('welcome.title')} />
        <AppText variant="body" tone="muted" style={styles.center}>
          {t('welcome.subtitle')}
        </AppText>
        <View style={styles.actions}>
          <PrimaryButton
            label={t('welcome.cta')}
            onPress={() => dispatch(setOnboardingComplete(true))}
            testID="welcome-cta"
          />
          {onParentPress ? (
            <SecondaryButton
              label={t('welcome.parent')}
              onPress={onParentPress}
            />
          ) : null}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: space.lg,
    paddingBottom: space.xxxl,
  },
  center: {
    textAlign: 'center',
  },
  actions: {
    gap: space.sm,
    marginTop: space.md,
  },
});
