import {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  PIECE_GLYPH,
  pieceColor,
  type PieceLetter,
} from '../../domain/board/squares';

export type ChessPieceProps = {
  readonly letter: PieceLetter;
  readonly size: number;
  readonly selected?: boolean;
  readonly dimmed?: boolean;
  readonly isCaptured?: boolean;
  readonly isShaking?: boolean;
};

export function ChessPiece({
  letter,
  size,
  selected = false,
  dimmed = false,
  isCaptured = false,
  isShaking = false,
}: ChessPieceProps) {
  const glyph = PIECE_GLYPH[letter];
  const isWhite = pieceColor(letter) === 'white';

  const scale = useSharedValue(1);
  const opacity = useSharedValue(dimmed ? 0.4 : 1);
  const translateX = useSharedValue(0);

  // Selection scale bounce effect
  useEffect(() => {
    if (selected) {
      scale.value = withSpring(1.18, {damping: 12, stiffness: 180});
    } else {
      scale.value = withSpring(1, {damping: 14, stiffness: 150});
    }
  }, [scale, selected]);

  // Dimming opacity effect
  useEffect(() => {
    opacity.value = withTiming(dimmed ? 0.35 : 1, {duration: 250});
  }, [dimmed, opacity]);

  // Capture fade / scale out
  useEffect(() => {
    if (isCaptured) {
      scale.value = withTiming(0, {duration: 300});
      opacity.value = withTiming(0, {duration: 300});
    }
  }, [isCaptured, opacity, scale]);

  // Illegal move gentle shake
  useEffect(() => {
    if (isShaking) {
      translateX.value = withSequence(
        withTiming(-8, {duration: 60}),
        withTiming(8, {duration: 60}),
        withTiming(-6, {duration: 60}),
        withTiming(6, {duration: 60}),
        withTiming(0, {duration: 60}),
      );
    }
  }, [isShaking, translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateX: translateX.value}],
    opacity: opacity.value,
  }));

  const fontSize = size * 0.72;

  return (
    <Animated.View
      style={[styles.container, animStyle, {width: size, height: size}]}>
      <View
        style={[
          styles.pieceCircle,
          {
            width: size * 0.82,
            height: size * 0.82,
            borderRadius: (size * 0.82) / 2,
            backgroundColor: isWhite ? '#FFFFFF' : '#2D3748',
            borderColor: isWhite ? '#CBD5E1' : '#1E293B',
          },
        ]}>
        <Text
          style={[
            styles.glyphText,
            {
              fontSize,
              color: isWhite ? '#1E293B' : '#F8FAFC',
              textShadowColor: isWhite
                ? 'rgba(0, 0, 0, 0.15)'
                : 'rgba(255, 255, 255, 0.25)',
              textShadowOffset: {width: 0, height: 1},
              textShadowRadius: 2,
            },
          ]}>
          {glyph}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pieceCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  glyphText: {
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: undefined,
  },
});
