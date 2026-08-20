import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  EMOTIONS_LIST,
  EMOTION_SCENARIOS,
} from '../../domain/catalog/lifeSkillsData';
import type {
  EmotionItem,
  EmotionScenario,
} from '../../domain/entities/lifeSkillsEntities';

interface EmotionsExplorerProps {
  readonly onExploreEmotion?: (emotionId: string) => void;
  readonly onComplete?: (stars: number) => void;
}

export function EmotionsExplorer({
  onExploreEmotion,
  onComplete,
}: EmotionsExplorerProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'wheel' | 'scenarios'>('wheel');
  const [selectedEmotionIdx, setSelectedEmotionIdx] = useState<number>(0);
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isScenarioCorrect, setIsScenarioCorrect] = useState<boolean | null>(
    null,
  );

  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentEmotion: EmotionItem =
    EMOTIONS_LIST[selectedEmotionIdx] ?? EMOTIONS_LIST[0]!;
  const currentScenario: EmotionScenario =
    EMOTION_SCENARIOS[scenarioIdx] ?? EMOTION_SCENARIOS[0]!;

  const triggerBounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.25,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceAnim]);

  const handleSelectEmotion = (idx: number) => {
    setSelectedEmotionIdx(idx);
    triggerBounce();
    const emo = EMOTIONS_LIST[idx];
    if (emo) {
      onExploreEmotion?.(emo.id);
    }
  };

  const handleSelectScenarioChoice = (optId: string) => {
    if (selectedOptionId !== null) {
      return;
    }
    setSelectedOptionId(optId);
    const isRight = optId === currentScenario.correctEmotionId;
    setIsScenarioCorrect(isRight);

    if (isRight && scenarioIdx + 1 >= EMOTION_SCENARIOS.length) {
      onComplete?.(3);
    }
  };

  const handleNextScenario = () => {
    setScenarioIdx(i => (i + 1) % EMOTION_SCENARIOS.length);
    setSelectedOptionId(null);
    setIsScenarioCorrect(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Mode Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('wheel')}
          style={[styles.tabBtn, activeTab === 'wheel' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'wheel' && styles.tabBtnTextActive,
            ]}>
            😊 {t('lifeSkills.emotions.tabWheel', 'Explore Emotions')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => setActiveTab('scenarios')}
          style={[
            styles.tabBtn,
            activeTab === 'scenarios' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'scenarios' && styles.tabBtnTextActive,
            ]}>
            🎯 {t('lifeSkills.emotions.tabScenarios', 'Feeling Scenarios')}
          </Text>
        </Pressable>
      </View>

      {/* Tab 1: Explore Emotions */}
      {activeTab === 'wheel' && (
        <View style={styles.wheelSection}>
          {/* Strip of Emotions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.strip}>
            {EMOTIONS_LIST.map((emo, idx) => {
              const isSelected = idx === selectedEmotionIdx;
              return (
                <Pressable
                  key={emo.id}
                  accessibilityRole="button"
                  onPress={() => handleSelectEmotion(idx)}
                  style={[
                    styles.pill,
                    isSelected && {
                      backgroundColor: emo.color,
                      borderColor: emo.color,
                    },
                  ]}>
                  <Text style={styles.pillEmoji}>{emo.emoji}</Text>
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected,
                    ]}>
                    {t(emo.nameKey, emo.id)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Main Emotion Card */}
          <View style={[styles.card, {borderColor: currentEmotion.color}]}>
            <View
              style={[
                styles.emojiStage,
                {backgroundColor: `${currentEmotion.color}20`},
              ]}>
              <Animated.Text
                style={[styles.bigEmoji, {transform: [{scale: bounceAnim}]}]}>
                {currentEmotion.emoji}
              </Animated.Text>
            </View>

            <Text style={[styles.title, {color: currentEmotion.color}]}>
              {t(currentEmotion.nameKey, currentEmotion.id)}
            </Text>

            <Text style={styles.desc}>
              {t(currentEmotion.descriptionKey, '')}
            </Text>

            {/* Comforting & Helpful Tip */}
            <View style={styles.comfortBox}>
              <Text style={styles.comfortTitle}>
                ❤️ When you feel this way:
              </Text>
              <Text style={styles.comfortText}>
                {t(currentEmotion.comfortingTipKey, '')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Tab 2: Scenarios */}
      {activeTab === 'scenarios' && (
        <View style={styles.card}>
          <Text style={styles.scenarioCounter}>
            Scenario {scenarioIdx + 1} of {EMOTION_SCENARIOS.length}
          </Text>

          <View style={styles.scenarioEmojiBox}>
            <Text style={styles.scenarioBigEmoji}>
              {currentScenario.scenarioEmoji}
            </Text>
          </View>

          <Text style={styles.storyText}>
            {t(currentScenario.storyKey, '')}
          </Text>
          <Text style={styles.questionPrompt}>
            👉 How does the child feel in this situation?
          </Text>

          {/* 3 Emotion Options */}
          <View style={styles.optionsRow}>
            {currentScenario.options.map(optId => {
              const emo = EMOTIONS_LIST.find(e => e.id === optId);
              if (!emo) {
                return null;
              }

              const isSelected = selectedOptionId === optId;
              let btnStyle = styles.optBtn;
              if (isSelected && isScenarioCorrect === true) {
                btnStyle = styles.optBtnCorrect;
              } else if (isSelected && isScenarioCorrect === false) {
                btnStyle = styles.optBtnWrong;
              }

              return (
                <Pressable
                  key={optId}
                  accessibilityRole="button"
                  onPress={() => handleSelectScenarioChoice(optId)}
                  style={btnStyle}>
                  <Text style={styles.optEmoji}>{emo.emoji}</Text>
                  <Text style={styles.optName}>{t(emo.nameKey, emo.id)}</Text>
                  {isSelected && isScenarioCorrect === true && (
                    <Text style={styles.badge}>✅</Text>
                  )}
                  {isSelected && isScenarioCorrect === false && (
                    <Text style={styles.badge}>💛</Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Feedback Banner */}
          {isScenarioCorrect === true && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>
                🎉 Great empathy! {t(currentScenario.explanationKey, '')}
              </Text>
              {scenarioIdx + 1 < EMOTION_SCENARIOS.length && (
                <Pressable
                  accessibilityRole="button"
                  onPress={handleNextScenario}
                  style={styles.nextBtn}>
                  <Text style={styles.nextBtnText}>Next Story ❯</Text>
                </Pressable>
              )}
            </View>
          )}

          {isScenarioCorrect === false && (
            <View style={styles.hintBanner}>
              <Text style={styles.hintText}>
                💛 That is understandable! Look at the story clues again.
              </Text>
            </View>
          )}
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
    color: '#EC4899',
  },
  wheelSection: {
    gap: 12,
  },
  strip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  pillEmoji: {
    fontSize: 18,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emojiStage: {
    height: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: {
    fontSize: 68,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  comfortBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    gap: 4,
  },
  comfortTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#BE123C',
  },
  comfortText: {
    fontSize: 13,
    color: '#881337',
    lineHeight: 18,
  },
  scenarioCounter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  scenarioEmojiBox: {
    backgroundColor: '#FDF2F8',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F472B6',
  },
  scenarioBigEmoji: {
    fontSize: 48,
  },
  storyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 22,
  },
  questionPrompt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  optBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optBtnWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  optEmoji: {
    fontSize: 28,
  },
  optName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
  },
  badge: {
    fontSize: 12,
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
  },
  successText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
    lineHeight: 18,
  },
  nextBtn: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  hintBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
  },
});
