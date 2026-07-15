import {Pressable, StyleSheet} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type IconButtonProps = {
  readonly label: string;
  readonly symbol: string;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly testID?: string;
};

/**
 * 56×56 round control for back / settings / sound.
 * `symbol` is a short text glyph until an icon font is wired.
 */
export function IconButton({
  label,
  symbol,
  onPress,
  disabled = false,
  testID,
}: IconButtonProps) {
  const {theme, radius} = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: radius.pill,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}>
      <AppText variant="headline" tone="ink">
        {symbol}
      </AppText>
    </Pressable>
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
