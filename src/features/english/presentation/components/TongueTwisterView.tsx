import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {TongueTwisterItem} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface TongueTwisterViewProps {
  readonly twister: TongueTwisterItem;
  readonly onNext?: () => void;
}

export function TongueTwisterView({twister, onNext}: TongueTwisterViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleSpeak = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
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
    englishAudio.playSuccessChime();
    await englishAudio.speak(twister.text);
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, {transform: [{scale: scaleAnim}]}]}>
        <View style={styles.topBadge}>
          <Text style={styles.badgeText}>
            👅 Sound {twister.targetSound} • Repeat Letter '
            {twister.highlightedLetter}'
          </Text>
        </View>

        <Text style={styles.emoji}>{twister.emoji}</Text>

        <Text style={styles.title}>{twister.title}</Text>

        {/* Highlighted Repeating Sounds */}
        <View style={styles.twisterTextBox}>
          <Text style={styles.twisterText}>{twister.text}</Text>
        </View>

        <Text style={styles.speedHint}>⚡ {twister.speedText}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Speak tongue twister ${twister.title}`}
          onPress={handleSpeak}
          style={[styles.speakBtn, isPlaying && styles.speakBtnActive]}>
          <Text style={styles.speakBtnText}>
            {isPlaying ? '🔊 Speaking...' : '🔊 Listen & Say It!'}
          </Text>
        </Pressable>

        {onNext && (
          <Pressable
            accessibilityRole="button"
            onPress={onNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next Twister ➔</Text>
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
    borderColor: '#84CC16',
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
    backgroundColor: '#F7FEE7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4D7C0F',
  },
  emoji: {
    fontSize: 58,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  twisterTextBox: {
    backgroundColor: '#F7FEE7',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D9F99D',
    width: '100%',
  },
  twisterText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3F6212',
    textAlign: 'center',
    lineHeight: 28,
  },
  speedHint: {
    fontSize: 14,
    fontWeight: '700',
    color: '#65A30D',
  },
  speakBtn: {
    backgroundColor: '#84CC16',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  speakBtnActive: {
    backgroundColor: '#65A30D',
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
