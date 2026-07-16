import {Pressable, StyleSheet, View} from 'react-native';

import {AppText, useTheme} from '@shared/ui';

import {NUMBERS_LEVEL_LABELS} from '../../../domain/numbers/numbersRange';
import type {DifficultyLevel} from '../../../domain/generators/types';

type Props = {
  readonly level: DifficultyLevel;
  readonly onChange: (level: DifficultyLevel) => void;
  readonly disabled?: boolean;
};

const LEVELS: DifficultyLevel[] = [1, 2, 3, 4];

export function LevelPicker({level, onChange, disabled}: Props) {
  const {radius, space} = useTheme();

  return (
    <View style={[styles.wrap, {gap: space.xs}]}>
      {LEVELS.map(l => {
        const active = l === level;
        const label = NUMBERS_LEVEL_LABELS[l].en;
        return (
          <Pressable
            key={l}
            disabled={disabled}
            accessibilityRole="button"
            onPress={() => onChange(l)}
            style={[
              styles.chip,
              {
                borderRadius: radius.md,
                backgroundColor: active ? '#4DB7E8' : '#EAF6FB',
                opacity: disabled ? 0.5 : 1,
              },
            ]}>
            <AppText
              variant="caption"
              style={{
                color: active ? '#FFFFFF' : '#2D1B4E',
                fontWeight: '700',
              }}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#4DB7E8',
  },
});
