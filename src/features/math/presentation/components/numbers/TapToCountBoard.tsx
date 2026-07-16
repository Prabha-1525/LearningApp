import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText, animationPresets} from '@shared/ui';

import {objectGridLayout} from './objectGridLayout';

type Props = {
  readonly emojis: readonly string[];
  /** Index in tap order (1-based) per object index, if tapped. */
  readonly tapOrderByIndex: ReadonlyMap<number, number>;
  readonly highlightIndex: number;
  readonly disabled?: boolean;
  readonly onTap: (index: number) => void;
};

/** Interactive tap-to-count board — sequential count, no overlap. */
export function TapToCountBoard({
  emojis,
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
        {emojis.map((emoji, index) => (
          <TapObject
            key={`tap-${index}`}
            emoji={emoji}
            tapOrder={tapOrderByIndex.get(index)}
            highlighted={highlightIndex === index}
            disabled={disabled || tapOrderByIndex.has(index)}
            itemSize={layout.itemSize}
            fontSize={layout.fontSize}
            onPress={() => onTap(index)}
          />
        ))}
      </View>
    </View>
  );
}

function TapObject({
  emoji,
  tapOrder,
  highlighted,
  disabled,
  itemSize,
  fontSize,
  onPress,
}: {
  emoji: string;
  tapOrder?: number;
  highlighted: boolean;
  disabled?: boolean;
  itemSize: number;
  fontSize: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const tapped = tapOrder != null;

  useEffect(() => {
    if (tapped || highlighted) {
      scale.value = withSequence(
        withSpring(1.25, animationPresets.snappySpring),
        withTiming(1.08, {duration: 120}),
      );
    } else {
      scale.value = withTiming(1, {duration: 100});
    }
  }, [highlighted, scale, tapped]);

  const anim = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tapped ? `Counted as ${tapOrder}` : 'Tap to count'}
      disabled={disabled}
      onPress={onPress}
      style={{width: itemSize, height: itemSize}}>
      <Animated.View
        style={[
          styles.item,
          {
            width: itemSize,
            height: itemSize,
            borderRadius: itemSize * 0.26,
          },
          tapped && styles.itemTapped,
          highlighted && styles.itemHighlight,
          anim,
        ]}>
        <AppText style={{fontSize}}>{emoji}</AppText>
        {tapped ? (
          <View style={styles.countBadge}>
            <AppText variant="caption" style={styles.countText}>
              {tapOrder}
            </AppText>
          </View>
        ) : null}
        {tapped ? (
          <View style={styles.checkmark}>
            <AppText style={styles.checkText}>✓</AppText>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
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
  item: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#4DB7E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTapped: {
    backgroundColor: '#E8FBF3',
    borderColor: '#3D9A5F',
  },
  itemHighlight: {
    backgroundColor: '#FFF0F8',
    borderColor: '#E4578C',
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
  checkmark: {
    position: 'absolute',
    bottom: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3D9A5F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkText: {color: '#FFFFFF', fontWeight: '800', fontSize: 12},
});
