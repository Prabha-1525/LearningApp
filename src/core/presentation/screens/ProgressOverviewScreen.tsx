import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  AppShell,
  AppText,
  ParentStatCard,
  ScreenHeader,
  space,
} from '@shared/ui';

import type {MainStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'ProgressOverview'>;

export function ProgressOverviewScreen({navigation}: Props) {
  const {t} = useTranslation();

  return (
    <AppShell testID="progress-screen">
      <ScreenHeader
        title={t('parent.dashboard')}
        onBack={() => navigation.goBack()}
      />
      <AppText variant="body" tone="muted">
        Weekly learning snapshot
      </AppText>
      <View style={styles.row}>
        <ParentStatCard label="Minutes" value="42" hint="This week" />
        <ParentStatCard label="Stars" value="12" hint="All modules" />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.md,
  },
});
