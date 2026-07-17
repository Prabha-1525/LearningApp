import {Pressable, StyleSheet, Text, View} from 'react-native';

type GuestButtonProps = {
  readonly label: string;
  readonly helperText: string;
  readonly disabled?: boolean;
  readonly onPress: () => void;
  readonly testID?: string;
};

export function GuestButton({
  label,
  helperText,
  disabled = false,
  onPress,
  testID = 'welcome-guest',
}: GuestButtonProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        style={({pressed}) => [
          styles.button,
          (pressed || disabled) && styles.pressed,
        ]}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
      <Text style={styles.helper}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {gap: 8},
  button: {
    minHeight: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7BC96F',
    paddingHorizontal: 20,
    shadowColor: '#2E7D4F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
  pressed: {opacity: 0.9},
  label: {fontSize: 16, fontWeight: '800', color: '#FFFFFF'},
  helper: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5B6B74',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
