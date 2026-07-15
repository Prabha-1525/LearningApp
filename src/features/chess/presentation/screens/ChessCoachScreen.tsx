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

import {speakCoachLine, stopCoachSpeech} from '../../application/coachSpeech';
import type {ChessStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ChessStackParamList, 'Coach'>;

/**
 * Free-talk coach with Tamil voice playback.
 */
export function ChessCoachScreen({navigation}: Props) {
  const {t, i18n} = useTranslation();
  const {space: themeSpace} = useTheme();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = i18n.language?.startsWith('ta') ? 'ta' : 'en';

  const loadHint = useCallback(async () => {
    setLoading(true);
    stopCoachSpeech();
    const result = await coachPort.requestHint({
      moduleId: 'chess',
      context:
        'Child opened the chess coach. Give a short gentle Tamil-friendly tip for a 6-year-old learning pieces.',
      childAgeYears: 6,
      locale,
    });
    const text = result.ok ? result.value.message : t('chess.coach.fallback');
    setMessage(text);
    setLoading(false);
    await speakCoachLine(locale === 'ta' ? text : t('chess.coach.fallback'));
  }, [locale, t]);

  useEffect(() => {
    void loadHint();
    return () => stopCoachSpeech();
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
          onPress={() => {
            void loadHint();
          }}
          disabled={loading}
        />
        <SecondaryButton
          label={t('chess.hub.startLesson')}
          onPress={() => navigation.navigate('Lesson', {lessonId: 'board'})}
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
