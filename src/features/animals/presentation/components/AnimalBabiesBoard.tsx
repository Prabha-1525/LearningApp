import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {BabyAnimalItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalBabiesBoardProps {
  readonly items: readonly BabyAnimalItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalBabiesBoard({items, onComplete}: AnimalBabiesBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedBaby, setSelectedBaby] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    animalsAudio.speak(`What is a baby ${currentItem.parentName} called?`);
  }, [currentIdx, currentItem]);

  const handleSelectOption = (baby: string) => {
    if (selectedBaby !== null) return;
    setSelectedBaby(baby);

    const isCorrect = baby === currentItem.correctBabyName;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(
        `That's right! A baby ${currentItem.parentName} is called a ${currentItem.babyName}!`,
      );
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
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
        `Good try! A baby ${currentItem.parentName} is a ${currentItem.babyName}.`,
      );
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedBaby === currentItem.correctBabyName ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedBaby(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Parent Animal Display */}
      <Animated.View
        style={[styles.parentCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.parentEmoji}>{currentItem.parentEmoji}</Text>
        <Text style={styles.parentName}>{currentItem.parentName}</Text>
        <Text style={styles.prompt}>
          Who is the baby {currentItem.parentName}?
        </Text>
      </Animated.View>

      {/* Options Stack */}
      <View style={styles.optionsStack}>
        {currentItem.options.map((opt, idx) => {
          const isSelected = selectedBaby === opt;
          const isCorrect = opt === currentItem.correctBabyName;

          let bg = '#FFFFFF';
          let border = '#E5E7EB';

          if (isSelected) {
            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            border = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Select ${opt}`}
              onPress={() => handleSelectOption(opt)}
              style={[
                styles.optionBtn,
                {backgroundColor: bg, borderColor: border},
              ]}>
              <Text style={styles.optText}>{opt}</Text>
              {isSelected && (
                <Text style={styles.feedbackEmoji}>
                  {isCorrect ? '✅' : '❌'}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Fact Card */}
      {selectedBaby !== null && (
        <View style={styles.factCard}>
          <Text style={styles.factText}>{currentItem.fact}</Text>
        </View>
      )}

      {/* Next Button */}
      {selectedBaby !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next baby animal question"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Baby Animals 🌟' : 'Next Baby Animal ➔'}
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
  parentCard: {
    width: '100%',
    backgroundColor: '#FDF2F8',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#EC4899',
    padding: 20,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  parentEmoji: {
    fontSize: 58,
  },
  parentName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#DB2777',
  },
  prompt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4B5563',
    textAlign: 'center',
  },
  optionsStack: {
    width: '100%',
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  optText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
  },
  feedbackEmoji: {
    fontSize: 18,
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    width: '100%',
  },
  factText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#EC4899',
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
