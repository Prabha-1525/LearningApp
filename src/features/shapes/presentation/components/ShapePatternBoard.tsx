import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapePatternItem} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapePatternBoardProps {
  readonly items: readonly ShapePatternItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function ShapePatternBoard({items, onComplete}: ShapePatternBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    shapesAudio.speak(
      'Look at the repeating shape pattern! What shape comes in the question mark?',
    );
  }, [currentIdx]);

  const handleSelectOption = (shapeId: string) => {
    if (selectedShapeId !== null) return;
    setSelectedShapeId(shapeId);

    const isCorrect = shapeId === currentItem.correctShapeId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      shapesAudio.playSuccessChime();
      shapesAudio.speak(
        `Super! The pattern continues with ${currentItem.correctShapeId}!`,
      );
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      shapesAudio.playTone(260, 140);
      shapesAudio.speak(`Nice try! Look at how the shapes repeat.`);
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
      <Text style={styles.headerTitle}>
        Pattern {currentIdx + 1} of {items.length} ({currentItem.patternType})
      </Text>
      <Text style={styles.headerSubtitle}>
        Complete the repeating shape pattern:
      </Text>

      {/* Pattern Display Row */}
      <View style={styles.patternBox}>
        <View style={styles.sequenceRow}>
          {currentItem.sequence.map((seq, idx) => (
            <View key={idx} style={styles.shapeNode}>
              <Text style={styles.seqEmoji}>{seq.emoji}</Text>
            </View>
          ))}

          {/* Target Question Mark Node */}
          <Animated.View
            style={[
              styles.targetNode,
              selectedShapeId
                ? selectedShapeId === currentItem.correctShapeId
                  ? styles.targetCorrect
                  : styles.targetWrong
                : null,
              {transform: [{scale: pulseAnim}]},
            ]}>
            <Text style={styles.targetText}>
              {selectedShapeId ? currentItem.correctEmoji : '?'}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Choices Options Row */}
      <View style={styles.choicesRow}>
        {currentItem.options.map(opt => {
          const isSelected = selectedShapeId === opt.shapeId;
          const isCorrect = opt.shapeId === currentItem.correctShapeId;

          let bgCol = '#FFFFFF';
          let borderCol = '#E5E7EB';

          if (isSelected) {
            bgCol = isCorrect ? '#ECFDF5' : '#FEF2F2';
            borderCol = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={opt.shapeId}
              accessibilityRole="button"
              accessibilityLabel={`Select ${opt.shapeId}`}
              onPress={() => handleSelectOption(opt.shapeId)}
              style={[
                styles.choiceBtn,
                {backgroundColor: bgCol, borderColor: borderCol},
              ]}>
              <Text style={styles.choiceEmoji}>{opt.emoji}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedShapeId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next pattern"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Pattern Master 🌟' : 'Next Pattern ➔'}
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
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EA580C',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  patternBox: {
    width: '100%',
    backgroundColor: '#FFF7ED',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#F97316',
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  shapeNode: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqEmoji: {
    fontSize: 28,
  },
  targetNode: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#EA580C',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderStyle: 'solid',
  },
  targetWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    borderStyle: 'solid',
  },
  targetText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#EA580C',
  },
  choicesRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    justifyContent: 'center',
  },
  choiceBtn: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  choiceEmoji: {
    fontSize: 36,
  },
  nextBtn: {
    backgroundColor: '#F97316',
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
