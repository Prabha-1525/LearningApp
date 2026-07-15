import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText} from '../components/AppText';
import {useTheme} from '../theme';
import {animationPresets} from '../animations';

export type ProgressBarProps = {
  readonly progress: number;
  readonly label?: string;
  readonly showPercent?: boolean;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Atom — linear progress meter (0–1). Shared by modules and shell.
 */
export function ProgressBar({
  progress,
  label,
  showPercent = false,
  reduceMotion = false,
  testID,
}: ProgressBarProps) {
  const {theme, radius, space} = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const width = useSharedValue(reduceMotion ? clamped : 0);

  useEffect(() => {
    width.value = withTiming(
      clamped,
      reduceMotion ? {duration: 0} : {duration: animationPresets.enterMs},
    );
  }, [clamped, reduceMotion, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={{gap: space.xxs}} testID={testID}>
      {(label || showPercent) && (
        <View style={styles.labelRow}>
          {label ? (
            <AppText variant="caption" tone="muted">
              {label}
            </AppText>
          ) : (
            <View />
          )}
          {showPercent ? (
            <AppText variant="caption" tone="ink">
              {Math.round(clamped * 100)}%
            </AppText>
          ) : null}
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.border,
            borderRadius: radius.pill,
          },
        ]}>
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            {
              backgroundColor: theme.colors.actionPrimary,
              borderRadius: radius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 12,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
