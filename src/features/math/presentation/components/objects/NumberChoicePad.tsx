import {Pressable, StyleSheet, Text, View} from 'react-native';

export type NumberChoice = {
  readonly id: string;
  readonly label: string;
  readonly correct?: boolean;
};

type NumberChoicePadProps = {
  readonly choices: readonly NumberChoice[];
  readonly disabled?: boolean;
  readonly onPick: (id: string) => void;
  /** `row` = horizontal strip · `grid` = 2×2 (addition mock). */
  readonly layout?: 'row' | 'grid';
  readonly testIDPrefix?: string;
};

/** Shared orange number pad for Counting, Addition, Subtraction, Missing. */
export function NumberChoicePad({
  choices,
  disabled = false,
  onPick,
  layout = 'grid',
  testIDPrefix = 'choice',
}: NumberChoicePadProps) {
  return (
    <View style={layout === 'grid' ? styles.grid : styles.row}>
      {choices.map(choice => (
        <Pressable
          key={choice.id}
          testID={`${testIDPrefix}-${choice.label}`}
          accessibilityRole="button"
          accessibilityLabel={choice.label}
          disabled={disabled}
          onPress={() => onPick(choice.id)}
          style={({pressed}) => [
            layout === 'grid' ? styles.gridBtn : styles.rowBtn,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 4,
  },
  gridBtn: {
    width: '48%',
    backgroundColor: '#F5A623',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#C47E0A',
  },
  rowBtn: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 78,
    backgroundColor: '#F5A623',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#C47E0A',
  },
  pressed: {
    transform: [{translateY: 2}],
    borderBottomWidth: 2,
  },
  disabled: {opacity: 0.55},
  label: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5C3A00',
  },
});
