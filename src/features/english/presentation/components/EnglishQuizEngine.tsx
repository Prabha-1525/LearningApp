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
import type {EnglishQuizQuestion} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface EnglishQuizEngineProps {
  readonly questions: readonly EnglishQuizQuestion[];
  readonly accentColor?: string;
  readonly onFinish: (score: number, stars: number) => void;
}

export function EnglishQuizEngine({
  questions,
  accentColor = '#3B82F6',
  onFinish,
}: EnglishQuizEngineProps) {
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
        englishAudio.playSuccessChime();
      } else {
        englishAudio.playTryAgainTone();
      }

      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.08,
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

  const handlePlayPromptAudio = () => {
    if (currentQ?.targetAudio) {
      englishAudio.speak(currentQ.targetAudio);
    } else {
      englishAudio.speak(currentQ.prompt);
    }
  };

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
        stars = 1;
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
        <Text style={styles.questionText}>{currentQ.prompt}</Text>

        {/* Audio Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Play question audio"
          onPress={handlePlayPromptAudio}
          style={styles.audioHintBtn}>
          <Text style={styles.audioHintText}>🔊 Listen to Question</Text>
        </Pressable>
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
              accessibilityLabel={opt.text}
              disabled={answered}
              onPress={() => handleSelectOption(opt.id, opt.isCorrect)}
              style={[
                styles.optionBtn,
                isSelected && styles.optionSelected,
                showSuccess && styles.optionSuccess,
                showWrong && styles.optionWrong,
              ]}>
              <View style={styles.optionRow}>
                {opt.emoji ? (
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                ) : null}
                <Text
                  style={[
                    styles.optionText,
                    showSuccess && styles.textSuccess,
                    showWrong && styles.textWrong,
                  ]}>
                  {opt.text}
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
              ? t('english.feedbackGreat', '🌟 Excellent Reading!')
              : t('english.feedbackKeepLearning', '💡 Good Try! Remember:')}
          </Text>
          <Text style={styles.feedbackExp}>{currentQ.explanation}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={[styles.nextBtn, {backgroundColor: accentColor}]}>
            <Text style={styles.nextBtnText}>
              {isLast
                ? t('english.seeResults', 'See Results ⭐')
                : t('english.nextQuestion', 'Next Question ➔')}
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
    borderRadius: 22,
    borderWidth: 2.5,
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
    fontSize: 48,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 25,
  },
  audioHintBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  audioHintText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
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
  optionEmoji: {
    fontSize: 26,
  },
  optionText: {
    fontSize: 16,
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
    fontSize: 16,
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
