import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsCvcWordItem} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface WordBuildingBoardProps {
  readonly cvcItem: PhonicsCvcWordItem;
  readonly distractorLetters?: readonly string[];
  readonly onComplete: () => void;
}

export function WordBuildingBoard({
  cvcItem,
  distractorLetters = ['M', 'S', 'P'],
  onComplete,
}: WordBuildingBoardProps) {
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate scrambled letter bank
  const letterPool = React.useMemo(() => {
    const combined = [...cvcItem.letters, ...distractorLetters];
    // Deterministic shuffle
    return combined.sort();
  }, [cvcItem.letters, distractorLetters]);

  const handleSelectLetter = (letter: string) => {
    if (placedLetters.length >= cvcItem.letters.length || isSuccess) return;

    phonicsAudio.playTone(500, 60);
    const updated = [...placedLetters, letter];
    setPlacedLetters(updated);

    // If all slots filled, validate
    if (updated.length === cvcItem.letters.length) {
      const builtWord = updated.join('');
      if (builtWord === cvcItem.word) {
        setIsSuccess(true);
        phonicsAudio.playSuccessFanfare();
        phonicsAudio.speak(`Awesome! You built ${cvcItem.word}!`);
      } else {
        phonicsAudio.playTryAgain();
        phonicsAudio.speak('Almost! Try building the word again!');
        setTimeout(() => {
          setPlacedLetters([]);
        }, 1200);
      }
    }
  };

  const handleBackspace = () => {
    if (isSuccess || placedLetters.length === 0) return;
    phonicsAudio.playTone(350, 40);
    setPlacedLetters(prev => prev.slice(0, -1));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.tag}>🧩 BUILD THE WORD</Text>

      {/* Picture Clue */}
      <View style={styles.clueBox}>
        <Text style={styles.emoji}>{cvcItem.emoji}</Text>
      </View>

      {/* Empty Letter Slots */}
      <View style={styles.slotsRow}>
        {cvcItem.letters.map((_, idx) => {
          const char = placedLetters[idx];

          return (
            <View
              key={idx}
              style={[
                styles.slot,
                char && styles.slotFilled,
                isSuccess && styles.slotSuccess,
              ]}>
              <Text
                style={[styles.slotChar, isSuccess && styles.slotCharSuccess]}>
                {char ?? '_'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Success Celebration */}
      {isSuccess && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>🎉 You Built {cvcItem.word}!</Text>
        </View>
      )}

      {/* Letter Bank */}
      <View style={styles.bankContainer}>
        <Text style={styles.bankLabel}>Tap letters to build:</Text>
        <View style={styles.bankRow}>
          {letterPool.map((letter, idx) => (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Letter ${letter}`}
              disabled={isSuccess}
              onPress={() => handleSelectLetter(letter)}
              style={styles.bankTile}>
              <Text style={styles.bankTileText}>{letter}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear letters"
          disabled={placedLetters.length === 0 || isSuccess}
          onPress={handleBackspace}
          style={[
            styles.clearBtn,
            placedLetters.length === 0 && styles.btnDisabled,
          ]}>
          <Text style={styles.clearBtnText}>⌫ Delete</Text>
        </Pressable>

        {isSuccess && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next challenge"
            onPress={onComplete}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Continue ➔</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#F97316',
    padding: 20,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  clueBox: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFEDD5',
  },
  emoji: {
    fontSize: 48,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  slot: {
    width: 66,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {
    backgroundColor: '#FED7AA',
    borderColor: '#F97316',
    borderStyle: 'solid',
  },
  slotSuccess: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderStyle: 'solid',
  },
  slotChar: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F2937',
  },
  slotCharSuccess: {
    color: '#065F46',
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  successText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#047857',
  },
  bankContainer: {
    width: '100%',
    gap: 8,
    alignItems: 'center',
  },
  bankLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  bankRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bankTile: {
    width: 52,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    borderWidth: 2,
    borderColor: '#FDBA74',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  bankTileText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#C2410C',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 6,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  clearBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '800',
  },
  nextBtn: {
    flex: 1.4,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
