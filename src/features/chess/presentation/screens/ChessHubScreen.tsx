import {useMemo, useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  AppShell,
  AppText,
  Chip,
  MascotSpot,
  PrimaryButton,
  ProgressCard,
  SecondaryButton,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {CHESS_LESSONS} from '../../domain/curriculum/lessons';
import {
  getChessLessonProgress,
  isLessonUnlocked,
} from '../../data/lessonProgress';
import {MiniChessBoard} from '../components/MiniChessBoard';
import type {ChessStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ChessStackParamList, 'Hub'>;

/**
 * Chess module home — sequential Tamil-guided lessons.
 */
export function ChessHubScreen({navigation}: Props) {
  const {t, i18n} = useTranslation();
  const {space: themeSpace, theme, radius} = useTheme();
  const preferTamil = !i18n.language || i18n.language.startsWith('ta');
  const [progress, setProgress] = useState(getChessLessonProgress);

  useFocusEffect(
    useCallback(() => {
      setProgress(getChessLessonProgress());
    }, []),
  );

  const nextLesson = useMemo(() => {
    return (
      CHESS_LESSONS.find(lesson => !progress.completed.includes(lesson.id)) ??
      CHESS_LESSONS[0]!
    );
  }, [progress.completed]);

  return (
    <AppShell testID="chess-hub-screen">
      <TopAppBar
        title={t('chess.hub.title')}
        subtitle={t('chess.hub.subtitle')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <MascotSpot mood="happy" size={88} label={t('chess.hub.coachName')} />
          <AppText variant="body" tone="muted" style={styles.center}>
            {t('chess.hub.welcomeVoice')}
          </AppText>
        </View>

        <MiniChessBoard size={220} testID="chess-hub-board" />

        <ProgressCard
          title={t('chess.hub.progressTitle')}
          stars={progress.stars}
          detail={t('chess.hub.progressCount', {
            done: progress.completed.length,
            total: CHESS_LESSONS.length,
          })}
        />

        <PrimaryButton
          label={t('chess.hub.continueLesson', {
            title: preferTamil ? nextLesson.titleTa : nextLesson.titleEn,
          })}
          onPress={() =>
            navigation.navigate('Lesson', {lessonId: nextLesson.id})
          }
          testID="chess-start-lesson"
        />

        <AppText variant="headline" tone="ink">
          {t('chess.hub.lessonList')}
        </AppText>

        {CHESS_LESSONS.map(lesson => {
          const unlocked = isLessonUnlocked(lesson.id, progress);
          const done = progress.completed.includes(lesson.id);
          return (
            <Pressable
              key={lesson.id}
              disabled={!unlocked}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('Lesson', {lessonId: lesson.id})
              }
              style={[
                styles.lessonRow,
                {
                  borderRadius: radius.md,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: unlocked ? 1 : 0.5,
                },
              ]}>
              <View style={styles.lessonText}>
                <AppText variant="title" tone="ink">
                  {lesson.order}.{' '}
                  {preferTamil ? lesson.titleTa : lesson.titleEn}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {preferTamil ? lesson.subtitleTa : lesson.subtitleEn}
                </AppText>
              </View>
              <Chip
                label={
                  done
                    ? t('chess.hub.done')
                    : unlocked
                    ? t('chess.hub.play')
                    : t('chess.hub.locked')
                }
                tone={done ? 'success' : unlocked ? 'accent' : 'locked'}
              />
            </Pressable>
          );
        })}

        <SecondaryButton
          label={t('chess.hub.meetCoach')}
          onPress={() => navigation.navigate('Coach')}
          testID="chess-coach"
        />
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
  },
  hero: {
    alignItems: 'center',
    gap: space.sm,
  },
  center: {
    textAlign: 'center',
  },
  lessonRow: {
    borderWidth: 1,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  lessonText: {
    flex: 1,
    gap: 2,
  },
});
