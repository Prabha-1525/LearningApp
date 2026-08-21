import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalPuzzleItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalPuzzleBoardProps {
  readonly items: readonly AnimalPuzzleItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalPuzzleBoard({items, onComplete}: AnimalPuzzleBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    animalsAudio.speak(currentItem.prompt);
  }, [currentIdx, currentItem]);

  const handleSelectItem = (id: string) => {
    if (selectedItemId !== null) return;
    setSelectedItemId(id);

    const isCorrect = id === currentItem.answerId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(`Brilliant! ${currentItem.explanation}`);
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
      animalsAudio.speak(`Good try! ${currentItem.explanation}`);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedItemId === currentItem.answerId ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedItemId(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Card */}
      <View style={styles.promptCard}>
        <Text style={styles.promptIndex}>
          Puzzle {currentIdx + 1} of {items.length}
        </Text>
        <Text style={styles.promptText}>{currentItem.prompt}</Text>
      </View>

      {/* Items Grid */}
      <Animated.View style={[styles.grid, {transform: [{scale: bounceAnim}]}]}>
        {currentItem.items.map(itm => {
          const isSelected = selectedItemId === itm.id;
          const isCorrect = itm.id === currentItem.answerId;

          let bgCol = '#FFFFFF';
          let borderCol = '#E5E7EB';

          if (isSelected) {
            bgCol = isCorrect ? '#ECFDF5' : '#FEF2F2';
            borderCol = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={itm.id}
              accessibilityRole="button"
              accessibilityLabel={`Puzzle item ${itm.name}`}
              onPress={() => handleSelectItem(itm.id)}
              style={[
                styles.itemCard,
                {backgroundColor: bgCol, borderColor: borderCol},
              ]}>
              <Text style={styles.itemEmoji}>{itm.emoji}</Text>
              <Text style={styles.itemName}>{itm.name}</Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Explanation Box */}
      {selectedItemId !== null && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{currentItem.explanation}</Text>
        </View>
      )}

      {/* Next Button */}
      {selectedItemId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next puzzle"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Animal Puzzles 🌟' : 'Next Puzzle ➔'}
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
  promptCard: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#3B82F6',
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  promptIndex: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E40AF',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    width: '100%',
    justifyContent: 'center',
  },
  itemCard: {
    width: 90,
    height: 90,
    borderRadius: 22,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  itemEmoji: {
    fontSize: 38,
  },
  itemName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F2937',
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
    backgroundColor: '#3B82F6',
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
