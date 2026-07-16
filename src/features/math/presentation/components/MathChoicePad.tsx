import {Pressable, StyleSheet, View} from 'react-native';

import {AppText, useTheme} from '@shared/ui';

import type {MathChoice} from '../../domain/curriculum/types';

type Props = {
  readonly choices: readonly MathChoice[];
  readonly onPick: (id: string) => void;
  readonly disabled?: boolean;
};

/** Large kid-friendly answer buttons. */
export function MathChoicePad({choices, onPick, disabled}: Props) {
  const {radius, space} = useTheme();

  return (
    <View style={[styles.grid, {gap: space.sm}]}>
      {choices.map(choice => (
        <Pressable
          key={choice.id}
          accessibilityRole="button"
          accessibilityLabel={choice.label}
          disabled={disabled}
          onPress={() => onPick(choice.id)}
          style={[
            styles.choice,
            {
              borderRadius: radius.lg,
              opacity: disabled ? 0.5 : 1,
            },
          ]}>
          <AppText variant="headline" tone="ink">
            {choice.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  choice: {
    minWidth: 88,
    minHeight: 72,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#4DB7E8',
  },
});
