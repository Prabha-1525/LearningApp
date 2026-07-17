import {useCallback, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AppSafeAreaView} from '@components';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
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

import {
  accuracy,
  favoriteLessons,
  getMathProgress,
  getLessonStats,
  globalAccuracy,
} from '@features/math/data/mathProgress';
import {
  MATH_HUB_ACTIVITIES,
  MATH_LESSONS,
} from '@features/math/domain/curriculum/lessons';
import type {MathStackParamList} from '@navigation/mathTypes';

type Props = NativeStackScreenProps<MathStackParamList, 'Hub'>;

/**
 * Math home — all topics always open, stats without locking.
 */
export function MathHubScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace, radius} = useTheme();
  const [progress, setProgress] = useState(getMathProgress);

  useFocusEffect(
    useCallback(() => {
      setProgress(getMathProgress());
    }, []),
  );

  const favorites = useMemo(() => favoriteLessons(progress), [progress]);
  const suggestedLesson = useMemo(() => {
    const leastPracticed = MATH_LESSONS.find(
      lesson => (progress.byLesson[lesson.id]?.attempted ?? 0) === 0,
    );
    return leastPracticed ?? MATH_LESSONS[0]!;
  }, [progress]);

  const scorePercent = globalAccuracy(progress);

  return (
    <AppSafeAreaView testID="math-hub-screen">
      <TopAppBar
        title={t('math.hub.title')}
        subtitle={t('math.hub.subtitle')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.hero,
            {
              borderRadius: radius.lg,
              backgroundColor: '#E8F4FF',
              borderColor: '#4DB7E8',
            },
          ]}>
          <MascotSpot mood="cheer" size={96} label={t('math.hub.coachName')} />
          <AppText variant="headline" tone="ink" style={styles.center}>
            {t('math.hub.heroTitle')}
          </AppText>
          <AppText variant="body" tone="muted" style={styles.center}>
            {t('math.hub.welcomeVoice')}
          </AppText>
        </View>

        <View
          style={[
            styles.progressCard,
            {
              borderRadius: radius.lg,
              backgroundColor: '#FFF6E0',
              borderColor: '#F4B400',
            },
          ]}>
          <AppText variant="title" tone="ink">
            {t('math.hub.statsTitle')}
          </AppText>
          <ProgressBar progress={scorePercent / 100} />
          <AppText variant="caption" tone="muted">
            {t('math.hub.statsSummary', {
              attempted: progress.global.attempted,
              correct: progress.global.correct,
              score: scorePercent,
            })}
          </AppText>
          {favorites.length > 0 ? (
            <AppText variant="caption" tone="muted">
              {t('math.hub.favorites', {
                lessons: favorites
                  .map(id => {
                    const lesson = MATH_LESSONS.find(l => l.id === id);
                    return lesson ? lesson.titleEn : id;
                  })
                  .join(', '),
              })}
            </AppText>
          ) : null}
        </View>

        <PrimaryButton
          label={t('math.hub.suggestedLesson', {
            title: suggestedLesson.titleEn,
          })}
          onPress={() =>
            navigation.navigate('Lesson', {lessonId: suggestedLesson.id})
          }
          testID="math-start-lesson"
        />

        <AppText variant="headline" tone="ink">
          {t('math.hub.activityList')}
        </AppText>

        <View style={styles.activityGrid}>
          {MATH_HUB_ACTIVITIES.map(activity => {
            const stats =
              activity.lessonId != null
                ? getLessonStats(activity.lessonId)
                : null;
            const lessonScore = stats != null ? accuracy(stats) : null;

            return (
              <Pressable
                key={activity.id}
                disabled={activity.comingSoon}
                accessibilityRole="button"
                onPress={() => {
                  if (activity.lessonId) {
                    navigation.navigate('Lesson', {
                      lessonId: activity.lessonId,
                    });
                  }
                }}
                style={[
                  styles.activityCard,
                  {
                    borderRadius: radius.lg,
                    borderColor: activity.accent,
                    opacity: activity.comingSoon ? 0.45 : 1,
                  },
                ]}>
                <AppText style={styles.activityIcon}>{activity.icon}</AppText>
                <AppText variant="caption" tone="ink" style={styles.center}>
                  {activity.titleEn}
                </AppText>
                <Chip
                  label={
                    activity.comingSoon
                      ? t('math.hub.comingSoon')
                      : stats != null && stats.attempted > 0
                      ? t('math.hub.lessonScore', {
                          percent: lessonScore,
                        })
                      : t('math.hub.play')
                  }
                  tone={activity.comingSoon ? 'locked' : 'sun'}
                />
              </Pressable>
            );
          })}
        </View>

        <SecondaryButton
          label={t('math.hub.practiceZone')}
          onPress={() => navigation.navigate('Lesson', {lessonId: 'practice'})}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {paddingBottom: space.xl},
  hero: {
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
  center: {textAlign: 'center'},
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    minHeight: 120,
    padding: space.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activityIcon: {fontSize: 32},
});
