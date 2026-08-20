import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {BlendingWordItem} from '../../domain/entities/englishEntities';
import {englishAudio} from '../../domain/audio/englishAudioEngine';

interface SoundBlendingBoardProps {
  readonly items: readonly BlendingWordItem[];
  readonly onCompleted: (stars: number) => void;
}

export function SoundBlendingBoard({
  items,
  onCompleted,
}: SoundBlendingBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tappedLetters, setTappedLetters] = useState<number[]>([]);
  const [isBlended, setIsBlended] = useState(false);
  const [score, setScore] = useState(0);

  const slideAnim = React.useRef(new Animated.Value(12)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIndex];
  const isLast = currentIndex === items.length - 1;

  const handleTapLetter = (idx: number, phoneme: string) => {
    englishAudio.playTone(350 + idx * 80, 150);
    englishAudio.speak(`${phoneme}`);
    if (!tappedLetters.includes(idx)) {
      setTappedLetters(prev => [...prev, idx]);
    }
  };

  const handleBlend = async () => {
    setIsBlended(true);
    setScore(prev => prev + 1);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 2,
        duration: 350,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    englishAudio.playSuccessChime();
    await englishAudio.blendWordPhonemes(
      currentItem.phonemes,
      currentItem.blendedWord,
    );
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (isBlended ? 1 : 0);
      const total = items.length;
      let stars = 3;
      if (finalScore < Math.ceil(total * 0.5)) stars = 1;
      else if (finalScore < total) stars = 2;
      onCompleted(stars);
    } else {
      setCurrentIndex(prev => prev + 1);
      setTappedLetters([]);
      setIsBlended(false);
      slideAnim.setValue(12);
    }
  };

  if (!currentItem) return null;

  const allTapped = tappedLetters.length === currentItem.letters.length;

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {items.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIndex && styles.dotActive,
              idx < currentIndex && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      <Text style={styles.instruction}>
        {isBlended
          ? '🎉 Great job! Listen and read the word!'
          : '1. Tap each sound block. 2. Tap Blend!'}
      </Text>

      {/* Interactive Sound Blocks */}
      <View style={styles.boardCard}>
        <View style={styles.blocksRow}>
          {currentItem.letters.map((letter, idx) => {
            const isLetterTapped = tappedLetters.includes(idx);
            return (
              <Animated.View
                key={idx}
                style={
                  isBlended ? styles.blockWrapBlended : styles.blockWrapNormal
                }>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Sound ${letter}`}
                  onPress={() =>
                    handleTapLetter(idx, currentItem.phonemes[idx])
                  }
                  style={[
                    styles.soundBlock,
                    isLetterTapped && styles.soundBlockTapped,
                    isBlended && styles.soundBlockBlended,
                  ]}>
                  <Text
                    style={[
                      styles.soundBlockLetter,
                      isBlended && styles.letterBlended,
                    ]}>
                    {letter}
                  </Text>
                  <Text style={styles.soundPhoneme}>
                    /{currentItem.phonemes[idx]}/
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Blend Action or Word Reveal */}
        {!isBlended ? (
          <Pressable
            accessibilityRole="button"
            disabled={!allTapped}
            onPress={handleBlend}
            style={[
              styles.blendBtn,
              allTapped ? styles.blendBtnActive : styles.blendBtnDisabled,
            ]}>
            <Text style={styles.blendBtnText}>
              {allTapped ? '🔗 Tap to Blend Sounds!' : 'Tap all 3 sounds first'}
            </Text>
          </Pressable>
        ) : (
          <Animated.View
            style={[styles.revealedCard, {transform: [{scale: scaleAnim}]}]}>
            <Text style={styles.revealedEmoji}>{currentItem.emoji}</Text>
            <Text style={styles.revealedWord}>
              {currentItem.blendedWord.toUpperCase()}
            </Text>
            <Text style={styles.revealedSentence}>{currentItem.sentence}</Text>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                englishAudio.blendWordPhonemes(
                  currentItem.phonemes,
                  currentItem.blendedWord,
                )
              }
              style={styles.listenAgainBtn}>
              <Text style={styles.listenAgainText}>🔊 Listen Again</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Next Step CTA */}
      {isBlended && (
        <Pressable
          accessibilityRole="button"
          onPress={handleNext}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Blending ⭐' : 'Next Word ➔'}
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
    backgroundColor: '#6366F1',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  instruction: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4B5563',
    textAlign: 'center',
  },
  boardCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#6366F1',
    padding: 18,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  blocksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  soundBlock: {
    width: 78,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 2.5,
    borderColor: '#A5B4FC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  soundBlockTapped: {
    backgroundColor: '#C7D2FE',
    borderColor: '#6366F1',
  },
  soundBlockBlended: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  soundBlockLetter: {
    fontSize: 40,
    fontWeight: '900',
    color: '#4338CA',
  },
  letterBlended: {
    color: '#065F46',
  },
  soundPhoneme: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  blendBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  blendBtnActive: {
    backgroundColor: '#6366F1',
  },
  blendBtnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  blendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  revealedCard: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  revealedEmoji: {
    fontSize: 60,
  },
  revealedWord: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 2,
  },
  revealedSentence: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  listenAgainBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  listenAgainText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
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
  blockWrapNormal: {
    marginHorizontal: 6,
  },
  blockWrapBlended: {
    marginHorizontal: 2,
  },
});
