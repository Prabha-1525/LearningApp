import {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components';
import {
  getEquationLessonStars,
  getEquationProgress,
  isEquationLessonComplete,
  isEquationLessonUnlocked,
} from '@features/math/data/equationProgress';
import {
  EQUATION_LESSON_COUNT,
  getEquationLessons,
  type EquationMode,
} from '@features/math/domain/equation/equationCurriculum';
import {MissingLessonSuccess} from '@features/math/presentation/components/missing/MissingLessonSuccess';
import {
  EquationObjectBoard,
  LeoCoachBanner,
  NumberChoicePad,
  QuestProgressBar,
} from '@features/math/presentation/components/objects';
import {useEquationPlayer} from '@features/math/presentation/hooks/useEquationPlayer';
import type {MathStackParamList} from '@navigation/mathTypes';
import {BackButton, space} from '@shared/ui';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'> & {
  readonly mode: EquationMode;
};

function starLabel(count: number): string {
  if (count <= 0) {
    return '';
  }
  return '⭐'.repeat(Math.min(3, count));
}

function i18nPrefix(mode: EquationMode): 'math.addition' | 'math.subtraction' {
  return mode === 'addition' ? 'math.addition' : 'math.subtraction';
}

/**
 * Shared Addition / Subtraction adventure — equation object board + choices.
 */
export function EquationLessonScreen({navigation, mode}: Props) {
  const {t} = useTranslation();
  const prefix = i18nPrefix(mode);
  const lessons = getEquationLessons(mode);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [pickerKey, setPickerKey] = useState(0);
  const progress = useMemo(
    () => getEquationProgress(mode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickerKey, selectedLesson, mode],
  );

  if (selectedLesson == null) {
    return (
      <AppSafeAreaView
        testID={`${mode}-lesson-picker`}
        backgroundImage={null}
        backgroundColor="#F5F7FA"
        padded={false}>
        <View style={styles.header}>
          <BackButton
            label={t('common.back')}
            onPress={() => navigation.navigate('Hub')}
          />
          <Text style={styles.headerTitle}>{t(`${prefix}.moduleTitle`)}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.pickerContent}>
          <Text style={styles.pickerLead}>{t(`${prefix}.pickerLead`)}</Text>
          <Text style={styles.totalStars}>
            {t(`${prefix}.totalStars`, {count: progress.starsEarned})}
          </Text>
          {lessons.map(lesson => {
            const done = isEquationLessonComplete(mode, lesson.index);
            const unlocked = isEquationLessonUnlocked(mode, lesson.index);
            const stars = getEquationLessonStars(mode, lesson.index);
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
                    {t(`${prefix}.lessonLabel`, {
                      number: lesson.index,
                      title: lesson.titleEn,
                    })}
                  </Text>
                  <Text style={styles.lessonSub}>
                    {!unlocked
                      ? t(`${prefix}.lockedHint`)
                      : done
                      ? t(`${prefix}.completedWithStars`, {
                          stars: starLabel(stars),
                        })
                      : t(`${prefix}.questionsCount`, {count: 10})}
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
    <EquationPlaySession
      key={`${mode}-${selectedLesson}-${pickerKey}`}
      mode={mode}
      lessonIndex={selectedLesson}
      onExitToPicker={() => {
        setSelectedLesson(null);
        setPickerKey(k => k + 1);
      }}
      onNextLesson={() => {
        setSelectedLesson(Math.min(selectedLesson + 1, EQUATION_LESSON_COUNT));
        setPickerKey(k => k + 1);
      }}
    />
  );
}

type PlayProps = {
  readonly mode: EquationMode;
  readonly lessonIndex: number;
  readonly onExitToPicker: () => void;
  readonly onNextLesson: () => void;
};

function EquationPlaySession({
  mode,
  lessonIndex,
  onExitToPicker,
  onNextLesson,
}: PlayProps) {
  const {t} = useTranslation();
  const prefix = i18nPrefix(mode);
  const dispatch = useAppDispatch();
  const childId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );
  const player = useEquationPlayer(mode, lessonIndex, childId, dispatch);
  const barPercent = Math.min(
    100,
    (player.correctInLesson / player.totalSteps) * 100,
  );
  const bestStars =
    player.lessonProgress?.starsByLesson[String(lessonIndex)] ??
    player.performanceStars;

  return (
    <AppSafeAreaView
      testID={`${mode}-screen`}
      backgroundImage={null}
      backgroundColor="#F5F7FA"
      padded={false}>
      <View style={styles.playHeader}>
        <BackButton label={t('common.back')} onPress={onExitToPicker} />
        <QuestProgressBar
          label={t(`${prefix}.questProgress`)}
          percent={barPercent}
        />
      </View>

      <View style={styles.playBody}>
        <LeoCoachBanner
          caption={player.caption}
          tone={
            player.phase === 'encourage'
              ? 'encourage'
              : player.phase === 'correct'
              ? 'correct'
              : 'default'
          }
        />

        <Text style={styles.stepText}>
          {t(`${prefix}.stepOf`, {
            step: Math.min(player.step, player.totalSteps),
            total: player.totalSteps,
          })}
        </Text>

        <View style={styles.boardWrap}>
          {player.question ? (
            <EquationObjectBoard
              leftCount={player.question.left}
              rightCount={player.question.right}
              image={player.question.object.image}
              operator={mode === 'addition' ? '+' : '-'}
            />
          ) : null}
        </View>

        {player.question ? (
          <NumberChoicePad
            choices={player.question.choices}
            layout="grid"
            disabled={player.choicesLocked || player.phase === 'success'}
            onPick={id => {
              void player.onChoice(id);
            }}
            testIDPrefix={`${mode}-choice`}
          />
        ) : null}
      </View>

      {player.phase === 'success' ? (
        <MissingLessonSuccess
          lessonTitle={player.lesson.titleEn}
          correctCount={player.correctInLesson}
          totalSteps={player.totalSteps}
          performanceStars={player.performanceStars}
          bestStars={bestStars}
          deltaStars={player.rewardDeltaStars}
          newBadgeLabels={player.newBadges.map(b => t(b.titleKey))}
          labels={{
            title: t(`${prefix}.successTitle`),
            subtitle: t(`${prefix}.successSubtitle`),
            starsLabel: t(`${prefix}.starsEarned`),
            bestLabel: t(`${prefix}.bestStars`),
            badgeUnlocked: t(`${prefix}.badgeUnlocked`),
            continue: t(`${prefix}.continue`),
            nextLesson: t(`${prefix}.nextLesson`),
            backToHub: t(`${prefix}.backToLessons`),
          }}
          onNextLesson={
            lessonIndex < EQUATION_LESSON_COUNT ? onNextLesson : undefined
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
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  headerSpacer: {width: 48},
  playHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
  },
  playBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: space.md,
    gap: 14,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7A88',
  },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
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
