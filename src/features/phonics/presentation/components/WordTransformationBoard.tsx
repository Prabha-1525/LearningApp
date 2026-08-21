import React, {useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsTransformItem} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface WordTransformationBoardProps {
  readonly transformItem: PhonicsTransformItem;
  readonly onNext?: () => void;
}

export function WordTransformationBoard({
  transformItem,
  onNext,
}: WordTransformationBoardProps) {
  const [isTransformed, setIsTransformed] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleTransform = () => {
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsTransformed(true);
    phonicsAudio.playSuccessFanfare();
    phonicsAudio.speak(
      `Change ${transformItem.startWord[0]} to ${transformItem.newLetter}! Now you have ${transformItem.targetWord}!`,
    );
  };

  const handleReset = () => {
    setIsTransformed(false);
    phonicsAudio.speak(transformItem.startWord);
  };

  const currentWord = isTransformed
    ? transformItem.targetWord
    : transformItem.startWord;
  const currentEmoji = isTransformed
    ? transformItem.targetEmoji
    : transformItem.startEmoji;

  return (
    <View style={styles.card}>
      <Text style={styles.tag}>✏️ CHANGE ONE SOUND</Text>

      {/* Picture Clue */}
      <View style={styles.clueBox}>
        <Text style={styles.emoji}>{currentEmoji}</Text>
      </View>

      {/* Word Box */}
      <Animated.View style={{transform: [{scale: isTransformed ? 1.08 : 1}]}}>
        <View style={styles.wordBox}>
          <Text style={styles.wordText}>{currentWord}</Text>
        </View>
      </Animated.View>

      {/* Instruction Tagline */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          {isTransformed
            ? `🎉 Great job! You formed ${transformItem.targetWord}!`
            : `Change ${transformItem.startWord[0]} to ${transformItem.newLetter} to make a new word!`}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {!isTransformed ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Change letter to ${transformItem.newLetter}`}
            onPress={handleTransform}
            style={styles.transformBtn}>
            <Text style={styles.transformBtnText}>
              Change to '{transformItem.newLetter}' ✨
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset word"
              onPress={handleReset}
              style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>🔄 Start Over</Text>
            </Pressable>

            {onNext && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next word"
                onPress={onNext}
                style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next ➔</Text>
              </Pressable>
            )}
          </>
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
    borderColor: '#EAB308',
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#CA8A04',
    letterSpacing: 0.5,
  },
  clueBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF9C3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FEF08A',
  },
  emoji: {
    fontSize: 50,
  },
  wordBox: {
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: '#EAB308',
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  wordText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 3,
  },
  instructionBox: {
    backgroundColor: '#FEFCE8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#854D0E',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  transformBtn: {
    width: '100%',
    backgroundColor: '#EAB308',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transformBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  nextBtn: {
    flex: 1.4,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
