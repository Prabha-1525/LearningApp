import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CHANGE_PUZZLES} from '../../domain/money/moneyData';
import {CoinView} from './CoinView';
import type {ChangePuzzle} from '../../domain/money/types';

interface ChangeCalculatorGameProps {
  onSuccess?: () => void;
}

export function ChangeCalculatorGame({onSuccess}: ChangeCalculatorGameProps) {
  const {t} = useTranslation();
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const puzzle: ChangePuzzle = CHANGE_PUZZLES[puzzleIdx] ?? CHANGE_PUZZLES[0]!;

  const handleSelectOption = (val: number) => {
    setSelectedOption(val);
    setIsAnswered(true);
    if (val === puzzle.changeAmount) {
      onSuccess?.();
    }
  };

  const handleNextPuzzle = () => {
    setPuzzleIdx(i => (i + 1) % CHANGE_PUZZLES.length);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const isCorrect = selectedOption === puzzle.changeAmount;

  return (
    <View style={styles.container}>
      {/* Puzzle Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.badgeText}>
            Puzzle {puzzleIdx + 1} of {CHANGE_PUZZLES.length}
          </Text>
          <Text style={styles.titleText}>💰 What Change Should You Get?</Text>
        </View>

        {/* Transaction Scenario */}
        <View style={styles.scenarioCard}>
          {/* Item & Price */}
          <View style={styles.scenarioCol}>
            <Text style={styles.colEmoji}>{puzzle.item.emoji}</Text>
            <Text style={styles.colLabel}>
              {t(puzzle.item.nameKey, puzzle.item.defaultName)}
            </Text>
            <View style={styles.costBadge}>
              <Text style={styles.costBadgeText}>
                Cost: ₹{puzzle.item.price}
              </Text>
            </View>
          </View>

          <Text style={styles.arrowIcon}>➔</Text>

          {/* Paid Money */}
          <View style={styles.scenarioCol}>
            <Text style={styles.colEmoji}>💵</Text>
            <Text style={styles.colLabel}>You Hand Over</Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidBadgeText}>
                Paid: ₹{puzzle.paidAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Question Prompt */}
        <Text style={styles.questionText}>
          You bought {puzzle.item.emoji} for{' '}
          <Text style={styles.boldNum}>₹{puzzle.item.price}</Text> and gave the
          shopkeeper <Text style={styles.boldNum}>₹{puzzle.paidAmount}</Text>.
        </Text>
        <Text style={styles.promptSub}>
          How much change should you get back?
        </Text>

        {/* Options Row */}
        <View style={styles.optionsRow}>
          {puzzle.options.map(opt => {
            const isOptSelected = selectedOption === opt;
            const isOptCorrect = opt === puzzle.changeAmount;
            return (
              <Pressable
                key={`opt-${opt}`}
                accessibilityRole="button"
                disabled={isAnswered}
                onPress={() => handleSelectOption(opt)}
                style={[
                  styles.optionBtn,
                  isOptSelected &&
                    (isOptCorrect ? styles.optionCorrect : styles.optionWrong),
                ]}>
                <Text style={styles.optionRupee}>₹</Text>
                <Text style={styles.optionValue}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Explanation & Feedback */}
        {isAnswered && (
          <View
            style={[
              styles.feedbackCard,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}>
            <Text style={styles.feedbackTitle}>
              {isCorrect
                ? '🎉 Correct Change!'
                : '❌ Let’s calculate together:'}
            </Text>
            <Text style={styles.feedbackMath}>
              ₹{puzzle.paidAmount} (Paid) - ₹{puzzle.item.price} (Cost) = ₹
              {puzzle.changeAmount} Change!
            </Text>
            <View style={styles.coinsVisualRow}>
              <Text style={styles.coinsVisualLabel}>Change in coins:</Text>
              <CoinView
                value={puzzle.changeAmount as any}
                size={46}
                showLabel
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleNextPuzzle}
              style={styles.nextPuzzleBtn}>
              <Text style={styles.nextPuzzleBtnText}>Next Change Puzzle ❯</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  headerRow: {
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  scenarioCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scenarioCol: {
    alignItems: 'center',
    gap: 4,
  },
  colEmoji: {
    fontSize: 34,
  },
  colLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  costBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  costBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  arrowIcon: {
    fontSize: 22,
    fontWeight: '900',
    color: '#94A3B8',
  },
  questionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '600',
  },
  boldNum: {
    fontWeight: '900',
    color: '#0F172A',
  },
  promptSub: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  optionBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  optionCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionRupee: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  optionValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  feedbackCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    gap: 8,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  feedbackWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  feedbackMath: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  coinsVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  coinsVisualLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  nextPuzzleBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 4,
  },
  nextPuzzleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
