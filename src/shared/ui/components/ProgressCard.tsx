import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';
import {ProgressStars} from './ProgressStars';

export type ProgressCardProps = {
  readonly title: string;
  readonly stars: number;
  readonly detail?: string;
  readonly testID?: string;
};

export function ProgressCard({
  title,
  stars,
  detail,
  testID,
}: ProgressCardProps) {
  const {theme, radius, space} = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius.md,
          borderColor: theme.colors.border,
          padding: space.md,
          gap: space.xs,
        },
      ]}>
      <AppText variant="headline" tone="ink">
        {title}
      </AppText>
      <ProgressStars stars={stars} />
      {detail ? (
        <AppText variant="caption" tone="muted">
          {detail}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
