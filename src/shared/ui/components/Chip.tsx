import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type ChipTone = 'neutral' | 'sun' | 'success' | 'locked' | 'accent';

export type ChipProps = {
  readonly label: string;
  readonly tone?: ChipTone;
  readonly accentColor?: string;
  readonly testID?: string;
};

/**
 * Compact status label (age band, locked, difficulty).
 */
export function Chip({
  label,
  tone = 'neutral',
  accentColor,
  testID,
}: ChipProps) {
  const {theme, radius, space} = useTheme();

  const backgroundColor =
    tone === 'sun'
      ? theme.colors.sand
      : tone === 'success'
      ? `${theme.colors.success}22`
      : tone === 'locked'
      ? theme.colors.border
      : tone === 'accent' && accentColor
      ? `${accentColor}22`
      : theme.colors.surface;

  const textTone =
    tone === 'success'
      ? 'primary'
      : tone === 'locked'
      ? 'muted'
      : tone === 'sun'
      ? 'ink'
      : 'ink';

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor,
          borderRadius: radius.pill,
          paddingHorizontal: space.sm,
          paddingVertical: space.xxs,
          borderColor: accentColor ?? theme.colors.border,
          borderWidth: tone === 'accent' ? 1 : StyleSheet.hairlineWidth,
        },
      ]}>
      <AppText variant="caption" tone={textTone}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
});
