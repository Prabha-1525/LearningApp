import {StyleSheet} from 'react-native';

import {AnimatedPressable} from '../animations';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type BackButtonProps = {
  readonly onPress?: () => void;
  readonly label?: string;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Atom — 56×56 back control for TopAppBar and module screens.
 */
export function BackButton({
  onPress,
  label = 'Go back',
  reduceMotion = false,
  testID,
}: BackButtonProps) {
  const {theme, radius} = useTheme();

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      reduceMotion={reduceMotion}
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: radius.pill,
        },
      ]}>
      <AppText variant="headline" tone="ink">
        ←
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 56,
    height: 56,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
