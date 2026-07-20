import {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {leoWave} from '@assets';
import {AppSafeAreaView} from '@components';
import {
  getCountingLessonStars,
  getCountingProgress,
  isCountingLessonComplete,
  isCountingLessonUnlocked,
} from '@features/math/data/countingProgress';
import {
  COUNTING_LESSON_COUNT,
  COUNTING_LESSONS,
} from '@features/math/domain/counting/countingCurriculum';
import {CountingChoiceRow} from '@features/math/presentation/components/counting/CountingChoiceRow';
import {CountingObjectGrid} from '@features/math/presentation/components/counting/CountingObjectGrid';
import {MissingLessonSuccess} from '@features/math/presentation/components/missing/MissingLessonSuccess';
import {useCountingPlayer} from '@features/math/presentation/hooks/useCountingPlayer';
import type {MathStackParamList} from '@navigation/mathTypes';
import {BackButton, space} from '@shared/ui';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

function starLabel(count: number): string {
  if (count <= 0) {
    return '';
  }
  return '⭐'.repeat(Math.min(3, count));
}

/**
 * Counting adventure — object grid (≤20), tap-to-count, number choices, Leo.
 */
export function CountingScreen({navigation}: Props) {
  const {t} = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [pickerKey, setPickerKey] = useState(0);
  const progress = useMemo(
    () => getCountingProgress(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickerKey, selectedLesson],
  );

  if (selectedLesson == null) {
    return (
      <AppSafeAreaView
        testID="counting-lesson-picker"
        backgroundImage={null}
        backgroundColor="#F3F8FC"
        padded={false}>
        <View style={styles.header}>
          <BackButton
            label={t('common.back')}
            onPress={() => navigation.navigate('Hub')}
          />
          <Text style={styles.headerTitle}>
            {t('math.counting.moduleTitle')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.pickerContent}>
          <Text style={styles.pickerLead}>{t('math.counting.pickerLead')}</Text>
          <Text style={styles.totalStars}>
            {t('math.counting.totalStars', {count: progress.starsEarned})}
          </Text>
          {COUNTING_LESSONS.map(lesson => {
            const done = isCountingLessonComplete(lesson.index);
            const unlocked = isCountingLessonUnlocked(lesson.index);
            const stars = getCountingLessonStars(lesson.index);
            return (
              <Pressable
                key={lesson.index}
                disabled={!unlocked}
                onPress={() => unlocked && setSelectedLesson(lesson.index)}
                style={[
                  styles.lessonRow,
                  done && styles.lessonRowDone,
                  !unlocked && styles.lessonRowLocked,
                ]}>
                <View
                  style={[
                    styles.lessonBadge,
                    !unlocked && styles.lessonBadgeLocked,
                  ]}>
                  <Text style={styles.lessonBadgeText}>
                    {unlocked ? lesson.index : '🔒'}
                  </Text>
                </View>
                <View style={styles.lessonMeta}>
                  <Text style={styles.lessonTitle}>
                    {t('math.counting.lessonLabel', {
                      number: lesson.index,
                      title: lesson.titleEn,
                    })}
                  </Text>
                  <Text style={styles.lessonSub}>
                    {!unlocked
                      ? t('math.counting.lockedHint')
                      : done
                      ? t('math.counting.completedWithStars', {
                          stars: starLabel(stars),
                        })
                      : t('math.counting.questionsCount', {count: 10})}
                  </Text>
                </View>
                <Text style={styles.lessonStatus}>
                  {done ? starLabel(stars) || '⭐' : unlocked ? '▶' : '🔒'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </AppSafeAreaView>
    );
  }

  return (
    <CountingPlaySession
      key={`${selectedLesson}-${pickerKey}`}
      lessonIndex={selectedLesson}
      onExitToPicker={() => {
        setSelectedLesson(null);
        setPickerKey(k => k + 1);
      }}
      onNextLesson={() => {
        setSelectedLesson(Math.min(selectedLesson + 1, COUNTING_LESSON_COUNT));
        setPickerKey(k => k + 1);
      }}
    />
  );
}

type PlayProps = {
  readonly lessonIndex: number;
  readonly onExitToPicker: () => void;
  readonly onNextLesson: () => void;
};

function CountingPlaySession({
  lessonIndex,
  onExitToPicker,
  onNextLesson,
}: PlayProps) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const childId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );
  const player = useCountingPlayer(lessonIndex, childId, dispatch);
  const title = player.lesson.titleEn;
  const barPercent = Math.min(
    100,
    (player.correctInLesson / player.totalSteps) * 100,
  );
  const bestStars =
    player.lessonProgress?.starsByLesson[String(lessonIndex)] ??
    player.performanceStars;

  return (
    <AppSafeAreaView
      testID="counting-screen"
      backgroundImage={null}
      backgroundColor="#F3F8FC"
      padded={false}>
      <View style={styles.header}>
        <BackButton label={t('common.back')} onPress={onExitToPicker} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.progressMini}>
          <View style={styles.progressMiniTrack}>
            <View
              style={[styles.progressMiniFill, {width: `${barPercent}%`}]}
            />
          </View>
          <Text style={styles.progressStar}>★</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('math.lesson.replay')}
          onPress={() => {
            void player.replayPrompt();
          }}
          style={styles.speakerBtn}>
          <Text style={styles.speakerIcon}>🔊</Text>
        </Pressable>
      </View>

      <View style={styles.playBody}>
        <Text style={styles.stepText}>
          {t('math.counting.stepOf', {
            step: Math.min(player.step, player.totalSteps),
            total: player.totalSteps,
          })}
        </Text>

        <View style={styles.centerStage}>
          {player.question ? (
            <CountingObjectGrid
              count={player.question.count}
              image={player.question.object.image}
              tapped={player.tapped}
              onTap={player.onTapObject}
              disabled={player.phase === 'success'}
            />
          ) : null}
        </View>

        <View style={styles.bottomPanel}>
          {player.question ? (
            <CountingChoiceRow
              choices={player.question.choices}
              disabled={player.choicesLocked || player.phase === 'success'}
              onPick={id => {
                void player.onChoice(id);
              }}
            />
          ) : null}

          <View style={styles.coachRow}>
            <Image source={leoWave} style={styles.leo} resizeMode="contain" />
            <View
              style={[
                styles.bubble,
                player.phase === 'encourage' && styles.bubbleEncourage,
                player.phase === 'correct' && styles.bubbleCorrect,
              ]}>
              <Text style={styles.bubbleText}>{player.caption}</Text>
            </View>
          </View>
        </View>
      </View>

      {player.phase === 'success' ? (
        <MissingLessonSuccess
          lessonTitle={title}
          correctCount={player.correctInLesson}
          totalSteps={player.totalSteps}
          performanceStars={player.performanceStars}
          bestStars={bestStars}
          deltaStars={player.rewardDeltaStars}
          newBadgeLabels={player.newBadges.map(b => t(b.titleKey))}
          labels={{
            title: t('math.counting.successTitle'),
            subtitle: t('math.counting.successSubtitle'),
            starsLabel: t('math.counting.starsEarned'),
            bestLabel: t('math.counting.bestStars'),
            badgeUnlocked: t('math.counting.badgeUnlocked'),
            continue: t('math.counting.continue'),
            nextLesson: t('math.counting.nextLesson'),
            backToHub: t('math.counting.backToLessons'),
          }}
          onNextLesson={
            lessonIndex < COUNTING_LESSON_COUNT ? onNextLesson : undefined
          }
          onContinue={onExitToPicker}
        />
      ) : null}
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 6,
  },
  headerTitle: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
    maxWidth: 140,
  },
  headerSpacer: {width: 48},
  progressMini: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  progressMiniTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressMiniFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 999,
  },
  progressStar: {
    color: '#F5C518',
    fontSize: 14,
    fontWeight: '800',
  },
  speakerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {fontSize: 16},
  playBody: {
    flex: 1,
    paddingHorizontal: 12,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7A88',
    marginBottom: 6,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomPanel: {
    backgroundColor: '#D9ECF8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: space.md,
    gap: 12,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  leo: {width: 72, height: 88},
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#93C5FD',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleEncourage: {
    borderColor: '#F5A623',
    backgroundColor: '#FFF8E7',
  },
  bubbleCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF5',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D4ED8',
    lineHeight: 20,
  },
  pickerContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  pickerLead: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B6B74',
  },
  totalStars: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  lessonRowDone: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  lessonRowLocked: {
    opacity: 0.55,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  lessonBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBadgeLocked: {backgroundColor: '#9CA3AF'},
  lessonBadgeText: {color: '#FFFFFF', fontWeight: '800', fontSize: 16},
  lessonMeta: {flex: 1, gap: 2},
  lessonTitle: {fontSize: 15, fontWeight: '800', color: '#1A2A4A'},
  lessonSub: {fontSize: 12, fontWeight: '600', color: '#6B7A88'},
  lessonStatus: {fontSize: 16},
});
