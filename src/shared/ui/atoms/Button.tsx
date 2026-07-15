import {
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {AnimatedPressable} from '../animations';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type ButtonSize = 'md' | 'lg';

type BaseButtonProps = {
  readonly label: string;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly size?: ButtonSize;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
  readonly accessibilityHint?: string;
  readonly style?: StyleProp<ViewStyle>;
};

function ButtonBase({
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = true,
  size = 'lg',
  reduceMotion = false,
  testID,
  accessibilityHint,
  style,
  backgroundColor,
  borderColor,
  labelColor,
  borderWidth = 0,
}: BaseButtonProps & {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly labelColor: string;
  readonly borderWidth?: number;
}) {
  const {radius, space} = useTheme();
  const isDisabled = disabled || loading;
  const minHeight = size === 'lg' ? 56 : 48;

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled: isDisabled, busy: loading}}
      disabled={isDisabled}
      onPress={onPress}
      reduceMotion={reduceMotion}
      style={[
        styles.base,
        {
          minHeight,
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: radius.md,
          opacity: isDisabled ? 0.4 : 1,
          paddingHorizontal: space.lg,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <AppText variant="button" style={{color: labelColor}}>
          {label}
        </AppText>
      )}
    </AnimatedPressable>
  );
}

/** Atom — primary CTA used across all modules. */
export function PrimaryButton(props: BaseButtonProps) {
  const {theme} = useTheme();
  return (
    <ButtonBase
      {...props}
      backgroundColor={theme.colors.actionPrimary}
      borderColor="transparent"
      labelColor={theme.colors.actionPrimaryLabel}
    />
  );
}

/** Atom — secondary / alternate safe action. */
export function SecondaryButton(props: BaseButtonProps) {
  const {theme} = useTheme();
  return (
    <ButtonBase
      {...props}
      backgroundColor={theme.colors.surface}
      borderColor={theme.colors.actionSecondaryBorder}
      borderWidth={2}
      labelColor={theme.colors.actionSecondaryLabel}
    />
  );
}

export type PrimaryButtonProps = BaseButtonProps;
export type SecondaryButtonProps = BaseButtonProps;

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
