import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalDietItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalDietBoardProps {
  readonly items: readonly AnimalDietItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalDietBoard({items, onComplete}: AnimalDietBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    animalsAudio.speak(`What does the ${currentItem.animalName} love to eat?`);
  }, [currentIdx, currentItem]);

  const handleSelectFood = (foodId: string) => {
    if (selectedFoodId !== null) return;
    setSelectedFoodId(foodId);

    const isCorrect = foodId === currentItem.correctFood;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(`Yum! ${currentItem.explanation}`);
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.12,
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
        score + (selectedFoodId === currentItem.correctFood ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedFoodId(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animal Food Prompt Box */}
      <Animated.View
        style={[styles.animalCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.animalEmoji}>{currentItem.animalEmoji}</Text>
        <Text style={styles.animalName}>{currentItem.animalName}</Text>
        <Text style={styles.prompt}>{currentItem.question}</Text>
      </Animated.View>

      {/* Food Options Row */}
      <View style={styles.optionsRow}>
        {currentItem.options.map(opt => {
          const isSelected = selectedFoodId === opt.id;
          const isCorrect = opt.id === currentItem.correctFood;

          let bg = '#FFFFFF';
          let border = '#E5E7EB';

          if (isSelected) {
            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            border = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityLabel={`Select ${opt.name}`}
              onPress={() => handleSelectFood(opt.id)}
              style={[
                styles.foodCard,
                {backgroundColor: bg, borderColor: border},
              ]}>
              <Text style={styles.foodEmoji}>{opt.emoji}</Text>
              <Text style={styles.foodName}>{opt.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Explanation Banner */}
      {selectedFoodId !== null && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{currentItem.explanation}</Text>
        </View>
      )}

      {/* Next Button */}
      {selectedFoodId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next diet question"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Animal Diets 🌟' : 'Next Food ➔'}
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
  animalCard: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#EF4444',
    padding: 20,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  animalEmoji: {
    fontSize: 58,
  },
  animalName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#DC2626',
  },
  prompt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4B5563',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  foodCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
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
  foodEmoji: {
    fontSize: 34,
  },
  foodName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
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
    backgroundColor: '#EF4444',
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
