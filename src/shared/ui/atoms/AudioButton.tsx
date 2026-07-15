import {StyleSheet} from 'react-native';

import {AnimatedPressable} from '../animations';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type AudioButtonProps = {
  readonly enabled: boolean;
  readonly onToggle: (enabled: boolean) => void;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Atom — sound on/off control shared by shell and modules.
 */
export function AudioButton({
  enabled,
  onToggle,
  reduceMotion = false,
  testID,
}: AudioButtonProps) {
  const {theme, radius} = useTheme();

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={enabled ? 'Mute sound' : 'Unmute sound'}
      accessibilityState={{checked: enabled}}
      onPress={() => onToggle(!enabled)}
      reduceMotion={reduceMotion}
      style={[
        styles.base,
        {
          backgroundColor: enabled
            ? theme.colors.actionPrimary
            : theme.colors.surface,
          borderColor: enabled
            ? theme.colors.actionPrimary
            : theme.colors.border,
          borderRadius: radius.pill,
        },
      ]}>
      <AppText
        variant="headline"
        style={{
          color: enabled
            ? theme.colors.actionPrimaryLabel
            : theme.colors.inkMuted,
        }}>
        {enabled ? '♪' : '×'}
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
