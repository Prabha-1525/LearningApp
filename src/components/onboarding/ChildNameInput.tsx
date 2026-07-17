import {StyleSheet, Text, TextInput, View} from 'react-native';

type ChildNameInputProps = {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder: string;
  readonly errorText?: string | null;
  readonly maxLength?: number;
};

export function ChildNameInput({
  value,
  onChangeText,
  placeholder,
  errorText,
  maxLength = 20,
}: ChildNameInputProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        testID="child-name-input"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9BB0BA"
        maxLength={maxLength}
        autoCapitalize="words"
        autoCorrect={false}
        style={styles.input}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {gap: 6},
  input: {
    minHeight: 56,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    fontSize: 17,
    fontWeight: '600',
    color: '#1A2A32',
    borderWidth: 2,
    borderColor: '#D5E3EA',
  },
  error: {color: '#D64545', fontSize: 13, fontWeight: '600'},
});
