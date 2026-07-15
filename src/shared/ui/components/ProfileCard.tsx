import {Pressable, StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';
import {AvatarView} from './AvatarView';
import {ProgressStars} from './ProgressStars';

export type ProfileCardProps = {
  readonly name: string;
  readonly ageLabel: string;
  readonly avatarKey?: string;
  readonly stars?: number;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function ProfileCard({
  name,
  ageLabel,
  avatarKey,
  stars = 0,
  onPress,
  testID,
}: ProfileCardProps) {
  const {theme, radius, space, motionScale} = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${name} profile`}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius.lg,
          borderColor: theme.colors.border,
          padding: space.md,
          gap: space.sm,
          transform: [{scale: pressed ? motionScale.pressed : 1}],
        },
      ]}>
      <View style={[styles.row, {gap: space.md}]}>
        <AvatarView name={name} avatarKey={avatarKey} size={80} />
        <View style={styles.copy}>
          <AppText variant="title" tone="ink">
            {name}
          </AppText>
          <AppText variant="body" tone="muted">
            {ageLabel}
          </AppText>
          <ProgressStars stars={stars} label="Stars" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
