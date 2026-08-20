import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {CVCWordItem} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface CVCWordExplorerProps {
  readonly wordItem: CVCWordItem;
  readonly onNext?: () => void;
}

export function CVCWordExplorer({wordItem, onNext}: CVCWordExplorerProps) {
  const bounceAnim = React.useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleSpeak = async () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setIsPlaying(true);
    englishAudio.playSuccessChime();
    await englishAudio.speak(
      `${wordItem.onset}... ${wordItem.rime}... ${wordItem.word}! ${wordItem.sentence}`,
    );
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, {transform: [{scale: bounceAnim}]}]}>
        {/* Family Pill */}
        <View style={styles.familyBadge}>
          <Text style={styles.familyText}>
            {wordItem.family} Family • Short '{wordItem.vowel.toUpperCase()}'
          </Text>
        </View>

        {/* Large Emoji Illustration */}
        <Text style={styles.emoji}>{wordItem.emoji}</Text>

        {/* Onset + Rime breakdown */}
        <View style={styles.breakdownRow}>
          <View style={styles.soundPill}>
            <Text style={styles.soundText}>{wordItem.onset}</Text>
          </View>
          <Text style={styles.plusSign}>+</Text>
          <View style={styles.soundPill}>
            <Text style={styles.soundText}>{wordItem.rime}</Text>
          </View>
          <Text style={styles.equalsSign}>=</Text>
          <View style={[styles.soundPill, styles.fullWordPill]}>
            <Text style={[styles.soundText, styles.fullWordText]}>
              {wordItem.word.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Example Sentence */}
        <Text style={styles.sentence}>{wordItem.sentence}</Text>

        {/* Audio Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Listen to ${wordItem.word}`}
          onPress={handleSpeak}
          style={[styles.audioBtn, isPlaying && styles.audioBtnPlaying]}>
          <Text style={styles.audioBtnText}>
            {isPlaying ? '🔊 Reading...' : '🔊 Read & Blend Word'}
          </Text>
        </Pressable>

        {onNext && (
          <Pressable
            accessibilityRole="button"
            onPress={onNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next Word ➔</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#E11D48',
    padding: 20,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  familyBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  familyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#BE123C',
  },
  emoji: {
    fontSize: 68,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soundPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  fullWordPill: {
    backgroundColor: '#FFE4E6',
    borderColor: '#F43F5E',
  },
  soundText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#374151',
  },
  fullWordText: {
    color: '#BE123C',
  },
  plusSign: {
    fontSize: 20,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  equalsSign: {
    fontSize: 20,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  sentence: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  audioBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  audioBtnPlaying: {
    opacity: 0.7,
  },
  audioBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  nextBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
  },
});
