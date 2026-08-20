import {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type {QuizOption} from '../../domain/entities/QuizQuestion';

export type QuizOptionCardProps = {
  readonly option: QuizOption;
  readonly isSelected?: boolean;
  readonly isAnswered?: boolean;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function QuizOptionCard({
  option,
  isSelected = false,
  isAnswered = false,
  onPress,
  testID,
}: QuizOptionCardProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isAnswered && isSelected) {
      if (option.isCorrect) {
        scale.value = withSequence(
          withSpring(1.08, {damping: 10, stiffness: 200}),
          withSpring(1, {damping: 12, stiffness: 150}),
        );
      } else {
        translateX.value = withSequence(
          withTiming(-8, {duration: 60}),
          withTiming(8, {duration: 60}),
          withTiming(-6, {duration: 60}),
          withTiming(6, {duration: 60}),
          withTiming(0, {duration: 60}),
        );
      }
    }
  }, [isAnswered, isSelected, option.isCorrect, scale, translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateX: translateX.value}],
  }));

  const isCorrect = isAnswered && option.isCorrect;
  const isWrong = isAnswered && isSelected && !option.isCorrect;

  const borderColor = isCorrect
    ? '#22C55E'
    : isWrong
    ? '#EF4444'
    : isSelected
    ? '#3B82F6'
    : '#E2E8F0';

  const bgColor = isCorrect
    ? '#F0FDF4'
    : isWrong
    ? '#FEF2F2'
    : isSelected
    ? '#EFF6FF'
    : '#FFFFFF';

  return (
    <Animated.View style={[styles.animWrap, animStyle]}>
      <Pressable
        testID={testID}
        disabled={isAnswered}
        accessibilityRole="button"
        accessibilityLabel={`Quiz option ${option.label}`}
        onPress={onPress}
        style={({pressed}) => [
          styles.card,
          {
            borderColor,
            backgroundColor: bgColor,
          },
          pressed && !isAnswered && styles.pressed,
        ]}>
        <View style={styles.contentRow}>
          {option.flagEmoji && (
            <Text style={styles.flagEmoji}>{option.flagEmoji}</Text>
          )}
          <Text
            style={[
              styles.label,
              isCorrect && styles.labelCorrect,
              isWrong && styles.labelWrong,
            ]}>
            {option.label}
          </Text>
        </View>

        {isCorrect && (
          <View style={styles.badgeSuccess}>
            <Text style={styles.badgeText}>✓</Text>
          </View>
        )}
        {isWrong && (
          <View style={styles.badgeError}>
            <Text style={styles.badgeText}>✕</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animWrap: {
    marginVertical: 6,
    alignSelf: 'stretch',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  flagEmoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  labelCorrect: {
    color: '#15803D',
  },
  labelWrong: {
    color: '#B91C1C',
  },
  badgeSuccess: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeError: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
