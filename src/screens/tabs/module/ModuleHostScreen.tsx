import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AppSafeAreaView} from '@components';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {isModuleId} from '@core/domain';
import {moduleRegistry} from '@modules';
import {
  AppText,
  EmptyState,
  LearningModuleCard,
  ModuleIcon,
  PrimaryButton,
  SecondaryButton,
  TopAppBar,
  space,
} from '@shared/ui';

import type {MainStackParamList} from '@navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'ModuleHost'>;

/**
 * Host for registered module navigators.
 * Coming-soon modules stay registry-driven — no Home/ModuleHost id switches.
 */
export function ModuleHostScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const moduleId = route.params.moduleId;
  const manifest = isModuleId(moduleId)
    ? moduleRegistry.get(moduleId)
    : undefined;

  if (manifest == null) {
    return (
      <AppSafeAreaView>
        <TopAppBar title="Module" onBack={() => navigation.goBack()} />
        <EmptyState
          title="Module not found"
          message="This learning module is not registered."
          actionLabel="Go home"
          onAction={() => navigation.navigate('Tabs')}
        />
      </AppSafeAreaView>
    );
  }

  if (!manifest.isEnabled()) {
    return (
      <AppSafeAreaView testID="module-coming-soon">
        <TopAppBar
          title={t(manifest.homeCard.titleKey, {defaultValue: manifest.id})}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.body}>
          <LearningModuleCard
            manifest={manifest}
            comingSoonLabel={t('home.comingSoon')}
          />
          <AppText variant="body" tone="muted" style={styles.center}>
            {t('home.comingSoon')}
          </AppText>
          <SecondaryButton
            label={t('common.back')}
            onPress={() => navigation.navigate('Tabs')}
          />
        </View>
      </AppSafeAreaView>
    );
  }

  const Navigator = manifest.getNavigator();
  if (Navigator != null) {
    return <Navigator />;
  }

  return (
    <AppSafeAreaView testID="module-host-screen">
      <TopAppBar
        title={t(manifest.homeCard.titleKey, {defaultValue: manifest.id})}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <ModuleIcon
          iconKey={manifest.homeCard.iconKey}
          accentColor={manifest.homeCard.accentColor}
          size={72}
        />
        <AppText variant="headline" tone="ink">
          {t(manifest.homeCard.titleKey, {defaultValue: manifest.id})}
        </AppText>
        <AppText variant="body" tone="muted" style={styles.center}>
          {t(manifest.homeCard.subtitleKey ?? '', {
            defaultValue: 'Lessons open here next.',
          })}
        </AppText>
        <PrimaryButton
          label={t('common.back')}
          onPress={() => navigation.navigate('Tabs')}
        />
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: space.md,
    marginTop: space.lg,
  },
  center: {
    textAlign: 'center',
  },
});
