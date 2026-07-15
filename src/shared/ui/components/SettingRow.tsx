import {StyleSheet, Switch, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';

export type SettingRowProps = {
  readonly label: string;
  readonly description?: string;
  readonly value?: boolean;
  readonly onValueChange?: (value: boolean) => void;
  readonly trailing?: React.ReactNode;
  readonly gated?: boolean;
  readonly testID?: string;
};

/**
 * Predictable settings / parent toggle row.
 */
export function SettingRow({
  label,
  description,
  value,
  onValueChange,
  trailing,
  gated = false,
  testID,
}: SettingRowProps) {
  const {theme, space} = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.row,
        {
          paddingVertical: space.md,
          borderBottomColor: theme.colors.border,
          gap: space.sm,
        },
      ]}>
      <View style={styles.copy}>
        <View style={styles.labelRow}>
          <AppText variant="bodyStrong" tone="ink">
            {label}
          </AppText>
          {gated ? (
            <AppText variant="caption" tone="muted">
              Parent
            </AppText>
          ) : null}
        </View>
        {description ? (
          <AppText variant="caption" tone="muted">
            {description}
          </AppText>
        ) : null}
      </View>
      {trailing}
      {value != null && onValueChange ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.actionPrimary,
          }}
          thumbColor={theme.colors.surface}
          accessibilityLabel={label}
        />
      ) : null}
    </View>
  );
}

export type SettingGroupProps = {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly testID?: string;
};

export function SettingGroup({title, children, testID}: SettingGroupProps) {
  const {theme, radius, space} = useTheme();

  return (
    <View style={{gap: space.xs}} testID={testID}>
      <AppText variant="caption" tone="muted">
        {title}
      </AppText>
      <View
        style={[
          styles.group,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: radius.md,
            borderColor: theme.colors.border,
            paddingHorizontal: space.md,
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  group: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
