import {StyleSheet, View, type ImageSourcePropType} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {ObjectImageBox} from '../objects/ObjectImageBox';

import {objectGridLayout} from './objectGridLayout';

type Props = {
  readonly emojis: readonly string[];
  readonly image: ImageSourcePropType;
  readonly highlightIndex: number;
  readonly visible: boolean;
};

/** Non-interactive object grid with even spacing — no overlap. */
export function AnimatedObjectShowcase({
  emojis,
  image,
  highlightIndex,
  visible,
}: Props) {
  if (!visible) {
    return null;
  }

  const layout = objectGridLayout(emojis.length);

  return (
    <View
      style={[
        styles.grid,
        {
          gap: layout.gap,
          maxWidth: layout.columns * (layout.itemSize + layout.gap),
        },
      ]}>
      {emojis.map((_, index) => (
        <ObjectBubble
          key={`obj-${index}`}
          image={image}
          highlighted={highlightIndex === index}
          itemSize={layout.itemSize}
        />
      ))}
    </View>
  );
}

function ObjectBubble({
  image,
  highlighted,
  itemSize,
}: {
  image: ImageSourcePropType;
  highlighted: boolean;
  itemSize: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (highlighted) {
      scale.value = withSequence(
        withTiming(1.25, {duration: 180}),
        withTiming(1.08, {duration: 140}),
      );
    } else {
      scale.value = withTiming(1, {duration: 120});
    }
  }, [highlighted, scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View
      style={[
        {
          width: itemSize,
          height: itemSize,
        },
        highlighted && styles.itemHighlight,
        anim,
      ]}>
      <ObjectImageBox image={image} size={itemSize} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
  },
  itemHighlight: {
    shadowColor: '#3D9A5F',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
});
