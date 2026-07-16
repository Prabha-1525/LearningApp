import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {AppText, useTheme} from '@shared/ui';

type Props = {
  readonly visible: boolean;
  readonly label?: string;
};

/**
 * Lightweight starburst celebration for chess wins / captures.
 */
export function CelebrationStars({visible, label}: Props) {
  const {space} = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      scale.value = 0;
      opacity.value = 0;
      return;
    }
    scale.value = withSequence(
      withTiming(1.15, {duration: 280}),
      withTiming(1, {duration: 180}),
    );
    opacity.value = withSequence(
      withTiming(1, {duration: 200}),
      withDelay(900, withTiming(0, {duration: 350})),
    );
  }, [opacity, scale, visible]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, style, {gap: space.xs}]}>
      <AppText variant="display" style={styles.stars}>
        ✦ ★ ✦
      </AppText>
      {label ? (
        <AppText variant="headline" tone="ink" style={styles.center}>
          {label}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  stars: {
    fontSize: 42,
    textAlign: 'center',
    color: '#F4B400',
  },
  center: {
    textAlign: 'center',
  },
});
