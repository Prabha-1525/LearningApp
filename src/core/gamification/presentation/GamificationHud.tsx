import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, ProgressBar, RewardBadge, useTheme} from '@shared/ui';

import type {GamificationSnapshot} from '../domain/schema/RewardDatabase';
import {selectXpProgress} from '../store/gamificationSlice';

export type GamificationHudProps = {
  readonly snapshot: GamificationSnapshot | null;
  readonly testID?: string;
};

/**
 * Compact HUD: stars, coins, level XP bar — reusable on Home / Profile.
 */
export function GamificationHud({snapshot, testID}: GamificationHudProps) {
  const {t} = useTranslation();
  const {space} = useTheme();

  if (snapshot == null) {
    return null;
  }

  return (
    <View style={[styles.wrap, {gap: space.sm}]} testID={testID}>
      <View style={[styles.row, {gap: space.xs}]}>
        <RewardBadge
          count={snapshot.wallet.stars}
          label={t('gamification.currency.stars')}
        />
        <RewardBadge
          count={snapshot.wallet.coins}
          label={t('gamification.currency.coins')}
          active={false}
        />
        <AppText variant="caption" tone="muted">
          Lv {snapshot.xp.level}
        </AppText>
      </View>
      <ProgressBar
        progress={selectXpProgress(snapshot)}
        label={t('gamification.xp.progress')}
        showPercent
      />
      {snapshot.streak.currentStreak > 0 ? (
        <AppText variant="caption" tone="primary">
          {t('gamification.streak.label', {
            count: snapshot.streak.currentStreak,
          })}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
