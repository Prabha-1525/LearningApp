import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ColorMixingRecipe} from '../../domain/entities/drawingEntities';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

interface ColorMixingBoardProps {
  readonly recipes: readonly ColorMixingRecipe[];
  readonly onCompleteAll?: () => void;
}

export function ColorMixingBoard({
  recipes,
  onCompleteAll,
}: ColorMixingBoardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMixed, setIsMixed] = useState(false);
  const leftSlideAnim = React.useRef(new Animated.Value(0)).current;
  const rightSlideAnim = React.useRef(new Animated.Value(0)).current;
  const resultScaleAnim = React.useRef(new Animated.Value(0)).current;

  const currentRecipe = recipes[currentIdx] ?? recipes[0]!;
  const isLast = currentIdx === recipes.length - 1;

  const handleMix = () => {
    if (isMixed) return;
    drawingAudio.playColorMixMagicSound();

    Animated.parallel([
      Animated.timing(leftSlideAnim, {
        toValue: 40,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(rightSlideAnim, {
        toValue: -40,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMixed(true);
      Animated.spring(resultScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
      drawingAudio.speak(
        `${currentRecipe.color1.name} plus ${currentRecipe.color2.name} makes ${currentRecipe.resultColor.name}!`,
      );
    });
  };

  const handleNext = () => {
    if (isLast) {
      if (onCompleteAll) onCompleteAll();
    } else {
      setIsMixed(false);
      leftSlideAnim.setValue(0);
      rightSlideAnim.setValue(0);
      resultScaleAnim.setValue(0);
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {recipes.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIdx && styles.dotActive,
              idx < currentIdx && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      <Text style={styles.headerTitle}>Color Mixing Laboratory 🧪</Text>
      <Text style={styles.headerSub}>
        Watch primary colors blend into magic new colors!
      </Text>

      {/* Mixing Arena Card */}
      <View style={styles.arenaCard}>
        {!isMixed ? (
          <View style={styles.ingredientRow}>
            {/* Color 1 */}
            <Animated.View
              style={[
                styles.paintPot,
                {
                  backgroundColor: currentRecipe.color1.hex,
                  transform: [{translateX: leftSlideAnim}],
                },
              ]}>
              <Text style={styles.potEmoji}>{currentRecipe.color1.emoji}</Text>
              <Text style={styles.potName}>{currentRecipe.color1.name}</Text>
            </Animated.View>

            <Text style={styles.plusSign}>➕</Text>

            {/* Color 2 */}
            <Animated.View
              style={[
                styles.paintPot,
                {
                  backgroundColor: currentRecipe.color2.hex,
                  transform: [{translateX: rightSlideAnim}],
                },
              ]}>
              <Text style={styles.potEmoji}>{currentRecipe.color2.emoji}</Text>
              <Text style={styles.potName}>{currentRecipe.color2.name}</Text>
            </Animated.View>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.resultPot,
              {
                backgroundColor: currentRecipe.resultColor.hex,
                transform: [{scale: resultScaleAnim}],
              },
            ]}>
            <Text style={styles.sparkleIcon}>✨ 🎨 ✨</Text>
            <Text style={styles.resultEmoji}>
              {currentRecipe.resultColor.emoji}
            </Text>
            <Text style={styles.resultNameTitle}>
              {currentRecipe.resultColor.name.toUpperCase()}!
            </Text>
            <Text style={styles.resultDesc}>
              {currentRecipe.resultColor.description}
            </Text>
          </Animated.View>
        )}

        {/* Action Button */}
        {!isMixed ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mix colors"
            onPress={handleMix}
            style={styles.mixBtn}>
            <Text style={styles.mixBtnText}>🧪 Mix Paints Together!</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next recipe"
            onPress={handleNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {isLast ? 'Complete Color Lab ⭐' : 'Next Mix ➔'}
            </Text>
          </Pressable>
        )}
      </View>
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
    backgroundColor: '#8B5CF6',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  arenaCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#EDE9FE',
    padding: 20,
    alignItems: 'center',
    gap: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    height: 170,
  },
  paintPot: {
    width: 110,
    height: 130,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  potEmoji: {
    fontSize: 44,
  },
  potName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  plusSign: {
    fontSize: 28,
  },
  resultPot: {
    width: '100%',
    minHeight: 180,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  sparkleIcon: {
    fontSize: 18,
  },
  resultEmoji: {
    fontSize: 48,
  },
  resultNameTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  resultDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
  },
  mixBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  mixBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
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
});
