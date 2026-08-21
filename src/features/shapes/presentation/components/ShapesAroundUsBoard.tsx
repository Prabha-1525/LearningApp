import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeAroundUsItem} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapesAroundUsBoardProps {
  readonly items: readonly ShapeAroundUsItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function ShapesAroundUsBoard({
  items,
  onComplete,
}: ShapesAroundUsBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    shapesAudio.speak(
      `Look at this ${currentItem.objectName}! Which shape does it look like?`,
    );
  }, [currentIdx, currentItem]);

  const handleSelectOption = (shapeId: string) => {
    if (selectedShapeId !== null) return;
    setSelectedShapeId(shapeId);

    const isCorrect = shapeId === currentItem.correctShapeId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      shapesAudio.playSuccessChime();
      shapesAudio.speak(
        `That's right! A ${currentItem.objectName} is shaped like a ${currentItem.correctShapeName}!`,
      );
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      shapesAudio.playTone(260, 140);
      shapesAudio.speak(
        `Try looking again! A ${currentItem.objectName} has the shape of a ${currentItem.correctShapeName}.`,
      );
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
      {/* Real-World Object Display Card */}
      <Animated.View
        style={[styles.objectCard, {transform: [{scale: scaleAnim}]}]}>
        <Text style={styles.objectEmoji}>{currentItem.objectEmoji}</Text>
        <Text style={styles.objectName}>{currentItem.objectName}</Text>
        <Text style={styles.prompt}>What shape is this everyday object?</Text>
      </Animated.View>

      {/* Options Grid */}
      <View style={styles.optionsRow}>
        {currentItem.options.map(opt => {
          const isSelected = selectedShapeId === opt.shapeId;
          const isCorrect = opt.shapeId === currentItem.correctShapeId;

          let cardBg = '#FFFFFF';
          let borderCol = '#E5E7EB';

          if (isSelected) {
            cardBg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            borderCol = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={opt.shapeId}
              accessibilityRole="button"
              accessibilityLabel={`Select ${opt.name}`}
              onPress={() => handleSelectOption(opt.shapeId)}
              style={[
                styles.optionPill,
                {backgroundColor: cardBg, borderColor: borderCol},
              ]}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={styles.optionName}>{opt.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedShapeId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next object"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Real-World Shapes 🌟' : 'Next Object ➔'}
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
    gap: 16,
  },
  objectCard: {
    width: '100%',
    backgroundColor: '#F0FDFA',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#14B8A6',
    padding: 24,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  objectEmoji: {
    fontSize: 64,
  },
  objectName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F766E',
  },
  prompt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  optionPill: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  optionEmoji: {
    fontSize: 32,
  },
  optionName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  nextBtn: {
    backgroundColor: '#14B8A6',
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
