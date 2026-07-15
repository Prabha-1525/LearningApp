import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {coachPort} from '@infrastructure/ai';
import {
  AppShell,
  AppText,
  Loading,
  MascotSpot,
  PrimaryButton,
  SecondaryButton,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import type {ChessStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ChessStackParamList, 'Coach'>;

/**
 * AI / offline coach greeting for the Chess module.
 */
export function ChessCoachScreen({navigation}: Props) {
  const {t, i18n} = useTranslation();
  const {space: themeSpace} = useTheme();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const locale = i18n.language?.startsWith('ta') ? 'ta' : 'en';

  const loadHint = useCallback(async () => {
    setLoading(true);
    const result = await coachPort.requestHint({
      moduleId: 'chess',
      context: 'Child opened the chess coach for a friendly tip.',
      childAgeYears: 6,
      locale,
    });
    if (result.ok) {
      setMessage(result.value.message);
    } else {
      setMessage(t('chess.coach.fallback'));
    }
    setLoading(false);
  }, [locale, t]);

  useEffect(() => {
    void loadHint();
  }, [loadHint]);

  return (
    <AppShell testID="chess-coach-screen">
      <TopAppBar
        title={t('chess.coach.title')}
        onBack={() => navigation.goBack()}
      />
      <View style={[styles.body, {gap: themeSpace.md}]}>
        <MascotSpot mood="calm" size={96} label={t('chess.hub.coachName')} />
        {loading ? (
          <Loading label={t('common.loading')} />
        ) : (
          <AppText variant="body" tone="ink" style={styles.center}>
            {message}
          </AppText>
        )}
        <PrimaryButton
          label={t('chess.coach.again')}
          onPress={() => void loadHint()}
          disabled={loading}
        />
        <SecondaryButton
          label={t('chess.hub.startLesson')}
          onPress={() =>
            navigation.navigate('Lesson', {lessonId: 'chess.board'})
          }
        />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    paddingTop: space.md,
    paddingBottom: space.xl,
  },
  center: {
    textAlign: 'center',
  },
});
