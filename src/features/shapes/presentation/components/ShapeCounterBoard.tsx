import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeCountItem} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapeCounterBoardProps {
  readonly items: readonly ShapeCountItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function ShapeCounterBoard({items, onComplete}: ShapeCounterBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [tappedItemIds, setTappedItemIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    setSelectedCount(null);
    setTappedItemIds([]);
    shapesAudio.speak(
      `How many ${currentItem.targetShapeName} do you see? Tap each one to count!`,
    );
  }, [currentIdx, currentItem]);

  const handleTapItem = (id: string, shapeId: string) => {
    if (shapeId === currentItem.targetShapeId && !tappedItemIds.includes(id)) {
      const next = [...tappedItemIds, id];
      setTappedItemIds(next);
      shapesAudio.playTone(440 + next.length * 50, 70);
      shapesAudio.speak(`${next.length}!`);
    }
  };

  const handleSelectCount = (count: number) => {
    if (selectedCount !== null) return;
    setSelectedCount(count);

    const isCorrect = count === currentItem.correctCount;
    if (isCorrect) {
      setScore(prev => prev + 1);
      shapesAudio.playSuccessChime();
      shapesAudio.speak(
        `Spot on! There are ${count} ${currentItem.targetShapeName}!`,
      );
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
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
      shapesAudio.speak(
        `Almost! There are ${currentItem.correctCount} ${currentItem.targetShapeName}.`,
      );
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedCount === currentItem.correctCount ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedCount(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Target Prompt Banner */}
      <View style={styles.promptBanner}>
        <Text style={styles.targetEmoji}>{currentItem.targetEmoji}</Text>
        <Text style={styles.promptText}>
          How many {currentItem.targetShapeName}?
        </Text>
      </View>

      {/* Items Collection Grid */}
      <Animated.View
        style={[styles.gridBox, {transform: [{scale: bounceAnim}]}]}>
        <View style={styles.grid}>
          {currentItem.displayedItems.map(itm => {
            const isTarget = itm.shapeId === currentItem.targetShapeId;
            const isTapped = tappedItemIds.includes(itm.id);

            return (
              <Pressable
                key={itm.id}
                accessibilityRole="button"
                accessibilityLabel={`Item ${itm.shapeId}`}
                onPress={() => handleTapItem(itm.id, itm.shapeId)}
                style={[
                  styles.itemCircle,
                  isTarget && isTapped && styles.itemCircleTapped,
                ]}>
                <Text style={styles.itemEmoji}>{itm.emoji}</Text>
                {isTarget && isTapped && (
                  <View style={styles.tappedBadge}>
                    <Text style={styles.tappedCheck}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Number Options Row */}
      <View style={styles.optionsRow}>
        {currentItem.options.map(cnt => {
          const isSelected = selectedCount === cnt;
          const isCorrect = cnt === currentItem.correctCount;

          let bgCol = '#FFFFFF';
          let borderCol = '#E5E7EB';

          if (isSelected) {
            bgCol = isCorrect ? '#ECFDF5' : '#FEF2F2';
            borderCol = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={cnt}
              accessibilityRole="button"
              accessibilityLabel={`Count ${cnt}`}
              onPress={() => handleSelectCount(cnt)}
              style={[
                styles.countBtn,
                {backgroundColor: bgCol, borderColor: borderCol},
              ]}>
              <Text style={styles.countBtnText}>{cnt}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedCount !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next counting challenge"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Counting 🌟' : 'Next Shape ➔'}
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
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  targetEmoji: {
    fontSize: 28,
  },
  promptText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#3730A3',
  },
  gridBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#374151',
    padding: 20,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  itemCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  itemCircleTapped: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 3,
  },
  itemEmoji: {
    fontSize: 32,
  },
  tappedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tappedCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    justifyContent: 'center',
  },
  countBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  countBtnText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
  },
  nextBtn: {
    backgroundColor: '#6366F1',
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
