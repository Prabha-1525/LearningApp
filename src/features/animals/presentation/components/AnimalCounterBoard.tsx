import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalCountItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalCounterBoardProps {
  readonly items: readonly AnimalCountItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalCounterBoard({
  items,
  onComplete,
}: AnimalCounterBoardProps) {
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
    animalsAudio.speak(
      `How many ${currentItem.targetAnimalName} do you see? Tap each one to count!`,
    );
  }, [currentIdx, currentItem]);

  const handleTapItem = (id: string, animalId: string) => {
    if (
      animalId === currentItem.targetAnimalId &&
      !tappedItemIds.includes(id)
    ) {
      const next = [...tappedItemIds, id];
      setTappedItemIds(next);
      animalsAudio.playTone(440 + next.length * 40, 70);
      animalsAudio.speak(`${next.length}!`);
    }
  };

  const handleSelectCount = (count: number) => {
    if (selectedCount !== null) return;
    setSelectedCount(count);

    const isCorrect = count === currentItem.correctCount;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(
        `Spot on! There are ${count} ${currentItem.targetAnimalName}!`,
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
      animalsAudio.playTone(260, 140);
      animalsAudio.speak(
        `Almost! There are ${currentItem.correctCount} ${currentItem.targetAnimalName}.`,
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
          How many {currentItem.targetAnimalName}?
        </Text>
      </View>

      {/* Visual Animal Collection Box */}
      <Animated.View
        style={[styles.gridBox, {transform: [{scale: bounceAnim}]}]}>
        <View style={styles.grid}>
          {currentItem.displayedItems.map(itm => {
            const isTarget = itm.animalId === currentItem.targetAnimalId;
            const isTapped = tappedItemIds.includes(itm.id);

            return (
              <Pressable
                key={itm.id}
                accessibilityRole="button"
                accessibilityLabel={itm.animalId}
                onPress={() => handleTapItem(itm.id, itm.animalId)}
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

      {/* Number Selection Row */}
      <View style={styles.optionsRow}>
        {currentItem.options.map(cnt => {
          const isSelected = selectedCount === cnt;
          const isCorrect = cnt === currentItem.correctCount;

          let bg = '#FFFFFF';
          let border = '#E5E7EB';

          if (isSelected) {
            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            border = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={cnt}
              accessibilityRole="button"
              accessibilityLabel={`Count ${cnt}`}
              onPress={() => handleSelectCount(cnt)}
              style={[
                styles.countBtn,
                {backgroundColor: bg, borderColor: border},
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
          accessibilityLabel="Next counting item"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Counting 🌟' : 'Next Animal ➔'}
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
    backgroundColor: '#FDF4FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D946EF',
  },
  targetEmoji: {
    fontSize: 28,
  },
  promptText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#86198F',
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
    backgroundColor: '#D946EF',
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
