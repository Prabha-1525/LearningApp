import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {AppText} from '@shared/ui';

type Props = {
  readonly visible: boolean;
  readonly label?: string;
};

export function CelebrationStars({visible, label}: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      scale.value = 0;
      opacity.value = 0;
      return;
    }
    scale.value = withSequence(
      withTiming(1.2, {duration: 280}),
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
    <Animated.View pointerEvents="none" style={[styles.wrap, style]}>
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
    gap: 8,
  },
  stars: {fontSize: 42, color: '#F4B400', textAlign: 'center'},
  center: {textAlign: 'center'},
});
