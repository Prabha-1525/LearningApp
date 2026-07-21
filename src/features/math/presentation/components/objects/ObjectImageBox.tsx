import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type ObjectImageBoxVariant = 'object' | 'answer' | 'empty';

export type ObjectImageBoxProps = {
  readonly size: number;
  readonly image?: ImageSourcePropType | null;
  readonly variant?: ObjectImageBoxVariant;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly onPress?: () => void;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
  /** Fill the available object area — default cover for kid-friendly sizing. */
  readonly resizeMode?: 'cover' | 'contain';
};

/**
 * Reusable object image used on Counting, Addition, Subtraction, etc.
 * Normal objects have no card/background; answer and empty variants keep boxes.
 */
export function ObjectImageBox({
  size,
  image = null,
  variant = 'object',
  selected = false,
  disabled = false,
  onPress,
  testID,
  style,
  resizeMode = 'cover',
}: ObjectImageBoxProps) {
  const isAnswer = variant === 'answer';
  const content = isAnswer ? (
    <Text style={styles.answerMark}>?</Text>
  ) : image != null ? (
    <Image source={image} style={styles.image} resizeMode={resizeMode} />
  ) : null;

  const boxStyle = [
    styles.box,
    {width: size, height: size, borderRadius: Math.max(10, size * 0.18)},
    variant === 'object' && styles.object,
    isAnswer && styles.answerBox,
    variant === 'empty' && styles.emptyBox,
    selected && styles.selected,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        style={boxStyle}>
        {content}
        {selected ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={boxStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  object: {
    backgroundColor: 'transparent',
  },
  emptyBox: {
    backgroundColor: '#E8EEF4',
    overflow: 'hidden',
  },
  answerBox: {
    backgroundColor: '#5BA3E8',
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFFFFF',
  },
  selected: {
    opacity: 0.72,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  answerMark: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  check: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
  },
});
