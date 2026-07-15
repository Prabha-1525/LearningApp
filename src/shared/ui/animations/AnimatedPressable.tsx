import type {PropsWithChildren} from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import {usePressScale} from './hooks';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export type AnimatedPressableProps = PropsWithChildren<
  Omit<PressableProps, 'style'> & {
    readonly style?: StyleProp<ViewStyle>;
    readonly reduceMotion?: boolean;
  }
>;

/**
 * Pressable with shared scale spring — preferred interactive wrapper for atoms.
 */
export function AnimatedPressable({
  children,
  style,
  reduceMotion = false,
  onPressIn,
  onPressOut,
  ...rest
}: AnimatedPressableProps) {
  const {
    animatedStyle,
    onPressIn: scaleIn,
    onPressOut: scaleOut,
  } = usePressScale(reduceMotion);

  return (
    <AnimatedPressableBase
      {...rest}
      style={[animatedStyle, style]}
      onPressIn={event => {
        scaleIn();
        onPressIn?.(event);
      }}
      onPressOut={event => {
        scaleOut();
        onPressOut?.(event);
      }}>
      {children}
    </AnimatedPressableBase>
  );
}
