import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsExerciseQuestion} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface PhonicsExerciseEngineProps {
  readonly questions: readonly PhonicsExerciseQuestion[];
  readonly accentColor?: string;
  readonly onComplete: (scorePercent: number, starsEarned: number) => void;
}

export function PhonicsExerciseEngine({
  questions,
  accentColor = '#3B82F6',
  onComplete,
}: PhonicsExerciseEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = questions[currentIdx] ?? questions[0]!;

  useEffect(() => {
    if (currentQ.audioPrompt) {
      phonicsAudio.speak(currentQ.audioPrompt);
    } else {
      phonicsAudio.speak(currentQ.prompt);
    }
  }, [currentIdx, currentQ]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctOption;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      phonicsAudio.playTone(600, 80);
      phonicsAudio.speak('Great blending! You got it!');
    } else {
      phonicsAudio.playTryAgain();
      phonicsAudio.speak('Almost! Look carefully at the sounds.');
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all questions
      const finalScore = Math.round(
        (correctCount / Math.max(1, questions.length)) * 100,
      );
      const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : 1;
      onComplete(finalScore, stars);
    }
  };

  return (
    <View style={[styles.card, {borderColor: accentColor}]}>
      {/* Progress Dots */}
      <View style={styles.topRow}>
        <Text style={styles.counterText}>
          Question {currentIdx + 1} of {questions.length}
        </Text>
        <View style={styles.dotsRow}>
          {questions.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIdx && {backgroundColor: accentColor, width: 18},
                idx < currentIdx && styles.dotDone,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Visual Emoji Clue */}
      {currentQ.visualEmoji && (
        <View style={styles.visualBox}>
          <Text style={styles.visualEmoji}>{currentQ.visualEmoji}</Text>
        </View>
      )}

      {/* Question Prompt */}
      <View style={styles.promptBox}>
        <Text style={styles.promptText}>{currentQ.prompt}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Listen question"
          onPress={() =>
            phonicsAudio.speak(currentQ.audioPrompt ?? currentQ.prompt)
          }
          style={styles.speakerBtn}>
          <Text style={styles.speakerIcon}>🔊</Text>
        </Pressable>
      </View>

      {/* Options Grid */}
      <View style={styles.optionsContainer}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentQ.correctOption;

          let btnStyle = styles.optionBtn;
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = [styles.optionBtn, styles.optionCorrect];
            } else if (isSelected) {
              btnStyle = [styles.optionBtn, styles.optionWrong];
            }
          }

          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Option ${opt}`}
              disabled={isAnswered}
              onPress={() => handleSelectOption(opt)}
              style={btnStyle}>
              <Text
                style={[
                  styles.optionText,
                  isAnswered && isCorrect && styles.optionTextCorrect,
                ]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Feedback Banner */}
      {isAnswered && (
        <View style={styles.feedbackWrap}>
          <Text style={styles.explanationText}>{currentQ.explanation}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              currentIdx === questions.length - 1
                ? 'Finish exercise'
                : 'Next question'
            }
            onPress={handleNext}
            style={[styles.continueBtn, {backgroundColor: accentColor}]}>
            <Text style={styles.continueBtnText}>
              {currentIdx === questions.length - 1
                ? 'Finish Exercise ⭐'
                : 'Next Question ➔'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3.5,
    padding: 20,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  dotDone: {
    backgroundColor: '#10B981',
  },
  visualBox: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualEmoji: {
    fontSize: 48,
  },
  promptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 24,
  },
  speakerBtn: {
    padding: 4,
  },
  speakerIcon: {
    fontSize: 20,
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
    marginVertical: 4,
  },
  optionBtn: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  optionTextCorrect: {
    color: '#065F46',
  },
  feedbackWrap: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  explanationText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
    textAlign: 'center',
  },
  continueBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
