import {StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type ParentStatCardProps = {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly testID?: string;
};

/**
 * Denser parent metric tile — calmer than child ModuleCards.
 */
export function ParentStatCard({
  label,
  value,
  hint,
  testID,
}: ParentStatCardProps) {
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
          gap: space.xxs,
        },
      ]}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="title" tone="ink">
        {value}
      </AppText>
      {hint ? (
        <AppText variant="caption" tone="muted">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    minWidth: 120,
    flexGrow: 1,
  },
});
