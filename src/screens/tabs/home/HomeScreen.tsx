import {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components';
import {asChildId} from '@core/domain';
import {CelebrationOverlay, GamificationHud} from '@core/gamification';
import {
  clearCelebrations,
  ensureGamificationChild,
  setSoundEnabled,
  shiftCelebration,
} from '@core/store';
import {moduleRegistry} from '@modules';
import {
  AppText,
  AudioButton,
  BrandMark,
  ContinueCard,
  EmptyState,
  IconButton,
  LearningModuleCard,
  ResponsiveGrid,
  space,
  useTheme,
} from '@shared/ui';

import type {MainStackParamList} from '@navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const DEMO_CHILD_ID = asChildId('demo-child');

/**
 * Home maps the module registry → LearningModuleCard.
 * Adding a module never requires changes here — only modules/index registration.
 */
export function HomeScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {space: themeSpace} = useTheme();
  const soundEnabled = useAppSelector(state => state.settings.soundEnabled);
  const gamification = useAppSelector(state => state.gamification);
  const activeChild = useAppSelector(state =>
    state.profile.children.find(
      child => child.id === state.profile.activeChildId,
    ),
  );

  useEffect(() => {
    dispatch(ensureGamificationChild(DEMO_CHILD_ID));
  }, [dispatch]);

  const modules = moduleRegistry.list();
  const continueModule = moduleRegistry.listEnabled()[0];
  const childName = activeChild?.displayName ?? 'Friend';
  const celebration = gamification.pendingCelebrations[0] ?? null;

  return (
    <AppSafeAreaView testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.brandBlock}>
            <BrandMark size="sm" />
            <AppText variant="title" tone="ink">
              {t('home.greeting', {name: childName})}
            </AppText>
          </View>
          <View style={[styles.topActions, {gap: themeSpace.xs}]}>
            <AudioButton
              enabled={soundEnabled}
              onToggle={value => dispatch(setSoundEnabled(value))}
            />
            <IconButton
              label={t('profile.title')}
              symbol="P"
              onPress={() => navigation.navigate('Profile')}
            />
            <IconButton
              label={t('settings.title')}
              symbol="S"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        <GamificationHud snapshot={gamification.snapshot} />

        {continueModule ? (
          <ContinueCard
            moduleTitle={t(continueModule.homeCard.titleKey, {
              defaultValue: continueModule.id,
            })}
            iconKey={continueModule.homeCard.iconKey}
            accentColor={continueModule.homeCard.accentColor}
            progressLabel={t('home.continue')}
            onPress={() =>
              navigation.navigate('ModuleHost', {moduleId: continueModule.id})
            }
            testID="continue-card"
          />
        ) : null}

        <AppText variant="headline" tone="ink">
          {t('home.modules')}
        </AppText>

        {modules.length > 0 ? (
          <ResponsiveGrid gap={themeSpace.sm}>
            {modules.map(manifest => (
              <LearningModuleCard
                key={manifest.id}
                manifest={manifest}
                comingSoonLabel={t('home.comingSoon')}
                onPress={() =>
                  navigation.navigate('ModuleHost', {moduleId: manifest.id})
                }
              />
            ))}
          </ResponsiveGrid>
        ) : (
          <EmptyState
            title={t('home.emptyTitle')}
            message={t('home.emptyMessage')}
            testID="home-empty"
          />
        )}
      </ScrollView>

      <CelebrationOverlay
        event={celebration}
        onDone={() => {
          if (gamification.pendingCelebrations.length <= 1) {
            dispatch(clearCelebrations());
          } else {
            dispatch(shiftCelebration());
          }
        }}
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space.md,
    paddingBottom: space.xxxl,
    gap: space.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  brandBlock: {
    flex: 1,
    gap: space.xs,
  },
  topActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 200,
  },
});
