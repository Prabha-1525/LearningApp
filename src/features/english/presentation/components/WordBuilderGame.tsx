import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {WordBuildingTask} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface WordBuilderGameProps {
  readonly tasks: readonly WordBuildingTask[];
  readonly onCompleted: (stars: number) => void;
}

export function WordBuilderGame({tasks, onCompleted}: WordBuilderGameProps) {
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const currentTask = tasks[currentTaskIdx];
  const isLast = currentTaskIdx === tasks.length - 1;
  const targetChars = currentTask ? currentTask.targetWord.split('') : [];

  const handleTapTile = (letter: string) => {
    if (placedLetters.length >= targetChars.length || isSuccess === true)
      return;

    englishAudio.playTone(400 + placedLetters.length * 60, 100);
    const newPlaced = [...placedLetters, letter];
    setPlacedLetters(newPlaced);

    if (newPlaced.length === targetChars.length) {
      const builtWord = newPlaced.join('');
      if (builtWord === currentTask.targetWord) {
        setIsSuccess(true);
        setScore(prev => prev + 1);
        englishAudio.playSuccessChime();
        englishAudio.speak(`Super! ${currentTask.targetWord}!`);

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
        setIsSuccess(false);
        englishAudio.playTryAgainTone();
        englishAudio.speak(
          `Not quite. Try putting the letters in order for ${currentTask.targetWord}.`,
        );
      }
    }
  };

  const handleRemoveLetter = (idx: number) => {
    if (isSuccess === true) return;
    const newPlaced = placedLetters.filter((_, i) => i !== idx);
    setPlacedLetters(newPlaced);
    setIsSuccess(null);
  };

  const handleReset = () => {
    setPlacedLetters([]);
    setIsSuccess(null);
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score;
      const total = tasks.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;
      onCompleted(stars);
    } else {
      setCurrentTaskIdx(prev => prev + 1);
      setPlacedLetters([]);
      setIsSuccess(null);
    }
  };

  if (!currentTask) return null;

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {tasks.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentTaskIdx && styles.dotActive,
              idx < currentTaskIdx && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Target Image & Word Box */}
      <Animated.View
        style={[styles.targetCard, {transform: [{scale: bounceAnim}]}]}>
        <Text style={styles.targetEmoji}>{currentTask.emoji}</Text>
        <Text style={styles.categoryLabel}>Build the word:</Text>

        {/* Letter Slots */}
        <View style={styles.slotsRow}>
          {targetChars.map((_, idx) => {
            const letter = placedLetters[idx];
            return (
              <Pressable
                key={idx}
                accessibilityRole="button"
                accessibilityLabel={
                  letter
                    ? `Slot ${idx + 1}: ${letter}`
                    : `Empty slot ${idx + 1}`
                }
                onPress={() => letter && handleRemoveLetter(idx)}
                style={[
                  styles.slotBox,
                  letter && styles.slotFilled,
                  isSuccess === true && styles.slotSuccess,
                  isSuccess === false && styles.slotWrong,
                ]}>
                <Text
                  style={[
                    styles.slotLetter,
                    isSuccess === true && styles.textSuccess,
                    isSuccess === false && styles.textWrong,
                  ]}>
                  {letter ?? ''}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isSuccess === false && (
          <Pressable
            accessibilityRole="button"
            onPress={handleReset}
            style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>🔄 Reset & Try Again</Text>
          </Pressable>
        )}
      </Animated.View>

      {/* Scrambled Tile Tray */}
      <View style={styles.trayCard}>
        <Text style={styles.trayLabel}>Tap letters to build the word:</Text>
        <View style={styles.tilesRow}>
          {currentTask.scrambledLetters.map((letter, idx) => (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Letter tile ${letter}`}
              onPress={() => handleTapTile(letter)}
              style={styles.tile}>
              <Text style={styles.tileLetter}>{letter}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Success CTA */}
      {isSuccess === true && (
        <Pressable
          accessibilityRole="button"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Word Building ⭐' : 'Next Word ➔'}
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
    gap: 14,
    paddingVertical: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
    backgroundColor: '#F97316',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  targetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F97316',
    padding: 18,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  targetEmoji: {
    fontSize: 64,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#6B7280',
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
  slotBox: {
    width: 60,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  slotSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  slotWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  slotLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F2937',
  },
  textSuccess: {
    color: '#065F46',
  },
  textWrong: {
    color: '#991B1B',
  },
  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  trayCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  trayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  tile: {
    width: 52,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 2,
    borderColor: '#FDBA74',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tileLetter: {
    fontSize: 26,
    fontWeight: '900',
    color: '#C2410C',
  },
  nextBtn: {
    backgroundColor: '#10B981',
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
