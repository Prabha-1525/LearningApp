import React, {useCallback, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {GKLessonQuestion} from '../../domain/entities/gkEntities';

interface GKQuizEngineProps {
  readonly questions: readonly GKLessonQuestion[];
  readonly accentColor?: string;
  readonly onFinish: (score: number, stars: number) => void;
}

export function GKQuizEngine({
  questions,
  accentColor = '#10B981',
  onFinish,
}: GKQuizEngineProps) {
  const {t} = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelectOption = useCallback(
    (optionId: string, isCorrect: boolean) => {
      if (answered) return;
      setSelectedOptionId(optionId);
      setAnswered(true);

      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [answered, bounceAnim],
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      const finalScore = score;
      const total = questions.length;
      let stars = 1;
      if (finalScore >= total) {
        stars = 3;
      } else if (finalScore >= Math.ceil(total * 0.6)) {
        stars = 2;
      } else if (finalScore > 0) {
        stars = 1;
      } else {
        stars = 0;
      }
      onFinish(finalScore, stars);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setAnswered(false);
    }
  }, [isLast, onFinish, questions.length, score]);

  if (!currentQ) return null;

  const selectedOpt = currentQ.options.find(o => o.id === selectedOptionId);
  const isCorrectChoice = selectedOpt?.isCorrect ?? false;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {questions.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIndex && [
                styles.dotActive,
                {backgroundColor: accentColor},
              ],
              idx < currentIndex && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, {borderColor: accentColor}]}>
        {currentQ.promptEmoji ? (
          <Text style={styles.promptEmoji}>{currentQ.promptEmoji}</Text>
        ) : null}
        <Text style={styles.questionText}>
          {t(currentQ.questionKey, 'Question')}
        </Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {currentQ.options.map(opt => {
          const isSelected = selectedOptionId === opt.id;
          const showSuccess = answered && opt.isCorrect;
          const showWrong = answered && isSelected && !opt.isCorrect;

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityLabel={t(opt.textKey, '')}
              disabled={answered}
              onPress={() => handleSelectOption(opt.id, opt.isCorrect)}
              style={[
                styles.optionBtn,
                isSelected && styles.optionSelected,
                showSuccess && styles.optionSuccess,
                showWrong && styles.optionWrong,
              ]}>
              <View style={styles.optionRow}>
                {opt.icon ? (
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                ) : null}
                <Text
                  style={[
                    styles.optionText,
                    showSuccess && styles.textSuccess,
                    showWrong && styles.textWrong,
                  ]}>
                  {t(opt.textKey, '')}
                </Text>
              </View>
              {showSuccess && <Text style={styles.badgeEmoji}>✅</Text>}
              {showWrong && <Text style={styles.badgeEmoji}>💡</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Feedback Card */}
      {answered && (
        <Animated.View
          style={[
            styles.feedbackCard,
            isCorrectChoice ? styles.feedbackSuccess : styles.feedbackHelp,
            {transform: [{scale: bounceAnim}]},
          ]}>
          <Text style={styles.feedbackTitle}>
            {isCorrectChoice
              ? t('generalKnowledge.feedbackGreat', '🌟 Excellent Choice!')
              : t(
                  'generalKnowledge.feedbackKeepLearning',
                  '💡 Good thought! Remember:',
                )}
          </Text>
          <Text style={styles.feedbackExp}>
            {t(currentQ.explanationKey, '')}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={[styles.nextBtn, {backgroundColor: accentColor}]}>
            <Text style={styles.nextBtnText}>
              {isLast
                ? t('generalKnowledge.seeResults', 'See Results ⭐')
                : t('generalKnowledge.nextQuestion', 'Next Question ➔')}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    padding: 18,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  promptEmoji: {
    fontSize: 44,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsList: {
    width: '100%',
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  optionSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionWrong: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
    flex: 1,
  },
  textSuccess: {
    color: '#065F46',
  },
  textWrong: {
    color: '#92400E',
  },
  badgeEmoji: {
    fontSize: 20,
    marginLeft: 8,
  },
  feedbackCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  feedbackSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  feedbackHelp: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
  },
  feedbackExp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 6,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
