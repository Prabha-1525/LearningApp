import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {AppText} from '@shared/ui';

const CONFETTI = ['🎉', '⭐', '✨', '🌟', '🎈', '💫'];

type Props = {
  readonly visible: boolean;
  readonly label?: string;
};

export function ConfettiBurst({visible, label}: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      scale.value = 0.6;
      return;
    }
    opacity.value = withSequence(
      withTiming(1, {duration: 200}),
      withDelay(1100, withTiming(0, {duration: 400})),
    );
    scale.value = withSequence(
      withTiming(1.15, {duration: 300}),
      withTiming(1, {duration: 200}),
    );
  }, [opacity, scale, visible]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, wrapStyle]}>
      <View style={styles.confettiRow}>
        {CONFETTI.map((c, i) => (
          <AppText key={i} style={styles.piece}>
            {c}
          </AppText>
        ))}
      </View>
      {label ? (
        <AppText variant="headline" tone="ink" style={styles.label}>
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
    zIndex: 30,
    gap: 12,
  },
  confettiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 280,
  },
  piece: {fontSize: 36},
  label: {textAlign: 'center', fontWeight: '800'},
});
