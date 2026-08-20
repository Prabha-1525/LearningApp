import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {SightWordItem} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface SightWordFlashcardProps {
  readonly sightWord: SightWordItem;
  readonly onNext?: () => void;
}

export function SightWordFlashcard({
  sightWord,
  onNext,
}: SightWordFlashcardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleSpeak = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.12,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setIsPlaying(true);
    englishAudio.playTone(480, 100);
    await englishAudio.speak(
      `Sight word: ${sightWord.word}. ${sightWord.exampleSentence}`,
    );
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {borderColor: sightWord.color, transform: [{scale: scaleAnim}]},
        ]}>
        <View style={styles.topBadge}>
          <Text style={styles.badgeText}>⭐ Sight Word</Text>
        </View>

        <Text style={styles.emoji}>{sightWord.emoji}</Text>

        <View
          style={[styles.wordPill, {backgroundColor: sightWord.color + '15'}]}>
          <Text style={[styles.wordText, {color: sightWord.color}]}>
            {sightWord.word}
          </Text>
        </View>

        <Text style={styles.sentenceText}>{sightWord.exampleSentence}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Listen to sight word ${sightWord.word}`}
          onPress={handleSpeak}
          style={[styles.speakBtn, {backgroundColor: sightWord.color}]}>
          <Text style={styles.speakBtnText}>
            {isPlaying ? '🔊 Reading...' : '🔊 Hear Sight Word'}
          </Text>
        </Pressable>

        {onNext && (
          <Pressable
            accessibilityRole="button"
            onPress={onNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next Sight Word ➔</Text>
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
    padding: 20,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  emoji: {
    fontSize: 60,
  },
  wordPill: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
  },
  wordText: {
    fontSize: 48,
    fontWeight: '900',
  },
  sentenceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  speakBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  speakBtnText: {
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
