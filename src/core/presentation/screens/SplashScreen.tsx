import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  AppShell,
  AppText,
  BrandMark,
  Loading,
  MascotSpot,
  space,
} from '@shared/ui';

/**
 * Brand-first splash — shown while persist rehydrates / app boots.
 */
export function SplashScreen() {
  const {t} = useTranslation();

  return (
    <AppShell testID="splash-screen" padded>
      <View style={styles.content}>
        <BrandMark size="lg" />
        <MascotSpot mood="happy" size={140} />
        <AppText variant="body" tone="muted" style={styles.center}>
          {t('splash.loading')}
        </AppText>
        <Loading />
      </View>
    </AppShell>
  );
}

/** @deprecated Use SplashScreen */
export const BootScreen = SplashScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: space.lg,
    paddingBottom: space.xxxl,
  },
  center: {
    textAlign: 'center',
  },
});
