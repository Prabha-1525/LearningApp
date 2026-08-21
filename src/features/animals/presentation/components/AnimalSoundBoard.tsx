import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalSoundItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalSoundBoardProps {
  readonly items: readonly AnimalSoundItem[];
  readonly onComplete: (score: number, stars: number) => void;
}

export function AnimalSoundBoard({items, onComplete}: AnimalSoundBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIdx] ?? items[0]!;
  const isLast = currentIdx === items.length - 1;

  const playSound = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    animalsAudio.speak(
      `Listen! ${currentItem.soundText}. ${currentItem.promptAudio}`,
    );
  }, [bounceAnim, currentItem.promptAudio, currentItem.soundText]);

  useEffect(() => {
    playSound();
  }, [playSound]);

  const handleSelectOption = (animalId: string) => {
    if (selectedAnimalId !== null) return;
    setSelectedAnimalId(animalId);

    const isCorrect = animalId === currentItem.correctAnimalId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      animalsAudio.playSuccessChime();
      animalsAudio.speak(
        `Correct! A ${currentItem.animalName} says ${currentItem.soundText}!`,
      );
    } else {
      animalsAudio.playTone(260, 140);
      animalsAudio.speak(
        `Almost! It is a ${currentItem.animalName} that says ${currentItem.soundText}.`,
      );
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
      <Text style={styles.headerIndex}>
        Sound Challenge {currentIdx + 1} of {items.length}
      </Text>

      {/* Main Sound Speaker Box with Bounce */}
      <Animated.View
        style={[styles.soundBox, {transform: [{scale: bounceAnim}]}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Replay sound"
          onPress={playSound}
          style={styles.speakerBtn}>
          <Text style={styles.speakerEmoji}>📢</Text>
          <Text style={styles.soundText}>{currentItem.soundText}</Text>
          <Text style={styles.tapReplay}>Tap to Hear Again 🔁</Text>
        </Pressable>
      </Animated.View>

      <Text style={styles.promptText}>What animal makes this sound?</Text>

      {/* Options Row */}
      <View style={styles.optionsRow}>
        {currentItem.options.map(opt => {
          const isSelected = selectedAnimalId === opt.id;
          const isCorrect = opt.id === currentItem.correctAnimalId;

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
              onPress={() => handleSelectOption(opt.id)}
              style={[
                styles.optionCard,
                {backgroundColor: bg, borderColor: border},
              ]}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={styles.optionName}>{opt.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Next Button */}
      {selectedAnimalId !== null && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next sound"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Animal Sounds 🌟' : 'Next Sound ➔'}
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
  headerIndex: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  soundBox: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#3B82F6',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  speakerBtn: {
    alignItems: 'center',
    gap: 8,
  },
  speakerEmoji: {
    fontSize: 54,
  },
  soundText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  tapReplay: {
    fontSize: 12,
    fontWeight: '800',
    color: '#60A5FA',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  optionCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
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
    fontSize: 40,
  },
  optionName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
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
