import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText, useTheme} from '@shared/ui';

type Props = {
  readonly number: number;
  readonly visible: boolean;
};

export function BigNumberHero({number, visible}: Props) {
  const {radius} = useTheme();
  const scale = useSharedValue(visible ? 1 : 0.85);
  const bounce = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.08, {duration: 280}),
        withTiming(1, {duration: 200}),
      );
      bounce.value = withRepeat(
        withSequence(
          withTiming(-6, {duration: 900}),
          withTiming(0, {duration: 900}),
        ),
        -1,
        true,
      );
    }
  }, [bounce, scale, visible]);

  const style = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: bounce.value}],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.wrap, {borderRadius: radius.lg}, style]}>
      <AppText variant="display" style={styles.number}>
        {number}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    backgroundColor: '#FFF0F8',
    borderWidth: 4,
    borderColor: '#E4578C',
    paddingHorizontal: 48,
    paddingVertical: 20,
    minWidth: 140,
    alignItems: 'center',
  },
  number: {
    fontSize: 96,
    lineHeight: 104,
    color: '#2D1B4E',
    fontWeight: '800',
  },
});
