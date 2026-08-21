import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalPatternItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalPatternBoardProps {
  readonly items: readonly AnimalPatternItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalPatternBoard({
  items,
  onComplete,
}: AnimalPatternBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  useEffect(() => {
    animalsAudio.speak(
      'Look at the repeating animal pattern! What animal comes in the question mark?',
    );
  }, [currentIdx]);

  const handleSelectOption = (animalId: string) => {
    if (selectedAnimalId !== null) return;
    setSelectedAnimalId(animalId);

    const isCorrect = animalId === currentItem.correctAnimalId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(
        `Super! The pattern continues with ${currentItem.correctAnimalId}!`,
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
      animalsAudio.playTone(260, 140);
      animalsAudio.speak(`Nice try! Look at how the animals repeat.`);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore =
        score + (selectedAnimalId === currentItem.correctAnimalId ? 0 : 0);
      const total = items.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      onComplete(finalScore, stars);
    } else {
      setSelectedAnimalId(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Pattern {currentIdx + 1} of {items.length} ({currentItem.patternType})
      </Text>
      <Text style={styles.headerSubtitle}>
        Complete the repeating animal pattern:
      </Text>

      {/* Pattern Display Box */}
      <View style={styles.patternBox}>
        <View style={styles.sequenceRow}>
          {currentItem.sequence.map((seq, idx) => (
            <View key={idx} style={styles.animalNode}>
              <Text style={styles.seqEmoji}>{seq.emoji}</Text>
            </View>
          ))}

          {/* Question Mark Node */}
          <Animated.View
            style={[
              styles.targetNode,
              selectedAnimalId
                ? selectedAnimalId === currentItem.correctAnimalId
                  ? styles.targetCorrect
                  : styles.targetWrong
                : null,
              {transform: [{scale: pulseAnim}]},
            ]}>
            <Text style={styles.targetText}>
              {selectedAnimalId ? currentItem.correctEmoji : '?'}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Choices Options */}
      <View style={styles.choicesRow}>
        {currentItem.options.map(opt => {
          const isSelected = selectedAnimalId === opt.animalId;
          const isCorrect = opt.animalId === currentItem.correctAnimalId;

          let bg = '#FFFFFF';
          let border = '#E5E7EB';

          if (isSelected) {
            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
            border = isCorrect ? '#10B981' : '#EF4444';
          }

          return (
            <Pressable
              key={opt.animalId}
              accessibilityRole="button"
              accessibilityLabel={`Select ${opt.animalId}`}
              onPress={() => handleSelectOption(opt.animalId)}
              style={[
                styles.choiceBtn,
                {backgroundColor: bg, borderColor: border},
              ]}>
              <Text style={styles.choiceEmoji}>{opt.emoji}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedAnimalId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next pattern"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Animal Patterns 🌟' : 'Next Pattern ➔'}
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
    color: '#D97706',
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
    backgroundColor: '#FEF3C7',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#F59E0B',
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
  animalNode: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FDE68A',
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
    borderColor: '#D97706',
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
    color: '#D97706',
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
    backgroundColor: '#F59E0B',
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
