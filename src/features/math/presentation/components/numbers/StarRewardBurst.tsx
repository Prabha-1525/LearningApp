import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {AppText, animationPresets} from '@shared/ui';

type Props = {
  readonly visible: boolean;
  readonly count?: number;
};

const STAR_POSITIONS = [
  {x: -60, y: -40},
  {x: 50, y: -50},
  {x: -30, y: 30},
  {x: 70, y: 20},
];

/** Floating star burst on correct answers. */
export function StarRewardBurst({visible, count = 3}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {STAR_POSITIONS.slice(0, count).map((pos, i) => (
        <FloatingStar key={i} delay={i * 80} x={pos.x} y={pos.y} />
      ))}
    </View>
  );
}

function FloatingStar({delay, x, y}: {delay: number; x: number; y: number}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, {duration: animationPresets.starPopMs}),
        withDelay(500, withTiming(0, {duration: 300})),
      ),
    );
    translateY.value = withDelay(delay, withTiming(-50, {duration: 700}));
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.2, {duration: animationPresets.starPopMs}),
        withTiming(0.8, {duration: 400}),
      ),
    );
  }, [delay, opacity, scale, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {translateX: x},
      {translateY: translateY.value + y},
      {scale: scale.value},
    ],
  }));

  return (
    <Animated.View style={[styles.star, style]}>
      <AppText style={styles.starText}>⭐</AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  star: {position: 'absolute'},
  starText: {fontSize: 32},
});
