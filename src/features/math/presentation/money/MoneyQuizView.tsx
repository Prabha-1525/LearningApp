import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MONEY_QUIZ_QUESTIONS} from '../../domain/money/moneyData';
import {CoinView} from './CoinView';
import {NoteView} from './NoteView';
import type {MoneyQuizQuestion} from '../../domain/money/types';

interface MoneyQuizViewProps {
  onFinishQuiz?: (score: number) => void;
}

export function MoneyQuizView({onFinishQuiz}: MoneyQuizViewProps) {
  const {t} = useTranslation();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const totalQuestions = MONEY_QUIZ_QUESTIONS.length;
  const question: MoneyQuizQuestion =
    MONEY_QUIZ_QUESTIONS[currentIdx] ?? MONEY_QUIZ_QUESTIONS[0]!;

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      onFinishQuiz?.(score + (selectedOptionId ? 1 : 0));
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const selectedOpt = question.options.find(o => o.id === selectedOptionId);
  const isSelectedCorrect = selectedOpt?.isCorrect ?? false;

  if (quizFinished) {
    return (
      <View style={styles.resultCard}>
        <Text style={styles.resultEmoji}>🏆 🎉</Text>
        <Text style={styles.resultTitle}>Quiz Completed!</Text>
        <Text style={styles.resultScore}>
          You scored {score} out of {totalQuestions}!
        </Text>
        <View style={styles.starsRow}>
          {score >= 8 ? (
            <Text style={styles.starText}>⭐⭐⭐ Master of Money!</Text>
          ) : score >= 5 ? (
            <Text style={styles.starText}>⭐⭐ Great Effort!</Text>
          ) : (
            <Text style={styles.starText}>⭐ Keep Practicing!</Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleRestart}
          style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Play Again ↺</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Quiz Card */}
      <View style={styles.card}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {currentIdx + 1} of {totalQuestions}
          </Text>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillText}>⭐ {score} Correct</Text>
          </View>
        </View>

        {/* Visual Cue (Coins or Notes) if present */}
        {question.coins && question.coins.length > 0 && (
          <View style={styles.visualRow}>
            {question.coins.map((c, i) => (
              <CoinView key={`qc-${i}`} value={c} size={58} showLabel />
            ))}
          </View>
        )}

        {question.notes && question.notes.length > 0 && (
          <View style={styles.visualRow}>
            {question.notes.map((n, i) => (
              <NoteView key={`qn-${i}`} value={n} width={135} />
            ))}
          </View>
        )}

        <Text style={styles.questionTitle}>
          {t(
            question.questionKey,
            'Look at the money and pick the correct answer:',
          )}
        </Text>

        {/* Options */}
        <View style={styles.optionsList}>
          {question.options.map(opt => {
            const isPicked = selectedOptionId === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                disabled={isAnswered}
                onPress={() => handleSelectOption(opt.id, opt.isCorrect)}
                style={[
                  styles.optionItem,
                  isPicked &&
                    (opt.isCorrect
                      ? styles.optionItemCorrect
                      : styles.optionItemWrong),
                ]}>
                <Text
                  style={[
                    styles.optionText,
                    isPicked &&
                      (opt.isCorrect
                        ? styles.optionTextCorrect
                        : styles.optionTextWrong),
                  ]}>
                  {opt.text ?? t(opt.labelKey ?? '', '')}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Explanation and Next Button */}
        {isAnswered && (
          <View style={styles.explanationSection}>
            <View
              style={[
                styles.feedbackBox,
                isSelectedCorrect
                  ? styles.feedbackBoxCorrect
                  : styles.feedbackBoxWrong,
              ]}>
              <Text style={styles.feedbackTitle}>
                {isSelectedCorrect ? '🎉 Correct!' : '💡 Tip:'}
              </Text>
              <Text style={styles.feedbackDesc}>
                {t(
                  question.explanationKey,
                  'Count carefully and inspect the values!',
                )}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleNext}
              style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>
                {currentIdx < totalQuestions - 1
                  ? 'Next Question ❯'
                  : 'See Results 🏆'}
              </Text>
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
    gap: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  scorePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  optionsList: {
    gap: 10,
  },
  optionItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  optionItemCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionItemWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  optionTextCorrect: {
    color: '#065F46',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  explanationSection: {
    gap: 10,
    marginTop: 4,
  },
  feedbackBox: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    gap: 4,
  },
  feedbackBoxCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  feedbackBoxWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  feedbackDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  resultEmoji: {
    fontSize: 48,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#065F46',
  },
  resultScore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },
  starsRow: {
    paddingVertical: 4,
  },
  starText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#B45309',
  },
  retryBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
