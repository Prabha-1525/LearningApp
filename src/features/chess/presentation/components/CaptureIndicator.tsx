import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export type CaptureIndicatorProps = {
  readonly size: number;
  readonly color?: string;
};

export function CaptureIndicator({
  size,
  color = '#EF4444',
}: CaptureIndicatorProps) {
  const ringSize = size * 0.84;
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.06, {duration: 600}), -1, true);
    opacity.value = withRepeat(withTiming(0.95, {duration: 600}), -1, true);
  }, [opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.ring,
          animStyle,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderColor: color,
          },
        ]}
      />
      {/* Corner indicators for additional non-color clarity */}
      <View
        style={[
          styles.cornerBadge,
          {
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  ring: {
    borderWidth: 4,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  cornerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
