import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type GoogleButtonProps = {
  readonly label: string;
  readonly helperText: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onPress: () => void;
  readonly testID?: string;
};

export function GoogleButton({
  label,
  helperText,
  loading = false,
  disabled = false,
  onPress,
  testID = 'welcome-google',
}: GoogleButtonProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled || loading}
        onPress={onPress}
        style={({pressed}) => [
          styles.button,
          (pressed || loading || disabled) && styles.pressed,
        ]}>
        {loading ? (
          <ActivityIndicator color="#4285F4" />
        ) : (
          <>
            <View style={styles.mark}>
              <Text style={styles.g}>G</Text>
            </View>
            <Text style={styles.label}>{label}</Text>
          </>
        )}
      </Pressable>
      <Text style={styles.helper}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {gap: 8},
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
  pressed: {opacity: 0.9},
  mark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  g: {fontSize: 18, fontWeight: '800', color: '#4285F4'},
  label: {fontSize: 16, fontWeight: '700', color: '#1A1A1A'},
  helper: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5B6B74',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
