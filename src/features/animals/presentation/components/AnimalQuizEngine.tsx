import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalQuizQuestion} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalQuizEngineProps {
  readonly questions: readonly AnimalQuizQuestion[];
  readonly accentColor?: string;
  readonly onFinish: (score: number, stars: number) => void;
}

export function AnimalQuizEngine({
  questions,
  accentColor = '#F59E0B',
  onFinish,
}: AnimalQuizEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const cardScale = useRef(new Animated.Value(1)).current;

  const currentQ = questions[currentIdx] ?? questions[0]!;
  const isLast = currentIdx === questions.length - 1;

  useEffect(() => {
    if (currentQ?.promptAudio) {
      animalsAudio.speak(currentQ.promptAudio);
    }
  }, [currentIdx, currentQ]);

  const handleSelectOption = (opt: (typeof currentQ.options)[number]) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(opt.id);

    const isCorrect = opt.id === currentQ.answerId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(`Awesome! ${currentQ.explanation}`);

      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 1.08,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      animalsAudio.playTone(280, 150);
      animalsAudio.speak(`Nice try! ${currentQ.explanation}`);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedOptionId === currentQ.answerId ? 0 : 0);
      const total = questions.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onFinish(finalScore, stars);
    } else {
      setSelectedOptionId(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Pills */}
      <View style={styles.progressRow}>
        <Text style={styles.counterText}>
          Question {currentIdx + 1} of {questions.length}
        </Text>
        <View style={styles.pillsRow}>
          {questions.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.pill,
                idx === currentIdx && {backgroundColor: accentColor, width: 28},
                idx < currentIdx && styles.pillCompleted,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Main Question Card */}
      <Animated.View style={[styles.card, {transform: [{scale: cardScale}]}]}>
        {currentQ.targetEmoji && (
          <Text style={styles.targetEmoji}>{currentQ.targetEmoji}</Text>
        )}
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </Animated.View>

      {/* Options Stack */}
      <View style={styles.optionsStack}>
        {currentQ.options.map(opt => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = opt.id === currentQ.answerId;

          let bg = '#FFFFFF';
          let border = '#E5E7EB';
          let textCol = '#1F2937';

          if (isSelected) {
            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            border = isCorrect ? '#10B981' : '#EF4444';
            textCol = isCorrect ? '#065F46' : '#991B1B';
          }

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityLabel={opt.text}
              onPress={() => handleSelectOption(opt)}
              style={[
                styles.optionBtn,
                {backgroundColor: bg, borderColor: border},
              ]}>
              {opt.emoji && <Text style={styles.optEmoji}>{opt.emoji}</Text>}
              <Text style={[styles.optText, {color: textCol}]}>{opt.text}</Text>
              {isSelected && (
                <Text style={styles.feedbackIcon}>
                  {isCorrect ? '✅' : '❌'}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedOptionId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue to next question"
          onPress={handleNext}
          style={[styles.nextBtn, {backgroundColor: accentColor}]}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Assessment 🌟' : 'Next Question ➔'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  pill: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  pillCompleted: {
    backgroundColor: '#10B981',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  targetEmoji: {
    fontSize: 52,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  optionsStack: {
    width: '100%',
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 2,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  optEmoji: {
    fontSize: 26,
  },
  optText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  feedbackIcon: {
    fontSize: 18,
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
