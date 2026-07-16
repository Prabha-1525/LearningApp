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
  ProgressBar,
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
 * Cheerful Chess home for ages 5–8 — lessons + Play with Coach.
 */
export function ChessHubScreen({navigation}: Props) {
  const {t, i18n} = useTranslation();
  const {space: themeSpace, radius} = useTheme();
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

  const progressRatio = progress.completed.length / CHESS_LESSONS.length;

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
        <View
          style={[
            styles.heroCard,
            {
              borderRadius: radius.lg,
              backgroundColor: '#FFF6E0',
              borderColor: '#F4B400',
            },
          ]}>
          <MascotSpot mood="cheer" size={96} label={t('chess.hub.coachName')} />
          <AppText variant="headline" tone="ink" style={styles.center}>
            {t('chess.hub.heroTitle')}
          </AppText>
          <AppText variant="body" tone="muted" style={styles.center}>
            {t('chess.hub.welcomeVoice')}
          </AppText>
          <MiniChessBoard size={200} testID="chess-hub-board" />
        </View>

        <View
          style={[
            styles.progressCard,
            {
              borderRadius: radius.lg,
              backgroundColor: '#E8FBF3',
              borderColor: '#3D9A5F',
            },
          ]}>
          <AppText variant="title" tone="ink">
            {t('chess.hub.progressTitle')}
          </AppText>
          <ProgressBar progress={progressRatio} />
          <AppText variant="caption" tone="muted">
            {t('chess.hub.progressCount', {
              done: progress.completed.length,
              total: CHESS_LESSONS.length,
            })}
          </AppText>
          <View style={styles.starRow}>
            {Array.from({length: Math.max(1, progress.stars)}).map((_, i) => (
              <AppText key={`s${i}`} variant="title">
                ★
              </AppText>
            ))}
            {progress.stars === 0 ? (
              <AppText variant="caption" tone="muted">
                {t('chess.hub.earnStars')}
              </AppText>
            ) : null}
          </View>
        </View>

        <PrimaryButton
          label={t('chess.hub.playWithCoach')}
          onPress={() => navigation.navigate('PlayWithCoach')}
          testID="chess-play-coach"
        />

        <SecondaryButton
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
          const accent =
            lesson.id === 'pawn'
              ? '#FF9F1C'
              : lesson.id === 'knight'
              ? '#8B5CF6'
              : lesson.id === 'bishop'
              ? '#4DB7E8'
              : lesson.id === 'queen'
              ? '#E4578C'
              : lesson.id === 'king'
              ? '#F4B400'
              : lesson.id === 'rook'
              ? '#0F8B8D'
              : '#3D9A5F';
          return (
            <Pressable
              key={lesson.id}
              disabled={!unlocked}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('Lesson', {lessonId: lesson.id})
              }
              style={[
                styles.lessonCard,
                {
                  borderRadius: radius.lg,
                  backgroundColor: '#FFFFFF',
                  borderColor: accent,
                  opacity: unlocked ? 1 : 0.45,
                },
              ]}>
              <View
                style={[
                  styles.lessonBadge,
                  {backgroundColor: `${accent}33`, borderRadius: radius.md},
                ]}>
                <AppText variant="headline" tone="ink">
                  {lesson.order}
                </AppText>
              </View>
              <View style={styles.lessonText}>
                <AppText variant="title" tone="ink">
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
                tone={done ? 'success' : unlocked ? 'sun' : 'locked'}
                accentColor={accent}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xl,
  },
  heroCard: {
    alignItems: 'center',
    gap: space.sm,
    padding: space.lg,
    borderWidth: 2,
  },
  progressCard: {
    gap: space.sm,
    padding: space.md,
    borderWidth: 2,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  center: {
    textAlign: 'center',
  },
  lessonCard: {
    borderWidth: 2,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  lessonBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonText: {
    flex: 1,
    gap: 2,
  },
});
