import React, {useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsLetterItem} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface LetterSoundCardProps {
  readonly letterItem: PhonicsLetterItem;
  readonly onNext?: () => void;
}

export function LetterSoundCard({letterItem, onNext}: LetterSoundCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleHearSound = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    phonicsAudio.speakLetterPhoneme(
      letterItem.letter,
      letterItem.soundPronunciation,
      letterItem.exampleWord,
    );
  };

  const handleHearObject = () => {
    phonicsAudio.speak(
      `${letterItem.exampleWord}! Starts with ${letterItem.letter}!`,
    );
  };

  return (
    <View style={[styles.card, {borderColor: letterItem.color}]}>
      {/* Large Letter Representation */}
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Letter ${letterItem.letter}`}
          onPress={handleHearSound}
          style={[styles.letterBubble, {backgroundColor: letterItem.color}]}>
          <Text style={styles.letterText}>
            {letterItem.letter} {letterItem.lowercase}
          </Text>
          <View style={styles.soundPill}>
            <Text style={styles.soundSymbolText}>{letterItem.soundSymbol}</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Phonics Rule Tagline */}
      <View style={styles.sayBox}>
        <Text style={styles.sayText}>
          "{letterItem.letter} says{' '}
          <Text style={{color: letterItem.color, fontWeight: '900'}}>
            {letterItem.soundSymbol}
          </Text>
          "
        </Text>
      </View>

      {/* Example Object Bubble */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Example ${letterItem.exampleWord}`}
        onPress={handleHearObject}
        style={styles.objectBox}>
        <Text style={styles.objectEmoji}>{letterItem.exampleEmoji}</Text>
        <Text style={styles.objectWord}>{letterItem.exampleWord}</Text>
        <Text style={styles.objectHint}>Tap to hear object 🔊</Text>
      </Pressable>

      {/* Audio Controls Row */}
      <View style={styles.controlsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hear sound"
          onPress={handleHearSound}
          style={[styles.hearBtn, {backgroundColor: letterItem.color}]}>
          <Text style={styles.hearBtnText}>🔊 Hear Sound</Text>
        </Pressable>

        {onNext && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next letter"
            onPress={onNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next ➔</Text>
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
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  letterBubble: {
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 26,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  letterText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  soundPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  soundSymbolText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sayBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  sayText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  objectBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  objectEmoji: {
    fontSize: 48,
  },
  objectWord: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  objectHint: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  hearBtn: {
    flex: 1.4,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  hearBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '800',
  },
});
