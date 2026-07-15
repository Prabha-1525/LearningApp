import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';

import {usePulse} from '../animations';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type RewardBadgeProps = {
  readonly label?: string;
  readonly count?: number;
  readonly active?: boolean;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Atom — star / reward chip for lessons, Home, and Reward screens.
 */
export function RewardBadge({
  label = 'Stars',
  count,
  active = true,
  reduceMotion = false,
  testID,
}: RewardBadgeProps) {
  const {theme, radius, space} = useTheme();
  const pulseStyle = usePulse(active, reduceMotion);

  return (
    <Animated.View
      testID={testID}
      accessibilityLabel={count != null ? `${count} ${label}` : label}
      style={[
        styles.base,
        pulseStyle,
        {
          backgroundColor: theme.colors.sand,
          borderRadius: radius.pill,
          paddingHorizontal: space.sm,
          paddingVertical: space.xxs,
          borderColor: theme.colors.star,
        },
      ]}>
      <View style={[styles.diamond, {backgroundColor: theme.colors.star}]} />
      <AppText variant="caption" tone="ink">
        {count != null ? `${count} ${label}` : label}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  diamond: {
    width: 12,
    height: 12,
    borderRadius: 2,
    transform: [{rotate: '45deg'}],
  },
});
