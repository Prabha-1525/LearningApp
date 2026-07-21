import {StyleSheet, View, type ImageSourcePropType} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText, animationPresets} from '@shared/ui';
import {ObjectImageBox} from '../objects/ObjectImageBox';

import {objectGridLayout} from './objectGridLayout';

type Props = {
  readonly emojis: readonly string[];
  readonly image: ImageSourcePropType;
  /** Index in tap order (1-based) per object index, if tapped. */
  readonly tapOrderByIndex: ReadonlyMap<number, number>;
  readonly highlightIndex: number;
  readonly disabled?: boolean;
  readonly onTap: (index: number) => void;
};

/** Interactive tap-to-count board — sequential count, no overlap. */
export function TapToCountBoard({
  emojis,
  image,
  tapOrderByIndex,
  highlightIndex,
  disabled,
  onTap,
}: Props) {
  const tappedCount = tapOrderByIndex.size;
  const layout = objectGridLayout(emojis.length);

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <AppText variant="caption" tone="ink" style={styles.badgeText}>
          {tappedCount} / {emojis.length}
        </AppText>
      </View>
      <View
        style={[
          styles.grid,
          {
            gap: layout.gap,
            maxWidth: layout.columns * (layout.itemSize + layout.gap),
          },
        ]}>
        {emojis.map((_, index) => (
          <TapObject
            key={`tap-${index}`}
            index={index}
            image={image}
            tapOrder={tapOrderByIndex.get(index)}
            highlighted={highlightIndex === index}
            disabled={disabled || tapOrderByIndex.has(index)}
            itemSize={layout.itemSize}
            onPress={() => onTap(index)}
          />
        ))}
      </View>
    </View>
  );
}

function TapObject({
  index,
  image,
  tapOrder,
  highlighted,
  disabled,
  itemSize,
  onPress,
}: {
  index: number;
  image: ImageSourcePropType;
  tapOrder?: number;
  highlighted: boolean;
  disabled?: boolean;
  itemSize: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const tapped = tapOrder != null;

  useEffect(() => {
    if (tapOrder != null) {
      scale.value = withSequence(
        withSpring(1.25, animationPresets.snappySpring),
        withTiming(1, {duration: 120}),
      );
    }
  }, [scale, tapOrder]);

  const anim = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View
      style={[
        styles.itemWrap,
        {width: itemSize, height: itemSize},
        highlighted && styles.itemHighlight,
        anim,
      ]}>
      <ObjectImageBox
        image={image}
        size={itemSize}
        selected={tapped}
        disabled={disabled}
        onPress={onPress}
        testID={`learn-number-object-${index}`}
      />
      {tapped ? (
        <View style={styles.countBadge}>
          <AppText variant="caption" style={styles.countText}>
            {tapOrder}
          </AppText>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {width: '100%', gap: 10, alignItems: 'center'},
  badge: {
    backgroundColor: '#FFF6E0',
    borderWidth: 2,
    borderColor: '#F4B400',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {fontWeight: '700'},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
  },
  itemWrap: {alignItems: 'center', justifyContent: 'center'},
  itemHighlight: {
    shadowColor: '#E4578C',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3D9A5F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  countText: {color: '#FFFFFF', fontWeight: '800', fontSize: 12},
});
