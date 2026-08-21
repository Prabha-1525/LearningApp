import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeComparisonItem} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeComparatorBoardProps {
  readonly items: readonly ShapeComparisonItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function ShapeComparatorBoard({
  items,
  onComplete,
}: ShapeComparatorBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    shapesAudio.speak(currentItem.promptAudio);
  }, [currentIdx, currentItem]);

  const handleSelectShape = (shapeId: string) => {
    if (selectedShapeId !== null) return;
    setSelectedShapeId(shapeId);

    const isCorrect = shapeId === currentItem.correctShapeId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      shapesAudio.playSuccessChime();
      shapesAudio.speak(`Correct! ${currentItem.explanation}`);
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.08,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      shapesAudio.playTone(260, 140);
      shapesAudio.speak(`Almost! ${currentItem.explanation}`);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedShapeId === currentItem.correctShapeId ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedShapeId(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Header */}
      <View style={styles.questionCard}>
        <Text style={styles.questionIndex}>
          Comparison {currentIdx + 1} of {items.length}
        </Text>
        <Text style={styles.questionText}>{currentItem.question}</Text>
      </View>

      {/* Comparison Cards Row */}
      <Animated.View
        style={[styles.choicesRow, {transform: [{scale: bounceAnim}]}]}>
        {[currentItem.shapeA, currentItem.shapeB].map(shape => {
          const isSelected = selectedShapeId === shape.id;
          const isCorrect = shape.id === currentItem.correctShapeId;

          let cardBg = shape.lightColor;
          let borderColor = shape.color;

          if (isSelected) {
            cardBg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            borderColor = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={shape.id}
              accessibilityRole="button"
              accessibilityLabel={`Select ${shape.name}`}
              onPress={() => handleSelectShape(shape.id)}
              style={[
                styles.shapeCard,
                {backgroundColor: cardBg, borderColor},
              ]}>
              <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
              <Text style={[styles.shapeName, {color: shape.darkColor}]}>
                {shape.name}
              </Text>
              <View style={styles.propPill}>
                <Text style={styles.propText}>
                  {shape.sides === 0
                    ? '0 Sides (Round)'
                    : `${shape.sides} Sides`}
                </Text>
                <Text style={styles.propText}>
                  {shape.corners === 0
                    ? '0 Corners'
                    : `${shape.corners} Corners`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Explanation Banner */}
      {selectedShapeId !== null && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{currentItem.explanation}</Text>
        </View>
      )}

      {/* Next Button */}
      {selectedShapeId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next comparison"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Comparison 🌟' : 'Next Comparison ➔'}
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
  questionCard: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0EA5E9',
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  questionIndex: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0C4A6E',
    textAlign: 'center',
  },
  choicesRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  shapeCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 3,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shapeEmoji: {
    fontSize: 48,
  },
  shapeName: {
    fontSize: 17,
    fontWeight: '900',
  },
  propPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '100%',
    gap: 2,
  },
  propText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
  },
  explanationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    width: '100%',
  },
  explanationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#0EA5E9',
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
