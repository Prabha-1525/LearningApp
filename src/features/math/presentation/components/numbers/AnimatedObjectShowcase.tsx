import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText} from '@shared/ui';

import {objectGridLayout} from './objectGridLayout';

type Props = {
  readonly emojis: readonly string[];
  readonly highlightIndex: number;
  readonly visible: boolean;
};

/** Non-interactive object grid with even spacing — no overlap. */
export function AnimatedObjectShowcase({
  emojis,
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
      {emojis.map((emoji, index) => (
        <ObjectBubble
          key={`obj-${index}`}
          emoji={emoji}
          highlighted={highlightIndex === index}
          itemSize={layout.itemSize}
          fontSize={layout.fontSize}
        />
      ))}
    </View>
  );
}

function ObjectBubble({
  emoji,
  highlighted,
  itemSize,
  fontSize,
}: {
  emoji: string;
  highlighted: boolean;
  itemSize: number;
  fontSize: number;
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
        styles.item,
        {
          width: itemSize,
          height: itemSize,
          borderRadius: itemSize * 0.26,
        },
        highlighted && styles.itemHighlight,
        anim,
      ]}>
      <AppText style={{fontSize}}>{emoji}</AppText>
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
  item: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FFB347',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHighlight: {
    backgroundColor: '#E8FBF3',
    borderColor: '#3D9A5F',
    shadowColor: '#3D9A5F',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
});
