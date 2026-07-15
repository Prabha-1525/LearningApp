import {Pressable, StyleSheet, View} from 'react-native';

import {useTheme} from '../theme';
import {AppText} from './AppText';
import {AvatarView} from './AvatarView';

const PRESET_KEYS = ['sunny', 'leaf', 'wave', 'spark', 'coral', 'sky'] as const;

export type AvatarPickerProps = {
  readonly name: string;
  readonly selectedKey: string;
  readonly onSelect: (avatarKey: string) => void;
  readonly testID?: string;
};

/**
 * Large avatar tiles for Profile — visual identity without text-heavy flows.
 */
export function AvatarPicker({
  name,
  selectedKey,
  onSelect,
  testID,
}: AvatarPickerProps) {
  const {theme, radius, space} = useTheme();

  return (
    <View
      testID={testID}
      style={[styles.grid, {gap: space.sm}]}
      accessibilityRole="radiogroup">
      {PRESET_KEYS.map(key => {
        const selected = key === selectedKey;
        return (
          <Pressable
            key={key}
            accessibilityRole="radio"
            accessibilityState={{selected}}
            accessibilityLabel={`Avatar ${key}`}
            onPress={() => onSelect(key)}
            style={[
              styles.tile,
              {
                borderRadius: radius.md,
                borderColor: selected
                  ? theme.colors.actionPrimary
                  : theme.colors.border,
                backgroundColor: theme.colors.surface,
                padding: space.sm,
              },
            ]}>
            <AvatarView name={name} avatarKey={key} size={64} />
            <AppText variant="caption" tone={selected ? 'primary' : 'muted'}>
              {key}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: '30%',
    minWidth: 96,
    alignItems: 'center',
    borderWidth: 2,
    gap: 8,
  },
});
