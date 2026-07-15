import {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  AppShell,
  AppText,
  Chip,
  PrimaryButton,
  SecondaryButton,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {MiniChessBoard} from '../components/MiniChessBoard';
import type {ChessStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ChessStackParamList, 'Lesson'>;

const STEPS = ['board', 'king', 'pawn'] as const;

/**
 * Guided first chess lesson — short steps for ages 5–8.
 */
export function ChessLessonScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace} = useTheme();
  const startIndex = useMemo(() => {
    const id = route.params.lessonId;
    if (id === 'chess.king') {
      return 1;
    }
    if (id === 'chess.pawn') {
      return 2;
    }
    return 0;
  }, [route.params.lessonId]);
  const [step, setStep] = useState(startIndex);
  const key = STEPS[step] ?? 'board';
  const isLast = step >= STEPS.length - 1;

  return (
    <AppShell testID="chess-lesson-screen">
      <TopAppBar
        title={t(`chess.lesson.${key}.title`)}
        subtitle={t('chess.lesson.step', {
          current: step + 1,
          total: STEPS.length,
        })}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        <Chip label={t('chess.lesson.chip')} />
        <MiniChessBoard size={240} compact={key !== 'board'} />
        <AppText variant="headline" tone="ink" style={styles.center}>
          {t(`chess.lesson.${key}.headline`)}
        </AppText>
        <AppText variant="body" tone="muted" style={styles.center}>
          {t(`chess.lesson.${key}.body`)}
        </AppText>
        <View style={{gap: themeSpace.sm}}>
          {isLast ? (
            <PrimaryButton
              label={t('chess.lesson.finish')}
              onPress={() => navigation.navigate('Hub')}
              testID="chess-lesson-finish"
            />
          ) : (
            <PrimaryButton
              label={t('common.next')}
              onPress={() => setStep(value => value + 1)}
              testID="chess-lesson-next"
            />
          )}
          <SecondaryButton
            label={t('chess.lesson.practiceNow')}
            onPress={() => navigation.navigate('Practice')}
          />
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
    alignItems: 'stretch',
  },
  center: {
    textAlign: 'center',
  },
});
