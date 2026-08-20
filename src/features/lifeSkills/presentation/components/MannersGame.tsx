import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MANNERS_SCENARIOS} from '../../domain/catalog/lifeSkillsData';
import type {MannersScenario} from '../../domain/entities/lifeSkillsEntities';

interface MannersGameProps {
  readonly onScenarioSolved?: () => void;
  readonly onComplete?: (stars: number) => void;
}

export function MannersGame({onScenarioSolved, onComplete}: MannersGameProps) {
  const {t} = useTranslation();
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    textKey: string;
  } | null>(null);

  const scenario: MannersScenario =
    MANNERS_SCENARIOS[scenarioIdx] ?? MANNERS_SCENARIOS[0]!;

  const handleSelectOption = (
    optId: string,
    isCorrect: boolean,
    feedbackKey: string,
  ) => {
    if (selectedOptionId !== null) {
      return;
    }
    setSelectedOptionId(optId);
    setFeedback({correct: isCorrect, textKey: feedbackKey});

    if (isCorrect) {
      onScenarioSolved?.();
      if (scenarioIdx + 1 >= MANNERS_SCENARIOS.length) {
        onComplete?.(3);
      }
    }
  };

  const handleNext = () => {
    setScenarioIdx(i => (i + 1) % MANNERS_SCENARIOS.length);
    setSelectedOptionId(null);
    setFeedback(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {MANNERS_SCENARIOS.map((s, idx) => {
          const isSelected = idx === scenarioIdx;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              onPress={() => {
                setScenarioIdx(idx);
                setSelectedOptionId(null);
                setFeedback(null);
              }}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                🤝 {t(s.titleKey, `Manner ${idx + 1}`)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.tag}>
            Manner Story {scenarioIdx + 1} of {MANNERS_SCENARIOS.length}
          </Text>
        </View>

        {/* Scene Emoji */}
        <View style={styles.sceneBox}>
          <Text style={styles.sceneEmoji}>{scenario.scenarioEmoji}</Text>
        </View>

        <Text style={styles.title}>{t(scenario.titleKey, '')}</Text>
        <Text style={styles.story}>{t(scenario.storyKey, '')}</Text>

        <Text style={styles.prompt}>
          👉 What is the kind and polite choice?
        </Text>

        {/* Options */}
        <View style={styles.optionsList}>
          {scenario.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = styles.optBtn;
            if (isSelected && opt.isCorrect) {
              optStyle = styles.optBtnCorrect;
            } else if (isSelected && !opt.isCorrect) {
              optStyle = styles.optBtnWrong;
            }

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                onPress={() =>
                  handleSelectOption(opt.id, opt.isCorrect, opt.feedbackKey)
                }
                style={optStyle}>
                <Text style={styles.optText}>{t(opt.textKey, '')}</Text>
                {isSelected && opt.isCorrect && (
                  <Text style={styles.badge}>✅ Super Kind!</Text>
                )}
                {isSelected && !opt.isCorrect && (
                  <Text style={styles.badge}>💛 Helpful Hint</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Feedback Banner */}
        {feedback && (
          <View
            style={[
              styles.feedbackBanner,
              feedback.correct ? styles.feedbackSuccess : styles.feedbackHint,
            ]}>
            <Text
              style={[
                styles.feedbackText,
                feedback.correct
                  ? styles.feedbackTextSuccess
                  : styles.feedbackTextHint,
              ]}>
              {feedback.correct ? '🌟 ' : '💡 '}
              {t(feedback.textKey, '')}
            </Text>
          </View>
        )}

        {/* Next Button */}
        {feedback?.correct && scenarioIdx + 1 < MANNERS_SCENARIOS.length && (
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next Story ❯</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  strip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  sceneBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  sceneEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  story: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  prompt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'center',
  },
  optionsList: {
    gap: 10,
  },
  optBtn: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optBtnWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  optText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  badge: {
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 8,
  },
  feedbackBanner: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  feedbackHint: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  feedbackTextSuccess: {
    color: '#166534',
  },
  feedbackTextHint: {
    color: '#92400E',
  },
  nextBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
