import {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import {ObjectImageBox} from '../objects/ObjectImageBox';

type Props = {
  readonly number: number;
  readonly image: ImageSourcePropType;
  readonly revealLabel?: boolean;
  readonly animationKey: string;
};

/** Visual proof of parity: objects are grouped into pairs with any leftover alone. */
export function OddEvenPairingBoard({
  number,
  image,
  revealLabel = false,
  animationKey,
}: Props) {
  const {width} = useWindowDimensions();
  const pairCount = Math.floor(number / 2);
  const hasUnpaired = number % 2 !== 0;
  const objectSize =
    number <= 10 ? 48 : number <= 20 ? 34 : number <= 30 ? 27 : 23;
  const pairWidth = objectSize * 2 + 14;
  const maxBoardWidth = Math.min(width - 52, 390);

  return (
    <View style={styles.board} testID="odd-even-pairing-board">
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.instruction}>Put every object with a partner</Text>

      <View style={[styles.pairs, {maxWidth: maxBoardWidth}]}>
        {Array.from({length: pairCount}, (_, index) => (
          <AnimatedPair
            key={`${animationKey}-pair-${index}`}
            index={index}
            image={image}
            objectSize={objectSize}
            pairWidth={pairWidth}
          />
        ))}
        {hasUnpaired ? (
          <AnimatedUnpaired
            key={`${animationKey}-unpaired`}
            index={pairCount}
            image={image}
            objectSize={objectSize}
            pairWidth={pairWidth}
          />
        ) : null}
      </View>

      <View
        style={[
          styles.resultPill,
          hasUnpaired ? styles.oddPill : styles.evenPill,
        ]}>
        <Text style={styles.resultIcon}>{hasUnpaired ? '☝️' : '🤝'}</Text>
        <Text style={styles.resultText}>
          {hasUnpaired
            ? 'One object has no partner'
            : 'Every object has a partner'}
        </Text>
      </View>

      {revealLabel ? (
        <Text
          style={[
            styles.parityLabel,
            hasUnpaired ? styles.oddText : styles.evenText,
          ]}>
          {number} is {hasUnpaired ? 'ODD' : 'EVEN'}
        </Text>
      ) : null}
    </View>
  );
}

function AnimatedPair({
  index,
  image,
  objectSize,
  pairWidth,
}: {
  index: number;
  image: ImageSourcePropType;
  objectSize: number;
  pairWidth: number;
}) {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(
      Math.min(index * 80, 640),
      withSpring(1, {damping: 10, stiffness: 150}),
    );
  }, [index, scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[styles.pair, {width: pairWidth}, animatedStyle]}>
      <ObjectImageBox image={image} size={objectSize} />
      <View style={styles.partnerLink}>
        <Text style={styles.partnerHeart}>♥</Text>
      </View>
      <ObjectImageBox image={image} size={objectSize} />
    </Animated.View>
  );
}

function AnimatedUnpaired({
  index,
  image,
  objectSize,
  pairWidth,
}: {
  index: number;
  image: ImageSourcePropType;
  objectSize: number;
  pairWidth: number;
}) {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(
      Math.min(index * 80, 720),
      withSpring(1, {damping: 8, stiffness: 140}),
    );
  }, [index, scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View
      style={[styles.pair, styles.unpaired, {width: pairWidth}, animatedStyle]}>
      <ObjectImageBox image={image} size={objectSize} />
      <Text style={styles.waiting}>Needs a partner!</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  number: {
    fontSize: 38,
    fontWeight: '900',
    color: '#2563B8',
    lineHeight: 42,
  },
  instruction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  pairs: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  pair: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F8EF',
    borderWidth: 2,
    borderColor: '#6BCB8B',
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  partnerLink: {
    width: 14,
    alignItems: 'center',
  },
  partnerHeart: {
    color: '#38A169',
    fontSize: 10,
  },
  unpaired: {
    borderStyle: 'dashed',
    borderColor: '#F59E8B',
    backgroundColor: '#FFF1ED',
    gap: 2,
  },
  waiting: {
    flexShrink: 1,
    color: '#C2412D',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  resultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  evenPill: {backgroundColor: '#DCFCE7'},
  oddPill: {backgroundColor: '#FFEDD5'},
  resultIcon: {fontSize: 15},
  resultText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  parityLabel: {
    fontSize: 20,
    fontWeight: '900',
  },
  evenText: {color: '#168235'},
  oddText: {color: '#E05A33'},
});
