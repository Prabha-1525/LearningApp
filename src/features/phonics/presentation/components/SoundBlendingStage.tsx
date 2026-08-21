import React, {useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {PhonicsCvcWordItem} from '../../domain/entities/phonicsEntities';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface SoundBlendingStageProps {
  readonly cvcItem: PhonicsCvcWordItem;
  readonly onNext?: () => void;
}

export function SoundBlendingStage({cvcItem, onNext}: SoundBlendingStageProps) {
  const [activeTileIndex, setActiveTileIndex] = useState<number | null>(null);
  const [isBlended, setIsBlended] = useState(false);

  const tileSpacingAnim = useRef(new Animated.Value(14)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTapTile = (index: number) => {
    setActiveTileIndex(index);
    const sound = cvcItem.sounds[index] ?? '';
    phonicsAudio.speak(sound);

    setTimeout(() => {
      setActiveTileIndex(null);
    }, 500);
  };

  const handleBlend = async () => {
    setIsBlended(false);

    // Sequence sounds
    for (let i = 0; i < cvcItem.letters.length; i++) {
      setActiveTileIndex(i);
      phonicsAudio.speak(cvcItem.sounds[i] ?? '');
      await new Promise(r => setTimeout(r, 650));
    }
    setActiveTileIndex(null);

    // Animate tiles merging closer
    Animated.parallel([
      Animated.timing(tileSpacingAnim, {
        toValue: 2,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setIsBlended(true);
    phonicsAudio.playSuccessFanfare();
    phonicsAudio.speak(`${cvcItem.word}!`);
  };

  const handleReset = () => {
    setIsBlended(false);
    Animated.timing(tileSpacingAnim, {
      toValue: 14,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.card}>
      {/* Top Banner */}
      <Text style={styles.bannerTag}>🔗 LET'S BLEND SOUNDS</Text>

      {/* Target Word Illustration */}
      <View style={styles.illustrationBox}>
        <Text style={styles.emoji}>{cvcItem.emoji}</Text>
      </View>

      {/* Interactive Sound Tiles Row */}
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <View style={styles.tilesContainer}>
          {cvcItem.letters.map((letter, idx) => {
            const isActive = activeTileIndex === idx;

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.tileWrapper,
                  {
                    marginHorizontal: tileSpacingAnim,
                  },
                ]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Sound tile ${letter}`}
                  onPress={() => handleTapTile(idx)}
                  style={[
                    styles.letterTile,
                    isActive && styles.letterTileActive,
                    isBlended && styles.letterTileBlended,
                  ]}>
                  <Text
                    style={[
                      styles.letterChar,
                      (isActive || isBlended) && styles.letterCharActive,
                    ]}>
                    {letter}
                  </Text>
                </Pressable>
                <Text style={styles.soundSymbol}>
                  {cvcItem.soundSymbols[idx]}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      {/* Blended Result Output */}
      {isBlended && (
        <View style={styles.blendedBox}>
          <Text style={styles.blendedWord}>{cvcItem.word}</Text>
          {cvcItem.sentence && (
            <Text style={styles.sentenceText}>"{cvcItem.sentence}"</Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Blend sounds"
          onPress={handleBlend}
          style={styles.blendBtn}>
          <Text style={styles.blendBtnText}>▶️ Blend Sounds!</Text>
        </Pressable>

        {isBlended ? (
          onNext ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next word"
              onPress={onNext}
              style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>Next ➔</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Try again"
              onPress={handleReset}
              style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>🔄 Reset</Text>
            </Pressable>
          )
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tap tiles"
            onPress={() =>
              phonicsAudio.speak('Tap each letter to hear its sound!')
            }
            style={styles.hintBtn}>
            <Text style={styles.hintBtnText}>👆 Tap Tiles</Text>
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
    borderColor: '#06B6D4',
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0891B2',
    letterSpacing: 0.5,
  },
  illustrationBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECFEFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CFFAFE',
  },
  emoji: {
    fontSize: 50,
  },
  tilesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  letterTile: {
    width: 72,
    height: 76,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  letterTileActive: {
    backgroundColor: '#06B6D4',
    borderColor: '#0891B2',
  },
  letterTileBlended: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  letterChar: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1F2937',
  },
  letterCharActive: {
    color: '#FFFFFF',
  },
  soundSymbol: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0891B2',
  },
  blendedBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  blendedWord: {
    fontSize: 26,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 1,
  },
  sentenceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 6,
  },
  blendBtn: {
    flex: 1.4,
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  hintBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  hintBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '800',
  },
});
