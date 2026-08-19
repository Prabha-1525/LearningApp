import {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  readonly visible: boolean;
  readonly label?: string;
};

/** Animated popup badge shown when user answers correctly. */
export function CelebrationStars({visible, label}: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (!visible) {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 20;
      return;
    }

    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 160,
    });
    translateY.value = withSpring(0, {
      damping: 14,
      stiffness: 140,
    });
    opacity.value = withSequence(
      withTiming(1, {duration: 180}),
      withDelay(1100, withTiming(0, {duration: 300})),
    );
  }, [opacity, scale, translateY, visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}, {translateY: translateY.value}],
  }));

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <Animated.View style={[styles.card, animStyle]}>
        <View style={styles.starsRow}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.starBig}>⭐</Text>
          <Text style={styles.starBig}>🌟</Text>
          <Text style={styles.starBig}>⭐</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>
        <Text style={styles.labelTitle}>{label ?? 'Great Job!'} 🎉</Text>
        <Text style={styles.subtext}>You solved it correctly!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 6,
    borderWidth: 3,
    borderColor: '#4ADE80',
    shadowColor: '#166534',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starBig: {
    fontSize: 32,
  },
  sparkle: {
    fontSize: 22,
  },
  labelTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
});
