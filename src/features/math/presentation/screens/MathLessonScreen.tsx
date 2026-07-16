import {useCallback, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {asChildId, ModuleId} from '@core/domain';
import {
  applyGrantResult,
  createMmkvGamificationRepository,
  grantRewards,
} from '@core/gamification';
import {
  AppShell,
  AppText,
  Chip,
  IconButton,
  MascotSpot,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {isMathLessonId, type MathLessonId} from '../../domain/curriculum/types';
import {CelebrationStars} from '../components/CelebrationStars';
import {MathChoicePad} from '../components/MathChoicePad';
import {MathObjectCounter} from '../components/MathObjectCounter';
import {MathVisualPanel} from '../components/MathVisualPanel';
import {useInfiniteMathPractice} from '../hooks/useInfiniteMathPractice';
import type {MathStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

function resolveLessonId(raw: string): MathLessonId {
  const stripped = raw.replace(/^math\./, '');
  if (isMathLessonId(stripped)) {
    return stripped;
  }
  return 'numbers';
}

const REWARD_EVERY = 5;

/**
 * Endless English voice-first math practice with adaptive difficulty.
 */
export function MathLessonScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace, radius} = useTheme();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );
  const lessonId = resolveLessonId(route.params.lessonId);
  const player = useInfiniteMathPractice(lessonId);
  const lastRewardedRef = useRef(0);

  const title = player.lesson.titleEn;

  const maybeGrantReward = useCallback(
    async (correctCount: number) => {
      if (
        correctCount === 0 ||
        correctCount % REWARD_EVERY !== 0 ||
        correctCount === lastRewardedRef.current
      ) {
        return;
      }
      lastRewardedRef.current = correctCount;
      const repo = createMmkvGamificationRepository();
      const result = await grantRewards(repo, {
        childId: asChildId(activeChildId),
        source: 'lesson',
        moduleId: ModuleId.Math,
        reasonCode: `math.practice.${lessonId}.streak`,
        stars: 1,
        xp: 8,
      });
      if (result.ok) {
        dispatch(
          applyGrantResult({
            snapshot: result.value.snapshot,
            celebrations: result.value.celebrations,
          }),
        );
      }
    },
    [activeChildId, dispatch, lessonId],
  );

  useEffect(() => {
    void maybeGrantReward(player.session.correct);
  }, [maybeGrantReward, player.session.correct]);

  const practice = player.question?.practice;
  const showChoices =
    player.phase === 'practicing' &&
    practice?.mode === 'choice' &&
    practice.choices;
  const showCount =
    player.phase === 'practicing' &&
    practice?.mode === 'count' &&
    practice.emojis;

  return (
    <AppShell testID="math-lesson-screen">
      <TopAppBar
        title={title}
        subtitle={t('math.lesson.question', {
          number: player.questionIndex + 1,
        })}
        onBack={() => navigation.navigate('Hub')}
        trailing={
          <IconButton
            label={t('math.lesson.replay')}
            symbol="🔊"
            onPress={() => {
              void player.replayAudio();
            }}
          />
        }
      />
      <ScrollView
        contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Chip
            label={t('math.lesson.level', {level: player.difficultyLevel})}
            tone="sun"
          />
          <Chip
            label={t('math.lesson.sessionScore', {
              correct: player.session.correct,
              total: player.session.attempted,
            })}
            tone="success"
          />
        </View>

        <View
          style={[
            styles.coachBanner,
            {
              borderRadius: radius.lg,
              backgroundColor: '#FFE8C2',
              borderColor: '#F4B400',
            },
          ]}>
          <MascotSpot
            mood={
              player.feedbackTone === 'success'
                ? 'cheer'
                : player.feedbackTone === 'error'
                ? 'calm'
                : 'happy'
            }
            size={72}
            label={t('math.hub.coachName')}
          />
          <View style={styles.captionCol}>
            <Chip
              label={
                player.isAiLoading
                  ? t('common.loading')
                  : t('math.lesson.listening')
              }
              tone="sun"
            />
            <AppText variant="body" tone="ink">
              {player.caption || '…'}
            </AppText>
          </View>
        </View>

        <View style={styles.visualWrap}>
          <MathVisualPanel visual={player.question?.visual} />
          <CelebrationStars
            visible={player.celebrate}
            label={t('math.lesson.yay')}
          />
        </View>

        {showChoices ? (
          <MathChoicePad
            choices={practice.choices!}
            disabled={player.choicesLocked || player.phase !== 'practicing'}
            onPick={id => {
              void player.onChoice(id);
            }}
          />
        ) : null}

        {showCount ? (
          <MathObjectCounter
            emojis={practice.emojis!}
            tapped={player.countTapped}
            scatterOffsets={practice.scatterOffsets}
            disabled={player.choicesLocked || player.phase !== 'practicing'}
            onTap={index => {
              void player.onCountTap(index);
            }}
          />
        ) : null}

        <AppText variant="caption" tone="muted" style={styles.keepGoing}>
          {t('math.lesson.keepPracticing')}
        </AppText>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {paddingBottom: space.xl},
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  coachBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    padding: space.md,
    borderWidth: 2,
  },
  captionCol: {flex: 1, gap: space.xs},
  visualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  keepGoing: {textAlign: 'center'},
});
