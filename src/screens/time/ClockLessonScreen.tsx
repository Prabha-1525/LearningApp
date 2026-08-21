import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {InteractiveClock} from '../../features/time/presentation/components';
import {
  CLOCK_CHALLENGES,
  CLOCK_LESSONS,
} from '../../features/time/domain/catalog/timeData';
import {
  recordClockChallengeCompletion,
  recordTimeTopicCompletion,
} from '../../features/time/data/progress/timeProgress';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'ClockLesson'>;

export function ClockLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const [mode, setMode] = useState<'guided' | 'challenges' | 'sandbox'>(
    'guided',
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [challengeSolved, setChallengeSolved] = useState<boolean>(false);

  const step = CLOCK_LESSONS[currentStepIndex] ?? CLOCK_LESSONS[0]!;
  const challenge =
    CLOCK_CHALLENGES[currentChallengeIndex] ?? CLOCK_CHALLENGES[0]!;

  const handleNextStep = () => {
    if (currentStepIndex + 1 < CLOCK_LESSONS.length) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      recordTimeTopicCompletion('clock', 3);
      setMode('challenges');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleChallengeSuccess = useCallback(() => {
    setChallengeSolved(true);
    recordClockChallengeCompletion(challenge.id);
  }, [challenge.id]);

  const handleNextChallenge = () => {
    setChallengeSolved(false);
    if (currentChallengeIndex + 1 < CLOCK_CHALLENGES.length) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      recordTimeTopicCompletion('clock', 3);
      navigation.navigate('TimeComplete', {
        starsEarned: 3,
        topicTitle: t('time.topics.clock.title', 'Learn the Clock'),
      });
    }
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#EFF6FF">
      <LearningHeader
        title={t('time.topics.clock.title', 'Learn the Clock')}
        subtitle={
          mode === 'guided'
            ? `Step ${currentStepIndex + 1} of ${CLOCK_LESSONS.length}`
            : mode === 'challenges'
            ? `Challenge ${currentChallengeIndex + 1} of ${
                CLOCK_CHALLENGES.length
              }`
            : 'Free Clock Sandbox'
        }
        emoji="⏰"
        accentColor="#2563EB"
        titleColor="#2563EB"
      />

      {/* Mode Switcher */}
      <View style={styles.modeTabs}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('guided')}
          style={[styles.modeTab, mode === 'guided' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'guided' && styles.modeTabTextActive,
            ]}>
            📖 {t('time.clock.tabGuided', 'Lessons')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setMode('challenges');
            setChallengeSolved(false);
          }}
          style={[
            styles.modeTab,
            mode === 'challenges' && styles.modeTabActive,
          ]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'challenges' && styles.modeTabTextActive,
            ]}>
            🎯 {t('time.clock.tabChallenges', 'Challenges')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('sandbox')}
          style={[styles.modeTab, mode === 'sandbox' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'sandbox' && styles.modeTabTextActive,
            ]}>
            🕹️ {t('time.clock.tabFreePlay', 'Free Play')}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* MODE 1: Guided Lesson */}
        {mode === 'guided' && (
          <View style={styles.guidedWrap}>
            {/* Step card */}
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>
                {t(step.titleKey, step.id)}
              </Text>
              <Text style={styles.lessonExplanation}>
                {t(step.explanationKey, step.speechText)}
              </Text>
            </View>

            {/* Interactive Clock displaying the lesson time */}
            <InteractiveClock
              key={`guided-${step.id}`}
              hour={step.hour}
              minute={step.minute}
              isInteractive={true}
              showDigitalTime={true}
              showControls={true}
              size={260}
            />

            {/* Lesson Navigation Buttons */}
            <View style={styles.navRow}>
              <Pressable
                accessibilityRole="button"
                disabled={currentStepIndex === 0}
                onPress={handlePrevStep}
                style={[
                  styles.navBtn,
                  styles.navBtnSecondary,
                  currentStepIndex === 0 && styles.navBtnDisabled,
                ]}>
                <Text style={styles.navBtnTextSecondary}>◀ Previous</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleNextStep}
                style={[styles.navBtn, styles.navBtnPrimary]}>
                <Text style={styles.navBtnTextPrimary}>
                  {currentStepIndex + 1 === CLOCK_LESSONS.length
                    ? 'Start Challenges 🎯'
                    : 'Next Step ▶'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* MODE 2: Interactive Challenges */}
        {mode === 'challenges' && (
          <View style={styles.challengeWrap}>
            {/* Challenge header card */}
            <View style={styles.challengeCard}>
              <Text style={styles.challengePrompt}>
                {t(
                  challenge.promptKey,
                  `Set the clock hands to ${challenge.targetHour}:${
                    challenge.targetMinute === 0 ? '00' : challenge.targetMinute
                  }!`,
                )}
              </Text>
              <Text style={styles.challengeSub}>
                Drag the short hour hand and long minute hand!
              </Text>
            </View>

            {/* Clock with target evaluation */}
            <InteractiveClock
              key={`challenge-${challenge.id}`}
              hour={12}
              minute={0}
              targetHour={challenge.targetHour}
              targetMinute={challenge.targetMinute}
              isInteractive={true}
              showDigitalTime={true}
              showControls={true}
              onMatchSuccess={handleChallengeSuccess}
              size={260}
            />

            {challengeSolved && (
              <View style={styles.solvedCard}>
                <Text style={styles.solvedTitle}>🎉 Awesome Job!</Text>
                <Text style={styles.solvedExplanation}>
                  {t(
                    challenge.explanationKey,
                    'You placed the hands at the exact right position!',
                  )}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleNextChallenge}
                  style={styles.nextChallengeBtn}>
                  <Text style={styles.nextChallengeBtnText}>
                    {currentChallengeIndex + 1 === CLOCK_CHALLENGES.length
                      ? 'Finish & Celebrate 🏆'
                      : 'Next Challenge ▶'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* MODE 3: Free Play Sandbox */}
        {mode === 'sandbox' && (
          <View style={styles.sandboxWrap}>
            <View style={styles.sandboxCard}>
              <Text style={styles.sandboxTitle}>🕹️ Clock Explorer</Text>
              <Text style={styles.sandboxSub}>
                Drag any hand around the dial to see the time, day part, and
                routine!
              </Text>
            </View>

            <InteractiveClock
              hour={3}
              minute={0}
              isInteractive={true}
              showDigitalTime={true}
              showDayPartTag={true}
              showControls={true}
              size={270}
            />
          </View>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    gap: 4,
    marginBottom: 8,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  modeTabTextActive: {
    color: '#1D4ED8',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  guidedWrap: {
    gap: 14,
    alignItems: 'center',
  },
  lessonCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#93C5FD',
    gap: 6,
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  lessonExplanation: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  navRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimary: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  navBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  navBtnTextSecondary: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '800',
  },
  challengeWrap: {
    gap: 14,
    alignItems: 'center',
  },
  challengeCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    gap: 4,
  },
  challengePrompt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1D4ED8',
    textAlign: 'center',
  },
  challengeSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  solvedCard: {
    width: '100%',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  solvedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
  },
  solvedExplanation: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 18,
  },
  nextChallengeBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 4,
  },
  nextChallengeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  sandboxWrap: {
    gap: 14,
    alignItems: 'center',
  },
  sandboxCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    gap: 4,
  },
  sandboxTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sandboxSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
