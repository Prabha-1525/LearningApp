import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeRecognitionItem} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeRecognitionBoardProps {
  readonly items: readonly ShapeRecognitionItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function ShapeRecognitionBoard({
  items,
  onComplete,
}: ShapeRecognitionBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const cardScale = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    shapesAudio.speak(currentItem.prompt);
  }, [currentIdx, currentItem]);

  const handleSelectOption = (opt: (typeof currentItem.options)[number]) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(opt.id);

    const isCorrect = opt.shapeId === currentItem.targetShapeId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      shapesAudio.playSuccessChime();
      shapesAudio.speak(
        'Correct! You recognized the shape even with rotation!',
      );

      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 1.1,
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
      shapesAudio.playTone(280, 150);
      shapesAudio.speak(
        'Look carefully at the sides and corners! Try the next one.',
      );
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score +
        (selectedOptionId &&
        currentItem.options.find(o => o.id === selectedOptionId)?.shapeId ===
          currentItem.targetShapeId
          ? 0
          : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
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
          Question {currentIdx + 1} of {items.length}
        </Text>
        <View style={styles.pillsRow}>
          {items.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.pill,
                idx === currentIdx && styles.pillActive,
                idx < currentIdx && styles.pillCompleted,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Question Card */}
      <Animated.View style={[styles.card, {transform: [{scale: cardScale}]}]}>
        <Text style={styles.promptText}>{currentItem.prompt}</Text>

        {/* Options Grid */}
        <View style={styles.optionsGrid}>
          {currentItem.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.shapeId === currentItem.targetShapeId;

            let bgColor = '#FFFFFF';
            let borderColor = '#E5E7EB';

            if (isSelected) {
              bgColor = isCorrect ? '#ECFDF5' : '#FEF2F2';
              borderColor = isCorrect ? '#10B981' : '#EF4444';
            }

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityLabel={`Shape option ${opt.shapeId}`}
                onPress={() => handleSelectOption(opt)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: bgColor,
                    borderColor,
                    transform: [
                      {rotate: `${opt.rotationDeg}deg`},
                      {scale: opt.scale},
                    ],
                  },
                ]}>
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Next Button */}
      {selectedOptionId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue to next question"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Recognition 🌟' : 'Next Shape ➔'}
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
  pillActive: {
    backgroundColor: '#8B5CF6',
    width: 28,
  },
  pillCompleted: {
    backgroundColor: '#10B981',
  },
  card: {
    width: '100%',
    backgroundColor: '#F5F3FF',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#8B5CF6',
    padding: 20,
    alignItems: 'center',
    gap: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  optionCard: {
    width: 90,
    height: 90,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  optionEmoji: {
    fontSize: 48,
  },
  nextBtn: {
    backgroundColor: '#8B5CF6',
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
