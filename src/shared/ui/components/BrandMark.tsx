import {Pressable, StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type BrandMarkProps = {
  readonly size?: 'sm' | 'md' | 'lg';
  readonly subtitle?: string;
  readonly onPress?: () => void;
  readonly testID?: string;
};

/**
 * Hero / header brand lockup — keeps brand as a first-class signal.
 */
export function BrandMark({
  size = 'md',
  subtitle,
  onPress,
  testID,
}: BrandMarkProps) {
  const {theme, space} = useTheme();

  const titleRole =
    size === 'lg' ? 'display' : size === 'sm' ? 'headline' : 'title';

  const content = (
    <View style={{gap: space.xxs}} testID={testID}>
      <View style={styles.row}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: theme.colors.actionSun,
              width: size === 'lg' ? 18 : 12,
              height: size === 'lg' ? 18 : 12,
              borderRadius: size === 'lg' ? 9 : 6,
            },
          ]}
        />
        <AppText variant={titleRole} tone="ink">
          Learning App
        </AppText>
      </View>
      {subtitle ? (
        <AppText variant="body" tone="muted">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="header">
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {},
});
