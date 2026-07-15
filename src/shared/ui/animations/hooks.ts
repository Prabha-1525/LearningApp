import {useEffect} from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {animationPresets} from './presets';

/**
 * Atom-level press feedback used by buttons and cards.
 */
export function usePressScale(reduceMotion = false) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = () => {
    if (reduceMotion) {
      return;
    }
    scale.value = withSpring(
      animationPresets.pressScale,
      animationPresets.snappySpring,
    );
  };

  const onPressOut = () => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSpring(1, animationPresets.snappySpring);
  };

  return {animatedStyle, onPressIn, onPressOut, scale};
}

export function useFadeIn(visible = true, reduceMotion = false, delayMs = 0) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = visible ? 1 : 0;
      return;
    }
    opacity.value = withTiming(visible ? 1 : 0, {
      ...animationPresets.fade,
      duration: animationPresets.fade.duration + delayMs,
    });
  }, [delayMs, opacity, reduceMotion, visible]);

  return useAnimatedStyle(() => ({opacity: opacity.value}));
}

export function useSlideUp(
  visible = true,
  reduceMotion = false,
  distance = 24,
) {
  const progress = useSharedValue(reduceMotion || visible ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = visible ? 1 : 0;
      return;
    }
    progress.value = withTiming(visible ? 1 : 0, animationPresets.slide);
  }, [progress, reduceMotion, visible]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{translateY: (1 - progress.value) * distance}],
  }));
}

export function useShake(trigger: number, reduceMotion = false) {
  const offset = useSharedValue(0);

  useEffect(() => {
    if (trigger <= 0 || reduceMotion) {
      return;
    }
    offset.value = withTiming(
      8,
      {duration: animationPresets.shakeMs / 4},
      finished => {
        if (finished) {
          offset.value = withTiming(
            -8,
            {duration: animationPresets.shakeMs / 4},
            done => {
              if (done) {
                offset.value = withTiming(0, {
                  duration: animationPresets.shakeMs / 2,
                });
              }
            },
          );
        }
      },
    );
  }, [offset, reduceMotion, trigger]);

  return useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));
}

export function usePulse(active: boolean, reduceMotion = false) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active || reduceMotion) {
      scale.value = withTiming(1, {duration: 120});
      return;
    }
    scale.value = withSpring(1.08, animationPresets.spring, finished => {
      if (finished) {
        scale.value = withSpring(1, animationPresets.spring);
      }
    });
  }, [active, reduceMotion, scale]);

  return useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
}
