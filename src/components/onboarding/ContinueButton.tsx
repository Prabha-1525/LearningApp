import {Pressable, StyleSheet, Text} from 'react-native';

type ContinueButtonProps = {
  readonly label: string;
  readonly disabled?: boolean;
  readonly onPress: () => void;
  readonly testID?: string;
};

export function ContinueButton({
  label,
  disabled = false,
  onPress,
  testID = 'profile-continue',
}: ContinueButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4DB7E8',
    shadowColor: '#1B4F72',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
  pressed: {opacity: 0.92},
  disabled: {backgroundColor: '#C9D7DE', shadowOpacity: 0, elevation: 0},
  label: {fontSize: 17, fontWeight: '800', color: '#FFFFFF'},
  labelDisabled: {color: '#7A8B94'},
});
