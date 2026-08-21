import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalHabitatItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalHabitatBoardProps {
  readonly items: readonly AnimalHabitatItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalHabitatBoard({
  items,
  onComplete,
}: AnimalHabitatBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedHabitatId, setSelectedHabitatId] = useState<string | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    animalsAudio.speak(`Where does the ${currentItem.animalName} live?`);
  }, [currentIdx, currentItem]);

  const handleSelectHabitat = (habitatId: string) => {
    if (selectedHabitatId !== null) return;
    setSelectedHabitatId(habitatId);

    const isCorrect = habitatId === currentItem.correctHabitat;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(`That's right! ${currentItem.explanation}`);
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
      animalsAudio.speak(`Nice try! ${currentItem.explanation}`);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedHabitatId === currentItem.correctHabitat ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedHabitatId(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animal Display Card */}
      <Animated.View
        style={[styles.animalCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.animalEmoji}>{currentItem.animalEmoji}</Text>
        <Text style={styles.animalName}>{currentItem.animalName}</Text>
        <Text style={styles.prompt}>{currentItem.prompt}</Text>
      </Animated.View>

      {/* Habitat Options */}
      <View style={styles.optionsRow}>
        {currentItem.options.map(opt => {
          const isSelected = selectedHabitatId === opt.id;
          const isCorrect = opt.id === currentItem.correctHabitat;

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
              onPress={() => handleSelectHabitat(opt.id)}
              style={[
                styles.habitatCard,
                {backgroundColor: bg, borderColor: border},
              ]}>
              <Text style={styles.habitatEmoji}>{opt.emoji}</Text>
              <Text style={styles.habitatName}>{opt.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Explanation Card */}
      {selectedHabitatId !== null && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{currentItem.explanation}</Text>
        </View>
      )}

      {/* Next Button */}
      {selectedHabitatId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next habitat question"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Habitats 🌟' : 'Next Habitat ➔'}
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
    backgroundColor: '#F5F3FF',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#8B5CF6',
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
    color: '#6D28D9',
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
  habitatCard: {
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
  habitatEmoji: {
    fontSize: 34,
  },
  habitatName: {
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
