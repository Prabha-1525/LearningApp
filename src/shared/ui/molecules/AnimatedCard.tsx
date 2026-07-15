import type {PropsWithChildren, ReactNode} from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';

import {AnimatedPressable, useFadeIn, useSlideUp} from '../animations';
import {useTheme} from '../theme';

export type AnimatedCardProps = PropsWithChildren<{
  readonly onPress?: () => void;
  readonly accentColor?: string;
  readonly padded?: boolean;
  readonly reduceMotion?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly footer?: ReactNode;
  readonly testID?: string;
}>;

/**
 * Molecule — pressable surface with enter animation.
 * Use for module tiles, lesson cards, and list rows across features.
 */
export function AnimatedCard({
  children,
  onPress,
  accentColor,
  padded = true,
  reduceMotion = false,
  style,
  footer,
  testID,
}: AnimatedCardProps) {
  const {theme, radius, space} = useTheme();
  const fadeStyle = useFadeIn(true, reduceMotion);
  const slideStyle = useSlideUp(true, reduceMotion);

  const surfaceStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: radius.md,
    borderColor: theme.colors.border,
    borderLeftColor: accentColor ?? theme.colors.border,
    borderLeftWidth: accentColor ? 6 : 1,
    padding: padded ? space.md : 0,
  };

  const body = (
    <>
      {children}
      {footer ? <View style={{marginTop: space.sm}}>{footer}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Animated.View style={[fadeStyle, slideStyle]}>
        <AnimatedPressable
          testID={testID}
          accessibilityRole="button"
          onPress={onPress}
          reduceMotion={reduceMotion}
          style={[styles.card, surfaceStyle, style]}>
          {body}
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      testID={testID}
      style={[styles.card, fadeStyle, slideStyle, surfaceStyle, style]}>
      {body}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
