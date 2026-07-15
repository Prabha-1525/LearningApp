import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type RewardCardProps = {
  readonly title: string;
  readonly detail: string;
  readonly starsEarned: number;
  readonly testID?: string;
};

export function RewardCard({
  title,
  detail,
  starsEarned,
  testID,
}: RewardCardProps) {
  const {theme, radius, space} = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius.lg,
          borderColor: theme.colors.reward,
          padding: space.lg,
          gap: space.sm,
        },
      ]}>
      <AppText variant="title" tone="reward">
        +{starsEarned}
      </AppText>
      <AppText variant="headline" tone="ink">
        {title}
      </AppText>
      <AppText variant="body" tone="muted">
        {detail}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    alignItems: 'center',
  },
});
