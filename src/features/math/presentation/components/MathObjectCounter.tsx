import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText} from '@shared/ui';

import type {ScatterOffset} from '../../domain/generators/types';

type Props = {
  readonly emojis: readonly string[];
  readonly tapped: ReadonlySet<number>;
  readonly onTap: (index: number) => void;
  readonly disabled?: boolean;
  readonly scatterOffsets?: readonly ScatterOffset[];
};

/** Tap-to-count interactive objects — grid or scattered layout. */
export function MathObjectCounter({
  emojis,
  tapped,
  onTap,
  disabled,
  scatterOffsets,
}: Props) {
  const scattered = scatterOffsets != null && scatterOffsets.length > 0;

  return (
    <View style={[styles.wrap, scattered && styles.scatterWrap]}>
      {emojis.map((emoji, index) => (
        <CountObject
          key={`${emoji}-${index}`}
          emoji={emoji}
          selected={tapped.has(index)}
          disabled={disabled}
          scattered={scattered}
          offset={scatterOffsets?.[index]}
          onPress={() => onTap(index)}
        />
      ))}
    </View>
  );
}

function CountObject({
  emoji,
  selected,
  disabled,
  scattered,
  offset,
  onPress,
}: {
  emoji: string;
  selected: boolean;
  disabled?: boolean;
  scattered: boolean;
  offset?: ScatterOffset;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (selected) {
      scale.value = withSequence(
        withTiming(1.2, {duration: 120}),
        withTiming(1, {duration: 120}),
      );
    }
  }, [scale, selected]);

  const style = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || selected}
      onPress={onPress}
      style={
        scattered ? {position: 'absolute', left: '50%', top: '50%'} : undefined
      }>
      <Animated.View
        style={[
          scattered ? styles.scatterItem : styles.item,
          selected && styles.itemSelected,
          scattered &&
            offset != null && {
              marginLeft: offset.x,
              marginTop: offset.y,
            },
          style,
        ]}>
        <AppText style={scattered ? styles.scatterEmoji : styles.emoji}>
          {emoji}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  scatterWrap: {
    position: 'relative',
    minHeight: 200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  item: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFF6E0',
    borderWidth: 2,
    borderColor: '#F4B400',
  },
  scatterItem: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#FFF6E0',
    borderWidth: 2,
    borderColor: '#F4B400',
  },
  itemSelected: {
    backgroundColor: '#E8FBF3',
    borderColor: '#3D9A5F',
    opacity: 0.7,
  },
  emoji: {fontSize: 40},
  scatterEmoji: {fontSize: 32},
});
