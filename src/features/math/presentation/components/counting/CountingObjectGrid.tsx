import {
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

import {ObjectImageBox} from '../objects/ObjectImageBox';

type CountingObjectGridProps = {
  readonly count: number;
  readonly image: ImageSourcePropType;
  readonly tapped: ReadonlySet<number>;
  readonly onTap: (index: number) => void;
  readonly disabled?: boolean;
};

/**
 * Grid of small object cards — supports up to 20 without crowding.
 * Uses shared {@link ObjectImageBox}.
 */
export function CountingObjectGrid({
  count,
  image,
  tapped,
  onTap,
  disabled = false,
}: CountingObjectGridProps) {
  const {width} = useWindowDimensions();
  const columns = count <= 5 ? 3 : count <= 10 ? 4 : count <= 15 ? 5 : 5;
  const gap = count <= 10 ? 10 : 6;
  const horizontalPad = 32;
  const tile =
    Math.floor((width - horizontalPad - gap * (columns - 1)) / columns) - 2;
  const size = Math.max(
    44,
    Math.min(tile, count <= 5 ? 88 : count <= 10 ? 72 : 56),
  );

  return (
    <View style={[styles.wrap, {gap}]}>
      {Array.from({length: count}, (_, index) => (
        <ObjectImageBox
          key={index}
          size={size}
          image={image}
          selected={tapped.has(index)}
          disabled={disabled}
          onPress={() => onTap(index)}
          testID={`count-object-${index}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 8,
  },
});
