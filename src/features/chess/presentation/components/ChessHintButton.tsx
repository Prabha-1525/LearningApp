import {Pressable, StyleSheet, Text} from 'react-native';

export type ChessHintButtonProps = {
  readonly onPress: () => void;
  readonly labelTa?: string;
  readonly disabled?: boolean;
};

export function ChessHintButton({
  onPress,
  labelTa = '💡 குறிப்பு (Hint)',
  disabled = false,
}: ChessHintButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Show hint"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.text}>{labelTa}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#D97706',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{scale: 0.96}],
  },
  text: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
});
