import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, Chip, useTheme} from '@shared/ui';

import type {ParentRecommendation} from '../domain/ParentChildReport';

export type RecommendationsListProps = {
  readonly items: readonly ParentRecommendation[];
};

export function RecommendationsList({items}: RecommendationsListProps) {
  const {t} = useTranslation();
  const {theme, space, radius} = useTheme();

  return (
    <View style={{gap: space.sm}}>
      <AppText variant="headline" tone="ink">
        {t('parent.recommendations')}
      </AppText>
      {items.map(item => (
        <View
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: radius.md,
              padding: space.md,
              gap: space.xs,
            },
          ]}>
          <View style={styles.row}>
            <AppText variant="bodyStrong" tone="ink">
              {t(item.titleKey)}
            </AppText>
            <Chip
              label={t(`parent.priority.${item.priority}`)}
              tone={
                item.priority === 'high'
                  ? 'sun'
                  : item.priority === 'medium'
                  ? 'accent'
                  : 'neutral'
              }
            />
          </View>
          <AppText variant="body" tone="muted">
            {t(item.detailKey)}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});
