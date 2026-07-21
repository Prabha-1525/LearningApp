import {Pressable, StyleSheet, Text, View} from 'react-native';

import type {MathChoice} from '../../../domain/generators/types';

type Props = {
  readonly choices: readonly MathChoice[];
  readonly selectedId?: string | null;
  readonly disabled?: boolean;
  readonly onPick: (id: string) => void;
};

/** Large, semantic Odd / Even answer buttons. */
export function OddEvenChoicePad({
  choices,
  selectedId,
  disabled = false,
  onPick,
}: Props) {
  return (
    <View style={styles.row}>
      {choices.map(choice => {
        const isOdd = choice.id === 'odd';
        const selected = selectedId === choice.id;
        return (
          <Pressable
            key={choice.id}
            accessibilityRole="button"
            accessibilityLabel={choice.label}
            testID={`odd-even-choice-${choice.id}`}
            disabled={disabled}
            onPress={() => onPick(choice.id)}
            style={({pressed}) => [
              styles.button,
              isOdd ? styles.oddButton : styles.evenButton,
              selected && styles.selected,
              pressed && !disabled && styles.pressed,
              disabled && styles.disabled,
            ]}>
            <Text style={styles.icon}>{isOdd ? '☝️' : '🤝'}</Text>
            <Text style={styles.label}>{choice.label}</Text>
            <Text style={styles.hint}>{isOdd ? 'one left' : 'all paired'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 6,
  },
  button: {
    flex: 1,
    minHeight: 82,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  oddButton: {
    backgroundColor: '#FF9F6E',
    borderBottomColor: '#C95C32',
  },
  evenButton: {
    backgroundColor: '#54C878',
    borderBottomColor: '#238A43',
  },
  selected: {
    borderWidth: 4,
    borderColor: '#2563B8',
  },
  pressed: {
    transform: [{translateY: 2}],
    borderBottomWidth: 2,
  },
  disabled: {opacity: 0.62},
  icon: {fontSize: 20},
  label: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  hint: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
