import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LOOP_CHALLENGES} from '../../domain/catalog/codingData';
import type {LoopChallenge} from '../../domain/entities/codingEntities';

interface RepetitionLoopsGameProps {
  readonly onComplete?: (stars: number) => void;
}

export function RepetitionLoopsGame({onComplete}: RepetitionLoopsGameProps) {
  const {t} = useTranslation();
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(
    null,
  );
  const [isAnswered, setIsAnswered] = useState<boolean | null>(null);

  const challenge: LoopChallenge =
    LOOP_CHALLENGES[challengeIdx] ?? LOOP_CHALLENGES[0]!;

  const handleSelectOption = (idx: number) => {
    setSelectedOptionIdx(idx);
    const opt = challenge.options[idx];
    if (opt?.isCorrect) {
      setIsAnswered(true);
      onComplete?.(3);
    } else {
      setIsAnswered(false);
    }
  };

  const handleNextChallenge = () => {
    setChallengeIdx(i => (i + 1) % LOOP_CHALLENGES.length);
    setSelectedOptionIdx(null);
    setIsAnswered(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Challenge Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {LOOP_CHALLENGES.map((ch, idx) => {
          const isSelected = idx === challengeIdx;
          return (
            <Pressable
              key={ch.id}
              accessibilityRole="button"
              onPress={() => {
                setChallengeIdx(idx);
                setSelectedOptionIdx(null);
                setIsAnswered(null);
              }}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                {ch.themeEmoji} Loop {idx + 1}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Concept Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          🔁 {t('coding.loops.conceptTitle', 'What is a Repeat Loop?')}
        </Text>
        <Text style={styles.cardText}>
          {t(
            'coding.loops.conceptText',
            'When an action happens over and over, we use a Repeat Loop so we do not have to write the same command many times!',
          )}
        </Text>

        {/* Visual Comparison: Long Code vs Loop Code */}
        <View style={styles.comparisonBox}>
          <View style={styles.comparisonRow}>
            <Text style={styles.compLabel}>Long Code:</Text>
            <View style={styles.unrolledRow}>
              {Array.from({length: challenge.repeatCount}).map((_, i) => (
                <View key={`long-${i}`} style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>
                    {challenge.loopCommand === 'up'
                      ? '⬆️'
                      : challenge.loopCommand === 'jump'
                      ? '🦘'
                      : challenge.loopCommand === 'grab'
                      ? '⛏️'
                      : '➡️'}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.arrowDown}>⬇️ is the same as ⬇️</Text>

          <View style={styles.loopHighlightBox}>
            <Text style={styles.loopBoxText}>
              🔁 Repeat{' '}
              <Text style={styles.bold}>{challenge.repeatCount} times</Text>:{' '}
              {challenge.loopCommand === 'up'
                ? '⬆️ Move Up'
                : challenge.loopCommand === 'jump'
                ? '🦘 Jump'
                : challenge.loopCommand === 'grab'
                ? '⛏️ Grab'
                : '➡️ Move Right'}
            </Text>
          </View>
        </View>

        {/* Target Question */}
        <View style={styles.questionBox}>
          <Text style={styles.questionTitle}>
            🎯 Which Loop block matches the action above?
          </Text>

          {/* Option Choices */}
          <View style={styles.optionsList}>
            {challenge.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              let optStyle = styles.optionBtn;
              if (isSelected && isAnswered === true) {
                optStyle = styles.optionBtnCorrect;
              } else if (isSelected && isAnswered === false) {
                optStyle = styles.optionBtnWrong;
              }

              return (
                <Pressable
                  key={`opt-${idx}`}
                  accessibilityRole="button"
                  onPress={() => handleSelectOption(idx)}
                  style={optStyle}>
                  <View style={styles.repeatBadge}>
                    <Text style={styles.repeatBadgeText}>🔁 {opt.count}x</Text>
                  </View>
                  <Text style={styles.optionCmdText}>
                    {opt.cmd === 'up'
                      ? '⬆️ Up'
                      : opt.cmd === 'jump'
                      ? '🦘 Jump'
                      : opt.cmd === 'grab'
                      ? '⛏️ Grab'
                      : '➡️ Right'}
                  </Text>
                  {isSelected && isAnswered === true && (
                    <Text style={styles.checkIcon}>✅</Text>
                  )}
                  {isSelected && isAnswered === false && (
                    <Text style={styles.checkIcon}>❌</Text>
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
              🎉 Awesome! You mastered the Repeat Loop!
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextChallenge}
              style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>Next Loop Challenge ❯</Text>
            </Pressable>
          </View>
        )}

        {isAnswered === false && (
          <View style={styles.feedbackWrong}>
            <Text style={styles.feedbackWrongText}>
              ❌ Count the icons again! How many times does it repeat?
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
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
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
  comparisonBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    gap: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  compLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  unrolledRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  stepBadgeText: {
    fontSize: 18,
  },
  arrowDown: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  loopHighlightBox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  loopBoxText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
  },
  bold: {
    fontWeight: '900',
  },
  questionBox: {
    gap: 10,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  optionsList: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  optionBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  repeatBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  repeatBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  optionCmdText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  checkIcon: {
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
    backgroundColor: '#F59E0B',
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
