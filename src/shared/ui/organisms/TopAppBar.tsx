import type {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

import {AudioButton, BackButton} from '../atoms';
import {AppText} from '../components/AppText';
import {useTheme} from '../theme';

export type TopAppBarProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly onBack?: () => void;
  readonly trailing?: ReactNode;
  readonly showAudio?: boolean;
  readonly soundEnabled?: boolean;
  readonly onToggleSound?: (enabled: boolean) => void;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Organism — standard top chrome for every learning screen.
 * Compose Back + Title + optional Audio / custom trailing.
 */
export function TopAppBar({
  title,
  subtitle,
  onBack,
  trailing,
  showAudio = false,
  soundEnabled = true,
  onToggleSound,
  reduceMotion = false,
  testID,
}: TopAppBarProps) {
  const {space} = useTheme();

  return (
    <View style={[styles.row, {marginBottom: space.md}]} testID={testID}>
      <View style={styles.slot}>
        {onBack ? (
          <BackButton onPress={onBack} reduceMotion={reduceMotion} />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      <View style={styles.center}>
        <AppText variant="title" tone="ink" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={[styles.slot, styles.trailing]}>
        {trailing}
        {showAudio && onToggleSound ? (
          <AudioButton
            enabled={soundEnabled}
            onToggle={onToggleSound}
            reduceMotion={reduceMotion}
          />
        ) : trailing == null ? (
          <View style={styles.spacer} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slot: {
    minWidth: 56,
  },
  trailing: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 56,
    height: 56,
  },
});
