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
import {CelebrationStars} from '@features/math/presentation/components/CelebrationStars';
import {BatchCompleteOverlay} from '@features/math/presentation/components/numbers/BatchCompleteOverlay';
import {OddEvenChoicePad} from '@features/math/presentation/components/oddEven/OddEvenChoicePad';
import {OddEvenConceptSummary} from '@features/math/presentation/components/oddEven/OddEvenConceptSummary';
import {OddEvenPairingBoard} from '@features/math/presentation/components/oddEven/OddEvenPairingBoard';
import {
  LeoCoachBanner,
  QuestProgressBar,
} from '@features/math/presentation/components/objects';
import {
  ODD_EVEN_SESSION_SIZE,
  useOddEvenPlayer,
} from '@features/math/presentation/hooks/useOddEvenPlayer';
import type {MathStackParamList} from '@navigation/mathTypes';
import {BackButton} from '@shared/ui';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

const REWARD_EVERY = 5;

/** Teach-first Odd & Even adventure based on visually making pairs. */
export function OddEvenScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );
  const player = useOddEvenPlayer();
  const lastRewardedRef = useRef(0);

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
        reasonCode: 'math.odd-even.streak',
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
    void maybeGrantReward(player.correctCount);
  }, [maybeGrantReward, player.correctCount]);

  const progressPercent = (player.questionNumber / ODD_EVEN_SESSION_SIZE) * 100;
  const teachingLabel =
    player.phase === 'teach-even'
      ? t('math.oddEven.evenExample')
      : player.phase === 'teach-odd'
      ? t('math.oddEven.oddExample')
      : t('math.oddEven.questProgress');

  return (
    <AppSafeAreaView
      testID="odd-even-screen"
      backgroundImage={null}
      backgroundColor="#F5F7FA"
      padded={false}>
      <View style={styles.header}>
        <BackButton
          label={t('common.back')}
          onPress={() => navigation.navigate('Hub')}
        />
        <Text style={styles.headerTitle}>{t('math.oddEven.moduleTitle')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('math.lesson.replay')}
          onPress={() => {
            void player.replay();
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
            label={teachingLabel}
            percent={player.isTeaching ? 0 : progressPercent}
          />

          {player.phase === 'check-understanding' ? (
            <>
              <OddEvenConceptSummary image={player.question.object.image} />
              <View style={styles.understandingCard}>
                <Text style={styles.understandingTitle}>
                  {t('math.oddEven.doYouUnderstand')}
                </Text>
                <Text style={styles.understandingText}>
                  {t('math.oddEven.understandingHint')}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  testID="odd-even-understand"
                  disabled={player.isSpeaking}
                  onPress={() => {
                    void player.understand();
                  }}
                  style={({pressed}) => [
                    styles.understandButton,
                    pressed && styles.buttonPressed,
                    player.isSpeaking && styles.buttonDisabled,
                  ]}>
                  <Text style={styles.understandLabel}>
                    {t('math.oddEven.iUnderstand')}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  testID="odd-even-try-again"
                  disabled={player.isSpeaking}
                  onPress={() => {
                    void player.tryAgain();
                  }}
                  style={({pressed}) => [
                    styles.tryAgainButton,
                    pressed && styles.buttonPressed,
                    player.isSpeaking && styles.buttonDisabled,
                  ]}>
                  <Text style={styles.tryAgainLabel}>
                    {t('math.oddEven.tryAgain')}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleCard, styles.evenRule]}>
                  <Text style={styles.ruleEmoji}>🤝</Text>
                  <View style={styles.ruleCopy}>
                    <Text style={styles.ruleTitle}>
                      {t('math.oddEven.even')}
                    </Text>
                    <Text style={styles.ruleText}>
                      {t('math.oddEven.everyonePaired')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.ruleCard, styles.oddRule]}>
                  <Text style={styles.ruleEmoji}>☝️</Text>
                  <View style={styles.ruleCopy}>
                    <Text style={styles.ruleTitle}>
                      {t('math.oddEven.odd')}
                    </Text>
                    <Text style={styles.ruleText}>
                      {t('math.oddEven.oneLeft')}
                    </Text>
                  </View>
                </View>
              </View>

              <OddEvenPairingBoard
                number={player.question.number}
                image={player.question.object.image}
                revealLabel={player.revealAnswer}
                animationKey={`${player.phase}-${player.question.id}`}
              />

              {!player.isTeaching && player.phase !== 'complete' ? (
                <OddEvenChoicePad
                  choices={player.question.choices}
                  selectedId={player.selectedChoiceId}
                  disabled={player.choicesLocked || player.isSpeaking}
                  onPick={id => {
                    void player.onChoice(id);
                  }}
                />
              ) : (
                <View style={styles.watchPill}>
                  <Text style={styles.watchText}>
                    {t('math.oddEven.watchPairs')}
                  </Text>
                </View>
              )}
            </>
          )}

          <CelebrationStars
            visible={player.celebrate}
            label={t('math.oddEven.greatPairing')}
          />
        </ScrollView>

        <View style={styles.coachDock}>
          <LeoCoachBanner
            caption={player.caption}
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
          visible={player.phase === 'complete'}
          stars={2}
          greatJobs={player.correctCount}
          labels={{
            title: t('math.oddEven.completeTitle'),
            subtitle: t('math.oddEven.completeSubtitle'),
            starsLabel: t('math.oddEven.stars'),
            keepGoing: t('math.oddEven.keepPairing'),
          }}
          onContinue={player.startNextRound}
        />
      </View>
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
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#1D4ED8',
    fontSize: 18,
    fontWeight: '900',
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
  body: {flex: 1},
  scroll: {flex: 1},
  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ruleCard: {
    flex: 1,
    minHeight: 58,
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
  },
  evenRule: {
    backgroundColor: '#E9F8EF',
    borderColor: '#6BCB8B',
  },
  oddRule: {
    backgroundColor: '#FFF1ED',
    borderColor: '#F59E8B',
  },
  ruleEmoji: {fontSize: 20},
  ruleCopy: {flex: 1},
  ruleTitle: {
    color: '#1E3A5F',
    fontSize: 14,
    fontWeight: '900',
  },
  ruleText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  watchPill: {
    alignSelf: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  watchText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '800',
  },
  understandingCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#93C5FD',
    padding: 14,
    alignItems: 'center',
    gap: 9,
  },
  understandingTitle: {
    color: '#1E3A5F',
    fontSize: 21,
    fontWeight: '900',
  },
  understandingText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  understandButton: {
    width: '100%',
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#168235',
    borderBottomWidth: 5,
    borderBottomColor: '#0F5D25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  understandLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  tryAgainButton: {
    width: '100%',
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#7DD3FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryAgainLabel: {
    color: '#0369A1',
    fontSize: 15,
    fontWeight: '900',
  },
  buttonPressed: {
    transform: [{translateY: 2}],
    opacity: 0.9,
  },
  buttonDisabled: {opacity: 0.55},
  coachDock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F5F7FA',
  },
});
