import {useEffect, useMemo} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {getChildAvatar} from '@assets';
import {AppSafeAreaView} from '@components';
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

/**
 * Home after profile setup — always greets the child by name + cartoon avatar.
 */
export function HomeScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {space: themeSpace} = useTheme();
  const soundEnabled = useAppSelector(state => state.settings.soundEnabled);
  const gamification = useAppSelector(state => state.gamification);
  const activeChildId = useAppSelector(state => state.profile.activeChildId);
  const activeChild = useAppSelector(state =>
    state.profile.children.find(
      child => child.id === state.profile.activeChildId,
    ),
  );

  useEffect(() => {
    if (activeChildId) {
      dispatch(ensureGamificationChild(activeChildId));
    }
  }, [dispatch, activeChildId]);

  const modules = moduleRegistry.list();
  const continueModule = moduleRegistry.listEnabled()[0];
  const childName = activeChild?.displayName ?? t('home.defaultChildName');
  const celebration = gamification.pendingCelebrations[0] ?? null;
  const streak = gamification.snapshot?.streak?.currentStreak ?? 0;
  const stars = gamification.snapshot?.wallet?.stars ?? 0;
  const avatar = useMemo(
    () => getChildAvatar(activeChild?.avatarKey ?? 'lion'),
    [activeChild?.avatarKey],
  );

  return (
    <AppSafeAreaView testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.identity}>
            {avatar.image ? (
              <Image source={avatar.image} style={styles.avatar} />
            ) : (
              <View style={styles.avatarEmoji}>
                <Text style={styles.emoji}>{avatar.emoji}</Text>
              </View>
            )}
            <View style={styles.brandBlock}>
              <AppText variant="body" tone="muted">
                {t('home.welcomeLabel')}
              </AppText>
              <AppText variant="title" tone="ink">
                {childName}!
              </AppText>
            </View>
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

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <AppText variant="caption" tone="muted">
              {t('home.streak')}
            </AppText>
            <AppText variant="headline" tone="ink">
              {streak}
            </AppText>
          </View>
          <View style={styles.statChip}>
            <AppText variant="caption" tone="muted">
              {t('home.stars')}
            </AppText>
            <AppText variant="headline" tone="ink">
              {stars}
            </AppText>
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
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarEmoji: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF6E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 28},
  brandBlock: {
    flex: 1,
    gap: 2,
  },
  topActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 200,
  },
  statsRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: space.md,
    gap: 2,
  },
});
