import {Pressable, StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';
import {Chip} from './Chip';
import {ModuleIcon} from './ModuleIcon';

export type ModuleCardProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly iconKey: string;
  readonly accentColor: string;
  readonly ageLabel?: string;
  readonly locked?: boolean;
  readonly onPress?: () => void;
  readonly testID?: string;
};

/**
 * Registry-driven subject tile for Home and Module Selection.
 */
export function ModuleCard({
  title,
  subtitle,
  iconKey,
  accentColor,
  ageLabel,
  locked = false,
  onPress,
  testID,
}: ModuleCardProps) {
  const {theme, radius, space, motionScale} = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{disabled: locked}}
      disabled={locked && onPress == null}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius.md,
          borderColor: theme.colors.border,
          borderLeftColor: accentColor,
          padding: space.md,
          opacity: locked ? 0.55 : 1,
          transform: [{scale: pressed && !locked ? motionScale.pressed : 1}],
        },
      ]}>
      <View style={[styles.row, {gap: space.sm}]}>
        <ModuleIcon iconKey={iconKey} accentColor={accentColor} size={56} />
        <View style={styles.copy}>
          <AppText variant="headline" tone="ink" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="muted" numberOfLines={2}>
              {subtitle}
            </AppText>
          ) : null}
          <View style={[styles.chips, {marginTop: space.xs, gap: space.xxs}]}>
            {ageLabel ? <Chip label={ageLabel} tone="sun" /> : null}
            {locked ? <Chip label="Locked" tone="locked" /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderLeftWidth: 6,
    minHeight: 120,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
