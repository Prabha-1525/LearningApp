import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type MascotSpotProps = {
  readonly mood?: 'happy' | 'cheer' | 'calm';
  readonly label?: string;
  readonly size?: number;
  readonly testID?: string;
};

/**
 * Optional guide character slot for Welcome / Reward — non-forcing placeholder.
 */
export function MascotSpot({
  mood = 'happy',
  label,
  size = 120,
  testID,
}: MascotSpotProps) {
  const {theme, radius} = useTheme();

  const fill =
    mood === 'cheer'
      ? theme.colors.reward
      : mood === 'calm'
      ? theme.colors.actionPrimary
      : theme.colors.actionSun;

  return (
    <View
      style={styles.wrap}
      testID={testID}
      accessibilityLabel={label ?? 'Mascot'}>
      <View
        style={[
          styles.body,
          {
            width: size,
            height: size,
            borderRadius: radius.lg,
            backgroundColor: `${fill}33`,
            borderColor: fill,
          },
        ]}>
        <View
          style={[
            styles.face,
            {
              backgroundColor: fill,
              width: size * 0.45,
              height: size * 0.45,
              borderRadius: size * 0.225,
            },
          ]}
        />
      </View>
      {label ? (
        <AppText variant="caption" tone="muted">
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
  },
  body: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {},
});
