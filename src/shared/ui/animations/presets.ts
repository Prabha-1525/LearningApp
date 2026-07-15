import {AccessibilityInfo} from 'react-native';
import type {WithSpringConfig, WithTimingConfig} from 'react-native-reanimated';

import {motion, motionScale} from '../theme/motion';

/**
 * Shared motion recipes for the Atomic UI library.
 * All learning modules should reuse these — do not invent one-off timings.
 *
 * Note: Avoid importing runtime Easing here so Jest can load tokens without
 * native worklets initialization.
 */
export const animationPresets = {
  pressScale: motionScale.pressed,
  enterMs: motion.enter,
  sheetMs: motion.sheet,
  shakeMs: motion.shake,
  starPopMs: motion.starPop,
  fade: {
    duration: motion.enter,
  } satisfies WithTimingConfig,
  slide: {
    duration: motion.sheet,
  } satisfies WithTimingConfig,
  spring: {
    damping: 16,
    stiffness: 180,
    mass: 0.8,
  } satisfies WithSpringConfig,
  snappySpring: {
    damping: 18,
    stiffness: 220,
    mass: 0.7,
  } satisfies WithSpringConfig,
} as const;

let reduceMotionCached: boolean | null = null;

export async function getReduceMotionEnabled(): Promise<boolean> {
  if (reduceMotionCached != null) {
    return reduceMotionCached;
  }
  try {
    reduceMotionCached = await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    reduceMotionCached = false;
  }
  return reduceMotionCached;
}

export function subscribeReduceMotion(
  listener: (enabled: boolean) => void,
): () => void {
  const sub = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    enabled => {
      reduceMotionCached = enabled;
      listener(enabled);
    },
  );
  void getReduceMotionEnabled().then(listener);
  return () => sub.remove();
}
