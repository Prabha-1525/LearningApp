import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type ProgressStarsProps = {
  readonly stars: number;
  readonly maxStars?: number;
  readonly label?: string;
  readonly testID?: string;
};

/**
 * Shared star meter for Home, Profile, and module hubs.
 */
export function ProgressStars({
  stars,
  maxStars = 5,
  label,
  testID,
}: ProgressStarsProps) {
  const {theme, space} = useTheme();
  const filled = Math.max(0, Math.min(stars, maxStars));

  return (
    <View style={[styles.row, {gap: space.xs}]} testID={testID}>
      {label ? (
        <AppText variant="caption" tone="muted">
          {label}
        </AppText>
      ) : null}
      <View style={[styles.stars, {gap: space.xxs}]}>
        {Array.from({length: maxStars}, (_, index) => {
          const isOn = index < filled;
          return (
            <View
              key={`star-${index}`}
              style={[
                styles.star,
                {
                  backgroundColor: isOn
                    ? theme.colors.star
                    : theme.colors.border,
                },
              ]}
            />
          );
        })}
      </View>
      <AppText variant="bodyStrong" tone="ink">
        {stars}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 14,
    height: 14,
    borderRadius: 3,
    transform: [{rotate: '45deg'}],
  },
});
