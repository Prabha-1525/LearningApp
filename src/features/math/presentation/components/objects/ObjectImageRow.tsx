import {StyleSheet, View, type ImageSourcePropType} from 'react-native';

import {ObjectImageBox} from './ObjectImageBox';

type ObjectImageRowProps = {
  readonly count: number;
  readonly image: ImageSourcePropType;
  readonly boxSize: number;
  readonly gap?: number;
  readonly tapped?: ReadonlySet<number>;
  readonly onTap?: (index: number) => void;
  readonly disabled?: boolean;
  readonly testIDPrefix?: string;
};

/** Horizontal row of reusable object boxes. */
export function ObjectImageRow({
  count,
  image,
  boxSize,
  gap = 6,
  tapped,
  onTap,
  disabled = false,
  testIDPrefix = 'object',
}: ObjectImageRowProps) {
  return (
    <View style={[styles.row, {gap}]}>
      {Array.from({length: count}, (_, index) => (
        <ObjectImageBox
          key={index}
          size={boxSize}
          image={image}
          selected={tapped?.has(index) ?? false}
          disabled={disabled}
          onPress={onTap ? () => onTap(index) : undefined}
          testID={`${testIDPrefix}-${index}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
