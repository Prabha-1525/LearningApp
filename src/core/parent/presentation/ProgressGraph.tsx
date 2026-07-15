import {StyleSheet, View} from 'react-native';

import {AppText, useTheme} from '@shared/ui';

export type ProgressGraphPoint = {
  readonly label: string;
  readonly value: number;
};

export type ProgressGraphProps = {
  readonly title: string;
  readonly unitLabel: string;
  readonly points: readonly ProgressGraphPoint[];
  readonly testID?: string;
};

/**
 * Lightweight bar chart — no chart dependency; parent-readable.
 */
export function ProgressGraph({
  title,
  unitLabel,
  points,
  testID,
}: ProgressGraphProps) {
  const {theme, space, radius} = useTheme();
  const max = Math.max(1, ...points.map(point => point.value));

  return (
    <View
      testID={testID}
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: radius.md,
          padding: space.md,
          gap: space.sm,
        },
      ]}>
      <View style={styles.header}>
        <AppText variant="headline" tone="ink">
          {title}
        </AppText>
        <AppText variant="caption" tone="muted">
          {unitLabel}
        </AppText>
      </View>
      <View style={[styles.chart, {gap: space.xs}]}>
        {points.map(point => {
          const height = Math.max(8, Math.round((point.value / max) * 96));
          return (
            <View key={point.label} style={styles.col}>
              <AppText variant="caption" tone="muted">
                {point.value}
              </AppText>
              <View
                style={[
                  styles.barTrack,
                  {
                    backgroundColor: theme.colors.border,
                    borderRadius: radius.sm,
                  },
                ]}>
                <View
                  style={{
                    height,
                    width: '100%',
                    backgroundColor: theme.colors.actionPrimary,
                    borderRadius: radius.sm,
                  }}
                />
              </View>
              <AppText variant="caption" tone="ink">
                {point.label}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    width: '70%',
    height: 100,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});
