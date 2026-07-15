import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

import type {LearningModuleManifest} from '@modules/types';

import {AnimatedCard} from './AnimatedCard';
import {AppText} from '../components/AppText';
import {Chip} from '../components/Chip';
import {ModuleIcon} from '../components/ModuleIcon';
import {getModuleGridColumns, useTheme} from '../theme';

export type LearningModuleCardProps = {
  readonly manifest: LearningModuleManifest;
  readonly onPress?: () => void;
  readonly comingSoonLabel?: string;
  readonly testID?: string;
};

/**
 * Reusable Home / catalog card bound to LearningModuleManifest.
 * Home maps registry → this component; it never switches on module ids.
 */
export function LearningModuleCard({
  manifest,
  onPress,
  comingSoonLabel = 'Coming Soon',
  testID,
}: LearningModuleCardProps) {
  const {t} = useTranslation();
  const {theme, space, radius} = useTheme();
  const {width} = useWindowDimensions();
  const columns = getModuleGridColumns(width);
  const enabled = manifest.isEnabled();
  const accent = manifest.homeCard.accentColor;

  const title = t(manifest.homeCard.titleKey, {
    defaultValue: manifest.id,
  });
  const subtitle = manifest.homeCard.subtitleKey
    ? t(manifest.homeCard.subtitleKey, {defaultValue: ''})
    : undefined;

  return (
    <AnimatedCard
      testID={testID ?? `module-card-${manifest.id}`}
      accentColor={accent}
      onPress={enabled ? onPress : undefined}
      padded={false}
      style={[
        styles.card,
        columns >= 3 ? styles.cardCompact : styles.cardLarge,
        !enabled && {opacity: 0.78},
      ]}>
      <View
        style={[
          styles.hero,
          {
            backgroundColor: `${accent}33`,
            borderTopLeftRadius: radius.md - 1,
            borderTopRightRadius: radius.md - 1,
            padding: space.md,
          },
        ]}>
        <ModuleIcon
          iconKey={manifest.homeCard.iconKey}
          accentColor={accent}
          size={columns >= 3 ? 64 : 80}
        />
      </View>

      <View style={[styles.body, {padding: space.md, gap: space.xs}]}>
        <AppText variant="headline" tone="ink" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
        <View style={[styles.chips, {gap: space.xxs, marginTop: space.xxs}]}>
          <Chip label={`${manifest.minAge}–${manifest.maxAge}`} tone="sun" />
          {enabled ? (
            <Chip label={t('home.play')} tone="success" accentColor={accent} />
          ) : (
            <Chip label={comingSoonLabel} tone="locked" />
          )}
        </View>
        {!enabled ? (
          <View
            style={[styles.soonBar, {backgroundColor: theme.colors.sand}]}
          />
        ) : null}
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  cardLarge: {
    minHeight: 200,
  },
  cardCompact: {
    minHeight: 180,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  body: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  soonBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
