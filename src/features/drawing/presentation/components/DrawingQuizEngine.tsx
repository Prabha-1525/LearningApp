import React, {useEffect, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {DrawingQuizQuestion} from '../../domain/entities/drawingEntities';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

interface DrawingQuizEngineProps {
  readonly questions: readonly DrawingQuizQuestion[];
  readonly accentColor?: string;
  readonly onFinish: (score: number, stars: number) => void;
}

export function DrawingQuizEngine({
  questions,
  accentColor = '#EC4899',
  onFinish,
}: DrawingQuizEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const cardScale = React.useRef(new Animated.Value(1)).current;

  const currentQ = questions[currentIdx] ?? questions[0];
  const isLast = currentIdx === questions.length - 1;

  useEffect(() => {
    if (currentQ?.promptAudioText) {
      drawingAudio.speak(currentQ.promptAudioText);
    }
  }, [currentIdx, currentQ]);

  if (!currentQ) return null;

  const handleSelectOption = (opt: (typeof currentQ.options)[number]) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(opt.id);

    const isCorrect = opt.id === currentQ.answerId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      drawingAudio.playSuccessChime();
      drawingAudio.speak(`Awesome! ${currentQ.explanation}`);

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
      drawingAudio.playTone(280, 150);
      drawingAudio.speak(`Nice try! ${currentQ.explanation}`);
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
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
    }
  };

  if (!currentQ) return null;

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {questions.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIdx && [
                styles.dotActive,
                {backgroundColor: accentColor},
              ],
              idx < currentIdx && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Question Card */}
      <Animated.View
        style={[styles.questionCard, {transform: [{scale: cardScale}]}]}>
        {currentQ.targetEmoji && (
          <Text style={styles.targetEmoji}>{currentQ.targetEmoji}</Text>
        )}
        {currentQ.targetHex && (
          <View
            style={[
              styles.targetColorBox,
              {backgroundColor: currentQ.targetHex},
            ]}
          />
        )}
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </Animated.View>

      {/* Options Grid */}
      <View style={styles.optionsGrid}>
        {currentQ.options.map(opt => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = opt.id === currentQ.answerId;
          let borderStyle = styles.optionNormal;
          if (selectedOptionId !== null) {
            if (isCorrect) borderStyle = styles.optionCorrect;
            else if (isSelected) borderStyle = styles.optionIncorrect;
          }

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityLabel={opt.text}
              disabled={selectedOptionId !== null}
              onPress={() => handleSelectOption(opt)}
              style={[styles.optionBtn, borderStyle]}>
              {opt.hex && (
                <View style={[styles.optSwatch, {backgroundColor: opt.hex}]} />
              )}
              {opt.emoji && <Text style={styles.optEmoji}>{opt.emoji}</Text>}
              <Text style={styles.optText}>{opt.text}</Text>
              {selectedOptionId !== null && isCorrect && (
                <Text style={styles.checkIcon}>✅</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Feedback Banner & Next CTA */}
      {selectedOptionId !== null && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>{currentQ.explanation}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next quiz question"
            onPress={handleNext}
            style={[styles.nextBtn, {backgroundColor: accentColor}]}>
            <Text style={styles.nextBtnText}>
              {isLast ? 'See Results ⭐' : 'Next Question ➔'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  targetEmoji: {
    fontSize: 64,
  },
  targetColorBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsGrid: {
    width: '100%',
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionNormal: {
    borderColor: '#E5E7EB',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optEmoji: {
    fontSize: 26,
  },
  optText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  checkIcon: {
    fontSize: 18,
  },
  feedbackBox: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
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
