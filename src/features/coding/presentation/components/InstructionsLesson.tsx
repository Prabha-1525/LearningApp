import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COMMAND_METAS} from '../../domain/catalog/codingData';
import type {CodingCommand} from '../../domain/entities/codingEntities';

interface InstructionsLessonProps {
  readonly onComplete?: (stars: number) => void;
}

export function InstructionsLesson({onComplete}: InstructionsLessonProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');
  const [selectedCmd, setSelectedCmd] = useState<CodingCommand>('right');
  const [robotSteps, setRobotSteps] = useState<number>(0);
  const [practiceQIndex, setPracticeQIndex] = useState<number>(0);
  const [practiceFeedback, setPracticeFeedback] = useState<{
    correct: boolean;
    msg: string;
  } | null>(null);

  const practiceQuestions = [
    {
      prompt: 'Robot wants to reach the 🍎 above it. Which direction?',
      correctCmd: 'up' as CodingCommand,
      emoji: '🍎',
      directionHint: 'UP',
    },
    {
      prompt: 'Robot wants to reach the 🍌 on the right. Which direction?',
      correctCmd: 'right' as CodingCommand,
      emoji: '🍌',
      directionHint: 'RIGHT',
    },
    {
      prompt: 'Robot wants to reach the 🍇 below it. Which direction?',
      correctCmd: 'down' as CodingCommand,
      emoji: '🍇',
      directionHint: 'DOWN',
    },
    {
      prompt: 'Robot wants to reach the 🍓 on the left. Which direction?',
      correctCmd: 'left' as CodingCommand,
      emoji: '🍓',
      directionHint: 'LEFT',
    },
  ];

  const handleTestStep = (cmd: CodingCommand) => {
    setSelectedCmd(cmd);
    setRobotSteps(prev => (prev + 1) % 5);
  };

  const handlePracticeAnswer = (cmd: CodingCommand) => {
    const q = practiceQuestions[practiceQIndex];
    if (!q) {
      return;
    }
    const isCorrect = cmd === q.correctCmd;

    if (isCorrect) {
      setPracticeFeedback({
        correct: true,
        msg: `🎉 Super! ${cmd.toUpperCase()} is the exact right command!`,
      });
      setTimeout(() => {
        setPracticeFeedback(null);
        if (practiceQIndex + 1 < practiceQuestions.length) {
          setPracticeQIndex(i => i + 1);
        } else {
          onComplete?.(3);
        }
      }, 1500);
    } else {
      setPracticeFeedback({
        correct: false,
        msg: `💡 Look closely at the arrow pointing towards the ${q.emoji}!`,
      });
    }
  };

  const currentQ = practiceQuestions[practiceQIndex] ?? practiceQuestions[0]!;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Mode Switcher Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('learn')}
          style={[styles.tabBtn, activeTab === 'learn' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'learn' && styles.tabBtnTextActive,
            ]}>
            🧭 {t('coding.instructions.tabLearn', 'Learn Directions')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('practice')}
          style={[
            styles.tabBtn,
            activeTab === 'practice' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'practice' && styles.tabBtnTextActive,
            ]}>
            🎯 {t('coding.instructions.tabPractice', 'Direction Match')}
          </Text>
        </Pressable>
      </View>

      {/* Tab 1: Learn Directions */}
      {activeTab === 'learn' && (
        <View style={styles.contentWrap}>
          {/* Intro Card */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>
              🤖 What are Coding Instructions?
            </Text>
            <Text style={styles.introText}>
              A robot only does what you tell it to do! We give it one clear
              instruction at a time using direction arrows.
            </Text>
          </View>

          {/* Direction Cards Showcase */}
          <View style={styles.commandCardsGrid}>
            {COMMAND_METAS.slice(0, 4).map(meta => {
              const isSelected = selectedCmd === meta.id;
              return (
                <Pressable
                  key={meta.id}
                  accessibilityRole="button"
                  onPress={() => handleTestStep(meta.id)}
                  style={[
                    styles.cmdCard,
                    {borderColor: meta.color},
                    isSelected && styles.cmdCardSelected,
                    isSelected && {backgroundColor: `${meta.color}15`},
                  ]}>
                  <Text style={styles.cmdCardIcon}>{meta.icon}</Text>
                  <Text style={[styles.cmdCardTitle, {color: meta.color}]}>
                    {t(meta.labelKey, meta.id.toUpperCase())}
                  </Text>
                  <Text style={styles.cmdCardSub}>
                    {meta.id === 'up'
                      ? 'Move 1 step North'
                      : meta.id === 'down'
                      ? 'Move 1 step South'
                      : meta.id === 'left'
                      ? 'Move 1 step West'
                      : 'Move 1 step East'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Interactive Step Runway */}
          <View style={styles.runwayCard}>
            <Text style={styles.runwayTitle}>
              🏃 Mini Step Runway (Tap any direction above!)
            </Text>
            <View style={styles.runwayTrack}>
              {Array.from({length: 5}).map((_, i) => {
                const hasRobot = i === robotSteps;
                const isTarget = i === 4;
                return (
                  <View key={`track-${i}`} style={styles.runwaySlot}>
                    {hasRobot && <Text style={styles.runwayRobot}>🤖</Text>}
                    {isTarget && !hasRobot && (
                      <Text style={styles.runwayTarget}>⭐</Text>
                    )}
                  </View>
                );
              })}
            </View>
            <Text style={styles.runwayFeedback}>
              Robot executed:{' '}
              <Text style={styles.boldAccent}>{selectedCmd.toUpperCase()}</Text>{' '}
              ({robotSteps} steps taken)
            </Text>
          </View>
        </View>
      )}

      {/* Tab 2: Practice Direction Match */}
      {activeTab === 'practice' && (
        <View style={styles.contentWrap}>
          <View style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizProgress}>
                Challenge {practiceQIndex + 1} / {practiceQuestions.length}
              </Text>
            </View>

            <Text style={styles.quizPrompt}>{currentQ.prompt}</Text>

            {/* Target Display Visual */}
            <View style={styles.targetPreviewBox}>
              <Text style={styles.targetBigEmoji}>{currentQ.emoji}</Text>
              <Text style={styles.targetHintText}>
                Direction: {currentQ.directionHint}
              </Text>
            </View>

            {practiceFeedback && (
              <View
                style={[
                  styles.feedbackBanner,
                  practiceFeedback.correct
                    ? styles.feedbackSuccess
                    : styles.feedbackError,
                ]}>
                <Text style={styles.feedbackText}>{practiceFeedback.msg}</Text>
              </View>
            )}

            {/* Arrow Choices */}
            <View style={styles.choicesGrid}>
              {COMMAND_METAS.slice(0, 4).map(meta => (
                <Pressable
                  key={meta.id}
                  accessibilityRole="button"
                  onPress={() => handlePracticeAnswer(meta.id)}
                  style={({pressed}) => [
                    styles.choiceBtn,
                    {borderColor: meta.color},
                    pressed && styles.choiceBtnPressed,
                  ]}>
                  <Text style={styles.choiceIcon}>{meta.icon}</Text>
                  <Text style={[styles.choiceText, {color: meta.color}]}>
                    {t(meta.labelKey, meta.id.toUpperCase())}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#3B82F6',
  },
  contentWrap: {
    gap: 14,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  introText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  commandCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cmdCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 4,
  },
  cmdCardSelected: {
    borderWidth: 2.5,
  },
  cmdCardIcon: {
    fontSize: 28,
  },
  cmdCardTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  cmdCardSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  runwayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
    alignItems: 'center',
  },
  runwayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  runwayTrack: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  runwaySlot: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runwayRobot: {
    fontSize: 26,
  },
  runwayTarget: {
    fontSize: 24,
  },
  runwayFeedback: {
    fontSize: 12,
    color: '#64748B',
  },
  boldAccent: {
    fontWeight: '900',
    color: '#3B82F6',
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizProgress: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  quizPrompt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  targetPreviewBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  targetBigEmoji: {
    fontSize: 48,
  },
  targetHintText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  feedbackBanner: {
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  feedbackError: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  choiceBtn: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    gap: 4,
  },
  choiceBtnPressed: {
    transform: [{scale: 0.96}],
  },
  choiceIcon: {
    fontSize: 26,
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '900',
  },
});
