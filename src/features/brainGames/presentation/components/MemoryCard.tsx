import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type MemoryCardProps = {
  readonly symbol: string;
  readonly isFlipped: boolean;
  readonly isMatched: boolean;
  readonly accentColor: string;
  readonly onPress?: () => void;
  readonly size?: number;
};

export function MemoryCard({
  symbol,
  isFlipped,
  isMatched,
  accentColor,
  onPress,
  size = 72,
}: MemoryCardProps) {
  const rotation = useSharedValue(isFlipped ? 180 : 0);
  const matchOpacity = useSharedValue(isMatched ? 0 : 1);
  const matchScale = useSharedValue(isMatched ? 0 : 1);

  useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, {duration: 260});
  }, [isFlipped, rotation]);

  useEffect(() => {
    if (isMatched) {
      matchScale.value = withSequence(
        withTiming(1.12, {duration: 150}),
        withTiming(0, {duration: 250}),
      );
      matchOpacity.value = withTiming(0, {duration: 350});
    } else {
      matchScale.value = 1;
      matchOpacity.value = 1;
    }
  }, [isMatched, matchOpacity, matchScale]);

  // Front face (emoji) — rotated 180deg by default so it's hidden; rotates to 0deg (relative) when isFlipped
  const frontStyle = useAnimatedStyle(() => ({
    transform: [{rotateY: `${rotation.value - 180}deg`}],
    backfaceVisibility: 'hidden',
    position: 'absolute',
  }));

  // Back face (question mark) — facing user (0deg) by default; rotates to 180deg when isFlipped
  const backStyle = useAnimatedStyle(() => ({
    transform: [{rotateY: `${rotation.value}deg`}],
    backfaceVisibility: 'hidden',
    position: 'absolute',
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: matchOpacity.value,
    transform: [{scale: matchScale.value}],
  }));

  const cardSize = {width: size, height: size, borderRadius: size * 0.22};

  return (
    <View style={[styles.wrapper, cardSize]}>
      <Animated.View
        style={[styles.cardContainer, cardSize, cardAnimatedStyle]}>
        <Pressable
          disabled={isFlipped || isMatched}
          onPress={onPress}
          style={[styles.pressable, cardSize]}>
          {/* Back — question mark (initial state) */}
          <Animated.View
            style={[
              styles.face,
              cardSize,
              {backgroundColor: accentColor},
              backStyle,
            ]}>
            <Text style={[styles.backSymbol, {fontSize: size * 0.4}]}>?</Text>
          </Animated.View>

          {/* Front — emoji (revealed on flip) */}
          <Animated.View
            style={[
              styles.face,
              cardSize,
              styles.frontFace,
              {borderColor: accentColor},
              frontStyle,
            ]}>
            <Text style={[styles.symbol, {fontSize: size * 0.45}]}>
              {symbol}
            </Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  frontFace: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
  },
  backSymbol: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  symbol: {
    textAlign: 'center',
  },
});
