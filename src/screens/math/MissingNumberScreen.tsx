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
  getMissingLessonStars,
  getMissingProgress,
  isMissingLessonComplete,
  isMissingLessonUnlocked,
} from '@features/math/data/missingProgress';
import {
  MISSING_LESSON_COUNT,
  MISSING_LESSONS,
} from '@features/math/domain/missing/missingCurriculum';
import {MissingChoiceGrid} from '@features/math/presentation/components/missing/MissingChoiceGrid';
import {MissingLessonSuccess} from '@features/math/presentation/components/missing/MissingLessonSuccess';
import {MissingSequenceBoard} from '@features/math/presentation/components/missing/MissingSequenceBoard';
import {useMissingNumberPlayer} from '@features/math/presentation/hooks/useMissingNumberPlayer';
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
 * Missing Number — 10 lessons × 10 random questions + rewards.
 */
export function MissingNumberScreen({navigation}: Props) {
  const {t} = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [pickerKey, setPickerKey] = useState(0);
  const progress = useMemo(
    () => getMissingProgress(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickerKey, selectedLesson],
  );

  if (selectedLesson == null) {
    return (
      <AppSafeAreaView
        testID="missing-lesson-picker"
        backgroundImage={null}
        backgroundColor="#F3F8FC"
        padded={false}>
        <View style={styles.header}>
          <BackButton
            label={t('common.back')}
            onPress={() => navigation.navigate('Hub')}
          />
          <Text style={styles.headerTitle}>
            {t('math.missing.moduleTitle')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.pickerContent}>
          <Text style={styles.pickerLead}>{t('math.missing.pickerLead')}</Text>
          <Text style={styles.totalStars}>
            {t('math.missing.totalStars', {count: progress.starsEarned})}
          </Text>
          {MISSING_LESSONS.map(lesson => {
            const done = isMissingLessonComplete(lesson.index);
            const unlocked = isMissingLessonUnlocked(lesson.index);
            const stars = getMissingLessonStars(lesson.index);
            return (
              <Pressable
                key={lesson.index}
                testID={`missing-lesson-${lesson.index}`}
                disabled={!unlocked}
                accessibilityState={{disabled: !unlocked}}
                onPress={() => {
                  if (unlocked) {
                    setSelectedLesson(lesson.index);
                  }
                }}
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
                  <Text
                    style={[
                      styles.lessonTitle,
                      !unlocked && styles.lessonTitleLocked,
                    ]}>
                    {t('math.missing.lessonOnly', {number: lesson.index})}
                  </Text>
                  <Text style={styles.lessonSub}>
                    {!unlocked
                      ? t('math.missing.lockedHint')
                      : done
                      ? t('math.missing.completedWithStars', {
                          stars: starLabel(stars),
                        })
                      : t('math.missing.questionsCount', {count: 10})}
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
    <MissingPlaySession
      key={`${selectedLesson}-${pickerKey}`}
      lessonIndex={selectedLesson}
      onExitToPicker={() => {
        setSelectedLesson(null);
        setPickerKey(k => k + 1);
      }}
      onNextLesson={() => {
        const next = Math.min(selectedLesson + 1, MISSING_LESSON_COUNT);
        setSelectedLesson(next);
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

function MissingPlaySession({
  lessonIndex,
  onExitToPicker,
  onNextLesson,
}: PlayProps) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const childId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );
  const player = useMissingNumberPlayer(lessonIndex, childId, dispatch);
  const title = t('math.missing.lessonOnly', {number: lessonIndex});
  const barPercent = Math.min(
    100,
    (player.correctInLesson / player.totalSteps) * 100,
  );
  const bestStars =
    player.lessonProgress?.starsByLesson[String(lessonIndex)] ??
    player.performanceStars;

  return (
    <AppSafeAreaView
      testID="missing-number-screen"
      backgroundImage={null}
      backgroundColor="#F3F8FC"
      padded={false}>
      <View style={styles.header}>
        <BackButton label={t('common.back')} onPress={onExitToPicker} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.starBtn}>
          <Text style={styles.starBtnIcon}>★</Text>
        </View>
      </View>

      <View style={styles.playBody}>
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>
            {t('math.missing.stepOf', {
              step: Math.min(player.step, player.totalSteps),
              total: player.totalSteps,
            })}
          </Text>
          <View style={styles.miniStar}>
            <Text style={styles.miniStarText}>★</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${barPercent}%`}]} />
        </View>

        <View style={styles.centerStage}>
          {player.question ? (
            <MissingSequenceBoard
              sequence={player.question.sequence}
              filledAnswer={player.filledAnswer}
            />
          ) : null}

          {player.question ? (
            <View style={styles.choiceWrap}>
              <MissingChoiceGrid
                choices={player.question.choices}
                disabled={player.choicesLocked || player.phase === 'success'}
                onPick={id => {
                  void player.onChoice(id);
                }}
              />
            </View>
          ) : null}
        </View>

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
            title: t('math.missing.successTitle'),
            subtitle: t('math.missing.successSubtitle'),
            starsLabel: t('math.missing.starsEarned'),
            bestLabel: t('math.missing.bestStars'),
            badgeUnlocked: t('math.missing.badgeUnlocked'),
            continue: t('math.missing.continue'),
            nextLesson: t('math.missing.nextLesson'),
            backToHub: t('math.missing.backToLessons'),
          }}
          onNextLesson={
            lessonIndex < MISSING_LESSON_COUNT ? onNextLesson : undefined
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
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  headerSpacer: {width: 48},
  starBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtnIcon: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: '800',
  },
  playBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: space.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7A88',
  },
  miniStar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 999,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
    paddingVertical: 12,
  },
  choiceWrap: {
    width: '100%',
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingBottom: 4,
  },
  leo: {
    width: 80,
    height: 96,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#93C5FD',
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#1D4ED8',
    lineHeight: 21,
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
    marginBottom: 6,
  },
  totalStars: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 4,
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
  lessonBadgeLocked: {
    backgroundColor: '#9CA3AF',
  },
  lessonBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  lessonMeta: {flex: 1, gap: 2},
  lessonTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  lessonTitleLocked: {
    color: '#6B7280',
  },
  lessonSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7A88',
  },
  lessonStatus: {fontSize: 16},
});
