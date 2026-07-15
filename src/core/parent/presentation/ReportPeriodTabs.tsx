import {Pressable, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, useTheme} from '@shared/ui';

export type ReportTab = 'week' | 'month';

export type ReportPeriodTabsProps = {
  readonly value: ReportTab;
  readonly onChange: (value: ReportTab) => void;
};

export function ReportPeriodTabs({value, onChange}: ReportPeriodTabsProps) {
  const {t} = useTranslation();
  const {theme, radius, space} = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.sand,
          borderRadius: radius.md,
          padding: space.xxs,
        },
      ]}>
      {(['week', 'month'] as const).map(tab => {
        const active = value === tab;
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            onPress={() => onChange(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: active ? theme.colors.surface : 'transparent',
                borderRadius: radius.sm,
                paddingVertical: space.sm,
              },
            ]}>
            <AppText
              variant="bodyStrong"
              tone={active ? 'primary' : 'muted'}
              style={styles.center}>
              {tab === 'week'
                ? t('parent.weeklyReport')
                : t('parent.monthlyReport')}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
});
