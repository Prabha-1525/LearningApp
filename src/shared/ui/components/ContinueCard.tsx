import {Pressable, StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';
import {ModuleIcon} from './ModuleIcon';

export type ContinueCardProps = {
  readonly moduleTitle: string;
  readonly iconKey: string;
  readonly accentColor: string;
  readonly progressLabel?: string;
  readonly onPress?: () => void;
  readonly testID?: string;
};

/**
 * Surfaces the last activity so short child sessions resume fast.
 */
export function ContinueCard({
  moduleTitle,
  iconKey,
  accentColor,
  progressLabel = 'Continue',
  onPress,
  testID,
}: ContinueCardProps) {
  const {theme, radius, space, motionScale} = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Continue ${moduleTitle}`}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: theme.colors.sand,
          borderRadius: radius.lg,
          padding: space.md,
          transform: [{scale: pressed ? motionScale.pressed : 1}],
        },
      ]}>
      <View style={[styles.row, {gap: space.sm}]}>
        <ModuleIcon iconKey={iconKey} accentColor={accentColor} />
        <View style={styles.copy}>
          <AppText variant="caption" tone="muted">
            {progressLabel}
          </AppText>
          <AppText variant="headline" tone="ink" numberOfLines={1}>
            {moduleTitle}
          </AppText>
        </View>
        <AppText variant="title" tone="primary">
          →
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 96,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
  },
});
