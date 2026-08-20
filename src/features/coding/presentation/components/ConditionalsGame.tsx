import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CONDITION_SCENARIOS} from '../../domain/catalog/codingData';
import type {ConditionScenario} from '../../domain/entities/codingEntities';

interface ConditionalsGameProps {
  readonly onComplete?: (stars: number) => void;
}

export function ConditionalsGame({onComplete}: ConditionalsGameProps) {
  const {t} = useTranslation();
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [selectedThenIdx, setSelectedThenIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean | null>(null);

  const scenario: ConditionScenario =
    CONDITION_SCENARIOS[scenarioIdx] ?? CONDITION_SCENARIOS[0]!;

  // Build choice list (1 correct + 2 distractors)
  const choices = [
    {
      id: 'correct',
      textKey: scenario.correctThenKey,
      icon: scenario.correctThenIcon,
      isCorrect: true,
    },
    ...scenario.distractorThens.map((d, i) => ({
      id: `distractor-${i}`,
      textKey: d.textKey,
      icon: d.icon,
      isCorrect: false,
    })),
  ];

  const handleSelectChoice = (idx: number, isCorrectChoice: boolean) => {
    setSelectedThenIdx(idx);
    if (isCorrectChoice) {
      setIsAnswered(true);
      onComplete?.(3);
    } else {
      setIsAnswered(false);
    }
  };

  const handleNextScenario = () => {
    setScenarioIdx(i => (i + 1) % CONDITION_SCENARIOS.length);
    setSelectedThenIdx(null);
    setIsAnswered(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Scenario Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {CONDITION_SCENARIOS.map((sc, idx) => {
          const isSelected = idx === scenarioIdx;
          return (
            <Pressable
              key={sc.id}
              accessibilityRole="button"
              onPress={() => {
                setScenarioIdx(idx);
                setSelectedThenIdx(null);
                setIsAnswered(null);
              }}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                {sc.ifIcon} Rule {idx + 1}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          ❓ {t('coding.conditionals.title', 'If / Then Decision Rules')}
        </Text>
        <Text style={styles.cardText}>
          {t(
            'coding.conditionals.intro',
            'Computers use IF / THEN rules to make smart decisions. IF a condition happens, THEN take the right action!',
          )}
        </Text>

        {/* The IF Condition Display Box */}
        <View style={styles.ifBox}>
          <View style={styles.ifBadge}>
            <Text style={styles.ifBadgeText}>IF (Condition):</Text>
          </View>
          <Text style={styles.ifIconBig}>{scenario.ifIcon}</Text>
          <Text style={styles.ifConditionText}>
            {t(scenario.ifConditionKey, '')}
          </Text>
        </View>

        <Text style={styles.arrowLabel}>⬇️ What should happen NEXT? ⬇️</Text>

        {/* The THEN Action Choices */}
        <View style={styles.thenSection}>
          <View style={styles.thenBadge}>
            <Text style={styles.thenBadgeText}>THEN (Action):</Text>
          </View>

          <View style={styles.choicesList}>
            {choices.map((choice, idx) => {
              const isSelected = selectedThenIdx === idx;
              let btnStyle = styles.choiceBtn;
              if (isSelected && isAnswered === true) {
                btnStyle = styles.choiceBtnCorrect;
              } else if (isSelected && isAnswered === false) {
                btnStyle = styles.choiceBtnWrong;
              }

              return (
                <Pressable
                  key={choice.id}
                  accessibilityRole="button"
                  onPress={() => handleSelectChoice(idx, choice.isCorrect)}
                  style={btnStyle}>
                  <Text style={styles.choiceEmoji}>{choice.icon}</Text>
                  <Text style={styles.choiceText}>{t(choice.textKey, '')}</Text>
                  {isSelected && isAnswered === true && (
                    <Text style={styles.checkMark}>✅</Text>
                  )}
                  {isSelected && isAnswered === false && (
                    <Text style={styles.checkMark}>❌</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Feedback Banner */}
        {isAnswered === true && (
          <View style={styles.feedbackSuccess}>
            <Text style={styles.feedbackSuccessText}>
              🎉 Spot on! That is the exact correct THEN decision!
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextScenario}
              style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>Next IF/THEN Rule ❯</Text>
            </Pressable>
          </View>
        )}

        {isAnswered === false && (
          <View style={styles.feedbackWrong}>
            <Text style={styles.feedbackWrongText}>
              ❌ Think about what makes the most sense for this scenario!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
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
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: '#EC4899',
    borderColor: '#DB2777',
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
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  ifBox: {
    backgroundColor: '#FDF2F8',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F472B6',
    alignItems: 'center',
    gap: 6,
  },
  ifBadge: {
    backgroundColor: '#DB2777',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ifBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ifIconBig: {
    fontSize: 40,
  },
  ifConditionText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#831843',
    textAlign: 'center',
  },
  arrowLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9D174D',
    textAlign: 'center',
  },
  thenSection: {
    gap: 10,
  },
  thenBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  thenBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  choicesList: {
    gap: 8,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  choiceBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  choiceBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  choiceEmoji: {
    fontSize: 26,
  },
  choiceText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  checkMark: {
    fontSize: 18,
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
  },
  feedbackSuccessText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  feedbackWrong: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  feedbackWrongText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
  },
});
