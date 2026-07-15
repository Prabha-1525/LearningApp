import {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {asChildId} from '@core/domain';
import {ensureGamificationChild} from '@core/store';
import {buildParentChildReport} from '@core/parent/application/buildParentChildReport';
import {ProgressGraph} from '@core/parent/presentation/ProgressGraph';
import {RecommendationsList} from '@core/parent/presentation/RecommendationsList';
import {
  ReportPeriodTabs,
  type ReportTab,
} from '@core/parent/presentation/ReportPeriodTabs';
import {moduleRegistry} from '@modules';
import {
  AppShell,
  AppText,
  Chip,
  LearningModuleCard,
  ParentStatCard,
  ProgressBar,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';
import {levelProgressRatio} from '@core/gamification';

import type {MainStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'ProgressOverview'>;

const DEMO_CHILD_ID = asChildId('demo-child');

/**
 * Parent Dashboard — insights across lessons, time, mistakes, streaks,
 * achievements, weekly/monthly reports, graph, and recommendations.
 */
export function ParentDashboardScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {space: themeSpace, theme, radius} = useTheme();
  const [period, setPeriod] = useState<ReportTab>('week');
  const gamification = useAppSelector(state => state.gamification);
  const activeChild = useAppSelector(state =>
    state.profile.children.find(
      child => child.id === state.profile.activeChildId,
    ),
  );
  const modules = moduleRegistry.list();

  useEffect(() => {
    dispatch(ensureGamificationChild(DEMO_CHILD_ID));
  }, [dispatch]);

  const report = useMemo(
    () =>
      buildParentChildReport({
        childId: DEMO_CHILD_ID,
        childName: activeChild?.displayName ?? 'Ava',
        gamification: gamification.snapshot,
      }),
    [activeChild?.displayName, gamification.snapshot],
  );

  const activePeriod = period === 'week' ? report.weekly : report.monthly;
  const xpProgress = levelProgressRatio(
    report.xpIntoLevel,
    report.xpToNextLevel,
  );

  return (
    <AppShell testID="parent-dashboard-screen">
      <TopAppBar
        title={t('parent.dashboard')}
        subtitle={report.childName}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.stats, {gap: themeSpace.sm}]}>
          <ParentStatCard
            label={t('parent.lessonsCompleted')}
            value={`${activePeriod.lessonsCompleted}`}
            hint={
              period === 'week' ? t('parent.thisWeek') : t('parent.thisMonth')
            }
          />
          <ParentStatCard
            label={t('parent.currentLevel')}
            value={`${report.currentLevel}`}
            hint={t('parent.levelHint')}
          />
          <ParentStatCard
            label={t('parent.timeSpent')}
            value={`${activePeriod.minutesSpent}`}
            hint={t('parent.minutes')}
          />
          <ParentStatCard
            label={t('parent.practiceFrequency')}
            value={`${activePeriod.practiceSessions}`}
            hint={t(activePeriod.practiceFrequencyLabelKey)}
          />
          <ParentStatCard
            label={t('parent.mistakes')}
            value={`${activePeriod.mistakes}`}
            hint={t('parent.mistakesHint')}
          />
          <ParentStatCard
            label={t('parent.streak')}
            value={`${report.streakDays}`}
            hint={t('parent.longestStreak', {count: report.longestStreak})}
          />
        </View>

        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: radius.md,
              padding: themeSpace.md,
              gap: themeSpace.sm,
            },
          ]}>
          <AppText variant="headline" tone="ink">
            {t('parent.levelProgress')}
          </AppText>
          <ProgressBar
            progress={xpProgress}
            label={`${report.xpIntoLevel} / ${report.xpToNextLevel} XP`}
            showPercent
          />
        </View>

        <ReportPeriodTabs value={period} onChange={setPeriod} />

        <View style={[styles.stats, {gap: themeSpace.sm}]}>
          <ParentStatCard
            label={t('parent.avgSession')}
            value={`${activePeriod.averageSessionMinutes}`}
            hint={t('parent.minutes')}
          />
          <ParentStatCard
            label={t('parent.stars')}
            value={`${report.stars}`}
            hint={t('parent.total')}
          />
          <ParentStatCard
            label={t('parent.coins')}
            value={`${report.coins}`}
            hint={t('parent.total')}
          />
        </View>

        <ProgressGraph
          title={t('parent.progressGraph')}
          unitLabel={t('parent.minutes')}
          points={activePeriod.buckets.map(bucket => ({
            label: bucket.label,
            value: bucket.minutes,
          }))}
          testID="parent-progress-graph"
        />

        <View style={{gap: themeSpace.sm}}>
          <AppText variant="headline" tone="ink">
            {t('parent.achievementsTitle')}
          </AppText>
          <View style={[styles.achieveRow, {gap: themeSpace.xs}]}>
            {report.achievements.map(item => (
              <Chip
                key={item.id}
                label={t(item.titleKey)}
                tone={item.unlocked ? 'success' : 'locked'}
              />
            ))}
          </View>
        </View>

        <RecommendationsList items={report.recommendations} />

        <AppText variant="headline" tone="ink">
          {t('parent.modulesTitle')}
        </AppText>
        <View style={[styles.moduleList, {gap: themeSpace.sm}]}>
          {modules.map(manifest => (
            <View key={manifest.id} style={styles.moduleBlock}>
              <Chip
                label={
                  manifest.isEnabled()
                    ? t('parent.enabled')
                    : t('parent.comingSoon')
                }
                tone={manifest.isEnabled() ? 'success' : 'locked'}
              />
              <LearningModuleCard
                manifest={manifest}
                comingSoonLabel={t('parent.comingSoon')}
                onPress={
                  manifest.isEnabled()
                    ? () =>
                        navigation.navigate('ModuleHost', {
                          moduleId: manifest.id,
                        })
                    : undefined
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

export const ProgressOverviewScreen = ParentDashboardScreen;

const styles = StyleSheet.create({
  content: {
    gap: space.lg,
    paddingBottom: space.xxxl,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  panel: {
    borderWidth: 1,
  },
  achieveRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moduleList: {},
  moduleBlock: {
    gap: space.xs,
  },
});
