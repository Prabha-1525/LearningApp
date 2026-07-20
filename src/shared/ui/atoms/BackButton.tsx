import {Image, StyleSheet} from 'react-native';

import {backArrowIcon} from '@assets';

import {AnimatedPressable} from '../animations';

export type BackButtonProps = {
  readonly onPress?: () => void;
  readonly label?: string;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Atom — shared back control using common/arrow_back.png.
 */
export function BackButton({
  onPress,
  label = 'Go back',
  reduceMotion = false,
  testID,
}: BackButtonProps) {
  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      reduceMotion={reduceMotion}
      style={styles.base}>
      <Image source={backArrowIcon} style={styles.icon} resizeMode="contain" />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
});
