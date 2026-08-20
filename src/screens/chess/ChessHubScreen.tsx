import {useMemo, useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
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

import {CHESS_LESSONS} from '@features/chess/domain/curriculum/lessons';
import {
  getChessLessonProgress,
  isLessonUnlocked,
} from '@features/chess/data/lessonProgress';
import {MiniChessBoard} from '@features/chess/presentation/components/MiniChessBoard';
import type {ChessStackParamList} from '@navigation/chessTypes';

type Props = NativeStackScreenProps<ChessStackParamList, 'Hub'>;

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
    <AppSafeAreaView testID="chess-hub-screen">
      <TopAppBar
        title={t('chess.hub.title', {defaultValue: 'Chess Learning'})}
        subtitle={t('chess.hub.subtitle', {
          defaultValue: 'Learn piece by piece!',
        })}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            const parent = navigation.getParent();
            if (parent) {
              (parent as any).navigate('Tabs', {screen: 'HomeTab'});
            }
          }
        }}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View
          style={[
            styles.heroCard,
            {
              borderRadius: radius.lg,
              backgroundColor: '#FFF6E0',
              borderColor: '#F4B400',
            },
          ]}>
          <MascotSpot mood="cheer" size={96} label="Leo" />
          <AppText variant="headline" tone="ink" style={styles.center}>
            {preferTamil ? 'சதுரங்கப் பயிற்சி!' : 'Chess Training!'}
          </AppText>
          <AppText variant="body" tone="muted" style={styles.center}>
            {preferTamil
              ? 'ஒவ்வொரு காயாக கற்றுக்கொண்டு சதுரங்க நாயகனாக மாறுங்கள்!'
              : 'Learn piece by piece and become a Chess Champion!'}
          </AppText>
          <MiniChessBoard size={190} testID="chess-hub-board" />
        </View>

        {/* Progress Card */}
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
            {preferTamil ? 'உன் முன்னேற்றம்' : 'Your Progress'}
          </AppText>
          <ProgressBar progress={progressRatio} />
          <AppText variant="caption" tone="muted">
            {progress.completed.length} / {CHESS_LESSONS.length}{' '}
            {preferTamil ? 'பாடங்கள் முடிந்தது' : 'Lessons Completed'}
          </AppText>
          <View style={styles.starRow}>
            <Text style={styles.totalStarIcon}>★</Text>
            <Text style={styles.totalStarText}>{progress.stars} Stars</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <PrimaryButton
          label={
            preferTamil
              ? `கற்றலைத் தொடர்: ${nextLesson.titleTa}`
              : `Continue: ${nextLesson.titleEn}`
          }
          onPress={() =>
            navigation.navigate('Lesson', {lessonId: nextLesson.id})
          }
          testID="chess-start-lesson"
        />

        <SecondaryButton
          label={preferTamil ? 'ஆசிரியருடன் விளையாடு' : 'Play With Coach'}
          onPress={() => navigation.navigate('PlayWithCoach')}
          testID="chess-play-coach"
        />

        <AppText variant="headline" tone="ink" style={styles.sectionHeading}>
          {preferTamil
            ? 'சதுரங்க பாடத்திட்டம் (12 Lessons)'
            : 'Chess Curriculum (12 Lessons)'}
        </AppText>

        {/* 12 Lessons Map */}
        {CHESS_LESSONS.map(lesson => {
          const unlocked = isLessonUnlocked(lesson.id, progress);
          const done = progress.completed.includes(lesson.id);
          const earnedStars =
            progress.lessonStars?.[lesson.id] ?? (done ? 3 : 0);

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
              style={({pressed}) => [
                styles.lessonCard,
                {
                  borderRadius: radius.lg,
                  backgroundColor: '#FFFFFF',
                  borderColor: accent,
                  opacity: unlocked ? 1 : 0.5,
                },
                pressed && unlocked && styles.cardPressed,
              ]}>
              <View
                style={[
                  styles.lessonBadge,
                  {backgroundColor: `${accent}22`, borderRadius: radius.md},
                ]}>
                <Text style={styles.pieceSymbol}>
                  {lesson.pieceSymbol ?? String(lesson.order)}
                </Text>
              </View>
              <View style={styles.lessonText}>
                <View style={styles.titleRow}>
                  <AppText variant="title" tone="ink">
                    {lesson.order}.{' '}
                    {preferTamil ? lesson.titleTa : lesson.titleEn}
                  </AppText>
                </View>
                <AppText variant="caption" tone="muted">
                  {preferTamil ? lesson.subtitleTa : lesson.subtitleEn}
                </AppText>
                {done && (
                  <View style={styles.starsRatingRow}>
                    {Array.from({length: 3}).map((_, sIdx) => (
                      <Text
                        key={`star-${sIdx}`}
                        style={[
                          styles.smallStar,
                          sIdx < earnedStars && styles.smallStarEarned,
                        ]}>
                        ★
                      </Text>
                    ))}
                  </View>
                )}
              </View>
              <Chip
                label={
                  done
                    ? preferTamil
                      ? 'மீண்டும் (Replay)'
                      : 'Replay'
                    : unlocked
                    ? preferTamil
                      ? 'தொடங்கு'
                      : 'Start'
                    : '🔒 பூட்டப்பட்டது'
                }
                tone={done ? 'success' : unlocked ? 'sun' : 'locked'}
                accentColor={accent}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </AppSafeAreaView>
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
    gap: 6,
  },
  totalStarIcon: {
    fontSize: 20,
    color: '#F59E0B',
  },
  totalStarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  center: {
    textAlign: 'center',
  },
  sectionHeading: {
    marginTop: 8,
  },
  lessonCard: {
    borderWidth: 2,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  cardPressed: {
    transform: [{scale: 0.98}],
  },
  lessonBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceSymbol: {
    fontSize: 26,
  },
  lessonText: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starsRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  smallStar: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  smallStarEarned: {
    color: '#F59E0B',
  },
});
