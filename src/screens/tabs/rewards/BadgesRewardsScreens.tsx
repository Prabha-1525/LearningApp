import {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components';
import {BADGE_RULES} from '@core/gamification';
import {getMissingProgress} from '@features/math/data/missingProgress';
import {space} from '@shared/ui';

/**
 * Badges & Awards — unlocked collection + locked previews.
 */
export function BadgesScreen() {
  const {t} = useTranslation();
  const snapshot = useAppSelector(state => state.gamification.snapshot);
  const stars = snapshot?.wallet?.stars ?? 0;
  const owned = useMemo(
    () => new Map((snapshot?.badges ?? []).map(b => [b.badgeId, b.earnedAt])),
    [snapshot?.badges],
  );
  const missing = getMissingProgress();

  return (
    <AppSafeAreaView
      testID="badges-screen"
      backgroundImage={null}
      backgroundColor="#F4F7FA">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('rewards.badgesTitle')}</Text>
        <Text style={styles.subtitle}>{t('rewards.badgesSubtitle')}</Text>

        <View style={styles.summaryRow}>
          <SummaryChip
            emoji="⭐"
            label={t('rewards.totalStars')}
            value={String(stars)}
          />
          <SummaryChip
            emoji="🏅"
            label={t('rewards.totalBadges')}
            value={String(owned.size)}
          />
          <SummaryChip
            emoji="📚"
            label={t('rewards.lessonsDone')}
            value={String(missing.completedLessonIndexes.length)}
          />
        </View>

        <Text style={styles.section}>{t('rewards.collection')}</Text>
        {BADGE_RULES.map(rule => {
          const unlockedAt = owned.get(rule.badgeId);
          const unlocked = unlockedAt != null;
          return (
            <View
              key={rule.id}
              style={[styles.badgeCard, !unlocked && styles.badgeLocked]}>
              <Text style={styles.badgeIcon}>{rule.icon}</Text>
              <View style={styles.badgeMeta}>
                <Text style={styles.badgeName}>{t(rule.titleKey)}</Text>
                <Text style={styles.badgeDesc}>{t(rule.descriptionKey)}</Text>
                <Text style={styles.badgeStatus}>
                  {unlocked
                    ? t('rewards.unlockedOn', {
                        date: new Date(unlockedAt).toLocaleDateString(),
                      })
                    : t('rewards.locked')}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </AppSafeAreaView>
  );
}

export function RewardsScreen() {
  const {t} = useTranslation();
  const snapshot = useAppSelector(state => state.gamification.snapshot);
  const stars = snapshot?.wallet?.stars ?? 0;
  const coins = snapshot?.wallet?.coins ?? 0;
  const level = snapshot?.xp?.level ?? 1;
  const missing = getMissingProgress();

  return (
    <AppSafeAreaView
      testID="rewards-screen"
      backgroundImage={null}
      backgroundColor="#F4F7FA">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('rewards.awardsTitle')}</Text>
        <Text style={styles.subtitle}>{t('rewards.awardsSubtitle')}</Text>
        <View style={styles.summaryRow}>
          <SummaryChip
            emoji="⭐"
            label={t('rewards.totalStars')}
            value={String(stars)}
          />
          <SummaryChip
            emoji="🪙"
            label={t('rewards.totalCoins')}
            value={String(coins)}
          />
          <SummaryChip
            emoji="📶"
            label={t('rewards.level')}
            value={String(level)}
          />
        </View>
        <View style={styles.awardCard}>
          <Text style={styles.awardEmoji}>🎁</Text>
          <Text style={styles.badgeName}>{t('rewards.mathStars')}</Text>
          <Text style={styles.badgeDesc}>
            {t('rewards.mathStarsDetail', {count: missing.starsEarned})}
          </Text>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

function SummaryChip({
  emoji,
  label,
  value,
}: {
  readonly emoji: string;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipEmoji}>{emoji}</Text>
      <Text style={styles.chipValue}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: space.md,
    paddingBottom: space.xxxl,
    gap: space.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7A88',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  chipEmoji: {fontSize: 20},
  chipValue: {fontSize: 18, fontWeight: '800', color: '#1A2A4A'},
  chipLabel: {fontSize: 11, fontWeight: '600', color: '#6B7A88'},
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
    marginTop: 8,
  },
  badgeCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#86EFAC',
    alignItems: 'center',
  },
  badgeLocked: {
    opacity: 0.45,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  badgeIcon: {fontSize: 32},
  badgeMeta: {flex: 1, gap: 2},
  badgeName: {fontSize: 16, fontWeight: '800', color: '#1A2A4A'},
  badgeDesc: {fontSize: 13, fontWeight: '500', color: '#6B7A88'},
  badgeStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    marginTop: 2,
  },
  awardCard: {
    backgroundColor: '#FFF8E7',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: '#F4B400',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  awardEmoji: {fontSize: 40},
});
