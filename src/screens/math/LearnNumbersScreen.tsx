import {useCallback, useEffect, useRef} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components';
import {asChildId, ModuleId} from '@core/domain';
import {
  applyGrantResult,
  createMmkvGamificationRepository,
  grantRewards,
} from '@core/gamification';
import {BackButton, space} from '@shared/ui';

import {CelebrationStars} from '@features/math/presentation/components/CelebrationStars';
import {AnimatedObjectShowcase} from '@features/math/presentation/components/numbers/AnimatedObjectShowcase';
import {BatchCompleteOverlay} from '@features/math/presentation/components/numbers/BatchCompleteOverlay';
import {BigNumberHero} from '@features/math/presentation/components/numbers/BigNumberHero';
import {ConfettiBurst} from '@features/math/presentation/components/numbers/ConfettiBurst';
import {LevelPicker} from '@features/math/presentation/components/numbers/LevelPicker';
import {NumbersChoicePad} from '@features/math/presentation/components/numbers/NumbersChoicePad';
import {StarRewardBurst} from '@features/math/presentation/components/numbers/StarRewardBurst';
import {TapToCountBoard} from '@features/math/presentation/components/numbers/TapToCountBoard';
import {
  LeoCoachBanner,
  QuestProgressBar,
} from '@features/math/presentation/components/objects';
import {useLearnNumbersPlayer} from '@features/math/presentation/hooks/useLearnNumbersPlayer';
import type {MathStackParamList} from '@navigation/mathTypes';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

const REWARD_EVERY = 5;

/**
 * Learn Numbers — existing teach-first flow in the compact quest layout.
 */
export function LearnNumbersScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );
  const player = useLearnNumbersPlayer();
  const lastRewardedRef = useRef(0);

  const showTapBoard =
    (player.phase === 'tapCount' || player.phase === 'retry') &&
    player.question != null;
  const showPassiveObjects =
    player.phase === 'showObjects' ||
    player.phase === 'ask' ||
    player.phase === 'practice' ||
    player.phase === 'correct';
  const showChoices = player.phase === 'practice' && player.question != null;
  const showAnswerNumber =
    player.phase === 'explain' && player.question != null;

  const maybeGrantReward = useCallback(
    async (greatJobs: number) => {
      if (
        greatJobs === 0 ||
        greatJobs % REWARD_EVERY !== 0 ||
        greatJobs === lastRewardedRef.current
      ) {
        return;
      }
      lastRewardedRef.current = greatJobs;
      const repo = createMmkvGamificationRepository();
      const result = await grantRewards(repo, {
        childId: asChildId(activeChildId),
        source: 'lesson',
        moduleId: ModuleId.Math,
        reasonCode: 'math.numbers.streak',
        stars: 1,
        xp: 10,
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
    [activeChildId, dispatch],
  );

  useEffect(() => {
    void maybeGrantReward(player.batchStats.correct);
  }, [maybeGrantReward, player.batchStats.correct]);

  return (
    <AppSafeAreaView
      testID="learn-numbers-screen"
      backgroundImage={null}
      backgroundColor="#F5F7FA"
      padded={false}>
      <View style={styles.header}>
        <BackButton
          label={t('common.back')}
          onPress={() => navigation.navigate('Hub')}
        />
        <Text style={styles.headerTitle}>{t('math.numbers.title')}</Text>
        <View style={styles.starCount}>
          <Text style={styles.starText}>★ {player.batchStats.stars}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('math.lesson.replay')}
          onPress={() => {
            void player.replayAudio();
          }}
          style={styles.audioButton}>
          <Text style={styles.audioIcon}>🔊</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <QuestProgressBar
            label={t('math.numbers.questProgress')}
            percent={
              (player.batchStats.questionInBatch /
                player.batchStats.batchSize) *
              100
            }
          />

          <LevelPicker
            level={player.level}
            onChange={player.changeLevel}
            disabled={player.isSpeaking}
          />

          <View style={styles.playArea}>
            {showAnswerNumber && player.question ? (
              <BigNumberHero number={player.question.number} visible />
            ) : null}

            {showTapBoard && player.question ? (
              <TapToCountBoard
                emojis={player.question.emojis}
                image={player.question.object.image}
                tapOrderByIndex={player.tapOrderByIndex}
                highlightIndex={player.highlightIndex}
                disabled={player.isSpeaking}
                onTap={index => {
                  void player.onObjectTap(index);
                }}
              />
            ) : null}

            {player.question && showPassiveObjects && !showTapBoard ? (
              <AnimatedObjectShowcase
                emojis={player.question.emojis}
                image={player.question.object.image}
                highlightIndex={player.highlightIndex}
                visible
              />
            ) : null}

            <StarRewardBurst visible={player.showStarBurst} />
            <CelebrationStars
              visible={player.celebrate}
              label={t('math.lesson.yay')}
            />
            <ConfettiBurst
              visible={player.celebrate}
              label={t('math.numbers.greatJob')}
            />
          </View>

          {showChoices && player.question ? (
            <NumbersChoicePad
              choices={player.question.choices}
              disabled={player.choicesLocked}
              selectedId={player.selectedChoiceId}
              showCorrectId={player.showCorrectChoiceId}
              shakeId={
                player.phase === 'retry' ? player.selectedChoiceId : null
              }
              onPick={id => {
                void player.onChoice(id);
              }}
            />
          ) : null}
        </ScrollView>

        <View style={styles.coachDock}>
          <LeoCoachBanner
            caption={player.audioError ?? player.caption ?? '…'}
            tone={
              player.phase === 'correct'
                ? 'correct'
                : player.phase === 'retry'
                ? 'encourage'
                : 'default'
            }
          />
        </View>

        <BatchCompleteOverlay
          visible={player.batchComplete != null}
          stars={player.batchComplete?.stars ?? 0}
          greatJobs={player.batchComplete?.greatJobs ?? 0}
          labels={{
            title: t('math.numbers.batchComplete.title'),
            subtitle: t('math.numbers.batchComplete.subtitle'),
            starsLabel: t('math.numbers.stats.stars'),
            keepGoing: t('math.numbers.batchComplete.keepGoing'),
          }}
          onContinue={player.dismissBatchComplete}
        />
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  scroll: {flex: 1},
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
  starCount: {
    backgroundColor: '#FFF1B8',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  starText: {
    color: '#9A6700',
    fontWeight: '800',
    fontSize: 13,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: {fontSize: 16},
  content: {
    paddingHorizontal: 16,
    paddingBottom: space.md,
    gap: 12,
  },
  coachDock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F5F7FA',
  },
  playArea: {
    minHeight: 280,
    padding: space.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    position: 'relative',
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
