import {Pressable, StyleSheet, Text, View} from 'react-native';

type Choice = {
  readonly id: string;
  readonly label: string;
  readonly correct?: boolean;
};

type MissingChoiceGridProps = {
  readonly choices: readonly Choice[];
  readonly disabled?: boolean;
  readonly onPick: (id: string) => void;
};

/** 2×2 orange answer pad for Missing Number. */
export function MissingChoiceGrid({
  choices,
  disabled = false,
  onPick,
}: MissingChoiceGridProps) {
  return (
    <View style={styles.grid}>
      {choices.map(choice => (
        <Pressable
          key={choice.id}
          testID={`missing-choice-${choice.label}`}
          accessibilityRole="button"
          accessibilityLabel={choice.label}
          disabled={disabled}
          onPress={() => onPick(choice.id)}
          style={({pressed}) => [
            styles.button,
            pressed && !disabled && styles.pressed,
            disabled && styles.disabled,
          ]}>
          <Text style={styles.label}>{choice.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  button: {
    width: '48%',
    backgroundColor: '#F5A623',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#C47E0A',
  },
  pressed: {
    opacity: 0.9,
    transform: [{translateY: 2}],
    borderBottomWidth: 2,
  },
  disabled: {
    opacity: 0.65,
  },
  label: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2A4A',
  },
});
