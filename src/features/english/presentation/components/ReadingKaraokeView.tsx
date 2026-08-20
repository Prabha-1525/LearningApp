import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface ReadingKaraokeViewProps {
  readonly text?: string;
  readonly words: readonly string[];
  readonly emoji?: string;
  readonly onFinishReading?: () => void;
}

export function ReadingKaraokeView({
  words,
  emoji,
  onFinishReading,
}: ReadingKaraokeViewProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isReading, setIsReading] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const handleReadAlong = () => {
    if (isReading) return;
    setIsReading(true);
    englishAudio.playTone(520, 100);

    englishAudio.readSentenceWithKaraoke(
      words,
      idx => {
        setHighlightedIndex(idx);
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start();
      },
      () => {
        setIsReading(false);
        setHighlightedIndex(-1);
        onFinishReading?.();
      },
    );
  };

  const handleTapWord = (word: string, idx: number) => {
    setHighlightedIndex(idx);
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    englishAudio.playTone(440, 80);
    englishAudio.speak(cleanWord);
    setTimeout(() => {
      if (!isReading) {
        setHighlightedIndex(-1);
      }
    }, 900);
  };

  return (
    <View style={styles.container}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}

      {/* Words Container */}
      <View style={styles.sentenceBox}>
        <View style={styles.wordsRow}>
          {words.map((word, idx) => {
            const isHighlighted = highlightedIndex === idx;
            return (
              <Animated.View
                key={idx}
                style={[
                  styles.wordWrap,
                  isHighlighted && {transform: [{scale: pulseAnim}]},
                ]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Read word ${word}`}
                  onPress={() => handleTapWord(word, idx)}
                  style={[
                    styles.wordPill,
                    isHighlighted && styles.wordPillHighlighted,
                  ]}>
                  <Text
                    style={[
                      styles.wordText,
                      isHighlighted && styles.wordTextHighlighted,
                    ]}>
                    {word}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Text style={styles.hintText}>
        💡 Tap any word to hear it, or tap Read Along!
      </Text>

      {/* Audio Playback Controls */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Read sentence along"
        onPress={handleReadAlong}
        style={[styles.readBtn, isReading && styles.readBtnActive]}>
        <Text style={styles.readBtnText}>
          {isReading ? '🔊 Reading Along...' : '🔊 Read Along With Me'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2563EB',
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 58,
  },
  sentenceBox: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  wordWrap: {
    marginVertical: 2,
  },
  wordPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  wordPillHighlighted: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  wordText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  wordTextHighlighted: {
    color: '#FFFFFF',
  },
  hintText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  readBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  readBtnActive: {
    backgroundColor: '#1D4ED8',
    opacity: 0.85,
  },
  readBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
