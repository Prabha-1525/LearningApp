import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type StarCelebrationProps = {
  readonly stars: number;
  readonly maxStars?: number;
  readonly message?: string;
};

const STAR_COLORS = ['#F59E0B', '#EF4444', '#8B5CF6'];

export function StarCelebration({
  stars,
  maxStars = 3,
  message,
}: StarCelebrationProps) {
  const starScales = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  React.useEffect(() => {
    starScales.forEach((sv, i) => {
      if (i < stars) {
        sv.value = withDelay(
          i * 200,
          withSequence(
            withSpring(1.4, {damping: 8, stiffness: 200}),
            withSpring(1, {damping: 12, stiffness: 180}),
          ),
        );
      } else {
        sv.value = withTiming(0.4, {duration: 300});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stars]);

  const containerOpacity = useSharedValue(0);
  const containerAnim = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{translateY: (1 - containerOpacity.value) * 30}],
  }));

  React.useEffect(() => {
    containerOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
  }, [containerOpacity]);

  const starStyles = starScales.map(sv =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      transform: [{scale: sv.value}],
    })),
  );

  return (
    <Animated.View style={[styles.container, containerAnim]}>
      <View style={styles.starsRow}>
        {Array.from({length: maxStars}).map((_, i) => (
          <Animated.Text
            key={`cel-star-${i}`}
            style={[
              styles.star,
              {color: STAR_COLORS[i] ?? '#F59E0B'},
              starStyles[i],
            ]}>
            ⭐
          </Animated.Text>
        ))}
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  star: {
    fontSize: 52,
  },
  message: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
});
