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
  RewardBadge,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import {CelebrationStars} from '../components/CelebrationStars';
import {AnimatedObjectShowcase} from '../components/numbers/AnimatedObjectShowcase';
import {BatchCompleteOverlay} from '../components/numbers/BatchCompleteOverlay';
import {BigNumberHero} from '../components/numbers/BigNumberHero';
import {ConfettiBurst} from '../components/numbers/ConfettiBurst';
import {LevelPicker} from '../components/numbers/LevelPicker';
import {NumbersChoicePad} from '../components/numbers/NumbersChoicePad';
import {NumbersProgressCard} from '../components/numbers/NumbersProgressCard';
import {StarRewardBurst} from '../components/numbers/StarRewardBurst';
import {TapToCountBoard} from '../components/numbers/TapToCountBoard';
import {useLearnNumbersPlayer} from '../hooks/useLearnNumbersPlayer';
import type {MathStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

const REWARD_EVERY = 5;

function coachCardStyle(phase: string): {
  backgroundColor: string;
  borderColor: string;
} {
  if (phase === 'correct') {
    return {backgroundColor: '#E8FBF3', borderColor: '#3D9A5F'};
  }
  if (phase === 'retry') {
    return {backgroundColor: '#FFF8E7', borderColor: '#FFB347'};
  }
  return {backgroundColor: '#FFF8E7', borderColor: '#FFB347'};
}

/**
 * Learn Numbers — premium teach-first kindergarten experience.
 */
export function LearnNumbersScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {space: themeSpace, radius} = useTheme();
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
    player.phase === 'showObjects' || player.phase === 'ask';
  const showChoices = player.phase === 'practice' && player.question != null;
  const showAnswerNumber =
    player.phase === 'explain' && player.question != null;

  const coachMood =
    player.phase === 'correct'
      ? 'cheer'
      : player.phase === 'retry'
      ? 'calm'
      : 'happy';

  const coachColors = coachCardStyle(player.phase);

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

  const statusChip =
    player.phase === 'correct'
      ? t('math.numbers.greatJob')
      : player.isSpeaking
      ? t('math.numbers.speaking')
      : player.phase === 'tapCount'
      ? t('math.numbers.tapToCount')
      : player.audioError
      ? t('math.numbers.audioError')
      : t('math.lesson.listening');

  const statusTone =
    player.phase === 'correct'
      ? 'success'
      : player.audioError
      ? 'locked'
      : 'sun';

  return (
    <AppShell testID="learn-numbers-screen">
      <TopAppBar
        title={t('math.numbers.title')}
        subtitle={t('math.numbers.subtitle')}
        onBack={() => navigation.navigate('Hub')}
        trailing={
          <View style={styles.topTrailing}>
            <RewardBadge
              label={t('math.numbers.stars')}
              count={player.batchStats.stars}
              active={player.phase === 'correct'}
            />
            <IconButton
              label={t('math.lesson.replay')}
              symbol="🔊"
              onPress={() => {
                void player.replayAudio();
              }}
            />
          </View>
        }
      />
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={[styles.content, {gap: themeSpace.md}]}
          showsVerticalScrollIndicator={false}>
          <NumbersProgressCard
            questionInBatch={player.batchStats.questionInBatch}
            batchSize={player.batchStats.batchSize}
            stars={player.batchStats.stars}
            greatJobs={player.batchStats.correct}
            score={player.batchScore}
            labels={{
              question: t('math.numbers.stats.question'),
              stars: t('math.numbers.stats.stars'),
              greatJobs: t('math.numbers.stats.greatJobs'),
              score: t('math.numbers.stats.score'),
            }}
          />

          <LevelPicker
            level={player.level}
            onChange={player.changeLevel}
            disabled={player.isSpeaking}
          />

          <View
            style={[
              styles.coachCard,
              {borderRadius: radius.lg, ...coachColors},
            ]}>
            <MascotSpot
              mood={coachMood}
              size={92}
              label={t('math.hub.coachName')}
            />
            <View style={styles.coachText}>
              <View style={styles.coachChips}>
                <Chip label={statusChip} tone={statusTone} />
                {player.streak >= 3 ? (
                  <Chip label={t('math.numbers.onARoll')} tone="success" />
                ) : null}
              </View>
              <AppText
                variant="body"
                tone={player.phase === 'correct' ? 'primary' : 'ink'}
                style={styles.caption}>
                {player.audioError ?? player.caption ?? '…'}
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.playArea,
              {borderRadius: radius.lg, backgroundColor: '#E8F4FF'},
            ]}>
            {showAnswerNumber && player.question ? (
              <BigNumberHero number={player.question.number} visible />
            ) : null}

            {showTapBoard && player.question ? (
              <TapToCountBoard
                emojis={player.question.emojis}
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

          <AppText variant="caption" tone="muted" style={styles.footer}>
            {t('math.numbers.keepGoing')}
          </AppText>
        </ScrollView>

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
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  content: {paddingBottom: space.xl},
  topTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    padding: space.md,
    borderWidth: 3,
  },
  coachText: {flex: 1, gap: space.xs},
  coachChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  caption: {lineHeight: 24},
  playArea: {
    minHeight: 280,
    padding: space.md,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: space.md,
    borderWidth: 3,
    borderColor: '#4DB7E8',
    position: 'relative',
    overflow: 'hidden',
  },
  footer: {textAlign: 'center'},
});
