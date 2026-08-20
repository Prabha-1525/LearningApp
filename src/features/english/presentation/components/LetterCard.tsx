import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AlphabetLetter} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface LetterCardProps {
  readonly letter: AlphabetLetter;
  readonly onTapped?: () => void;
}

export function LetterCard({letter, onTapped}: LetterCardProps) {
  const bounceAnim = React.useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePress = async () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.15,
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
    englishAudio.playTone(440, 100);
    await englishAudio.speak(letter.audioSpeech);
    setIsPlaying(false);
    onTapped?.();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {borderColor: letter.color, transform: [{scale: bounceAnim}]},
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Letter ${letter.upper} ${letter.lower}`}
          onPress={handlePress}
          style={styles.pressableArea}>
          {/* Top Letter Pill */}
          <View
            style={[
              styles.letterHeroRow,
              {backgroundColor: letter.color + '15'},
            ]}>
            <Text style={[styles.upperLetter, {color: letter.color}]}>
              {letter.upper}
            </Text>
            <Text style={[styles.lowerLetter, {color: letter.color}]}>
              {letter.lower}
            </Text>
          </View>

          {/* Large Object Illustration */}
          <View style={styles.illustrationBox}>
            <Text style={styles.objectEmoji}>{letter.emoji}</Text>
            <Text style={styles.objectWord}>{letter.word}</Text>
          </View>

          {/* Sound description */}
          <View style={styles.soundBadge}>
            <Text style={styles.soundIpa}>{letter.soundIpa}</Text>
            <Text style={styles.soundHint}>{letter.soundHint}</Text>
          </View>

          {/* Sentence Context */}
          <Text style={styles.sentenceText}>{letter.sentence}</Text>

          {/* Tap to Speak Button */}
          <View
            style={[
              styles.speakBtn,
              {backgroundColor: letter.color},
              isPlaying && styles.btnPlaying,
            ]}>
            <Text style={styles.speakBtnText}>
              {isPlaying ? '🔊 Playing...' : '🔊 Hear Letter & Sound'}
            </Text>
          </View>
        </Pressable>
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
    borderRadius: 28,
    borderWidth: 3,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pressableArea: {
    alignItems: 'center',
    gap: 12,
  },
  letterHeroRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 14,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
  },
  upperLetter: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
  },
  lowerLetter: {
    fontSize: 50,
    fontWeight: '800',
    lineHeight: 58,
  },
  illustrationBox: {
    alignItems: 'center',
    gap: 4,
  },
  objectEmoji: {
    fontSize: 76,
  },
  objectWord: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
  },
  soundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  soundIpa: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4B5563',
  },
  soundHint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sentenceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: '100%',
    marginTop: 4,
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  btnPlaying: {
    opacity: 0.7,
  },
});
