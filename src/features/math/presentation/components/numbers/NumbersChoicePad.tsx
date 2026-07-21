import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText, animationPresets, useTheme} from '@shared/ui';

import type {MathChoice} from '../../../domain/generators/types';

const PALETTE = [
  {background: '#2563B8', base: '#174A8C'},
  {background: '#168235', base: '#0F5D25'},
  {background: '#FFB547', base: '#B8750B'},
  {background: '#EF6B73', base: '#A92132'},
] as const;

type Props = {
  readonly choices: readonly MathChoice[];
  readonly onPick: (id: string) => void;
  readonly disabled?: boolean;
  readonly selectedId?: string | null;
  readonly showCorrectId?: string | null;
  readonly shakeId?: string | null;
};

/** Compact four-choice row for Learn Numbers. */
export function NumbersChoicePad({
  choices,
  onPick,
  disabled,
  selectedId,
  showCorrectId,
  shakeId,
}: Props) {
  const {radius} = useTheme();

  return (
    <View style={styles.grid}>
      {choices.map((choice, index) => {
        const isSelected = selectedId === choice.id;
        const showCorrect = showCorrectId === choice.id;
        const shouldShake = shakeId === choice.id;
        const color = PALETTE[index % PALETTE.length]!;
        return (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            backgroundColor={color.background}
            baseColor={color.base}
            radius={radius.lg}
            disabled={disabled}
            isSelected={isSelected}
            showCorrect={showCorrect}
            shouldShake={shouldShake}
            onPick={onPick}
          />
        );
      })}
    </View>
  );
}

function ChoiceButton({
  choice,
  backgroundColor,
  baseColor,
  radius,
  disabled,
  isSelected,
  showCorrect,
  shouldShake,
  onPick,
}: {
  choice: MathChoice;
  backgroundColor: string;
  baseColor: string;
  radius: number;
  disabled?: boolean;
  isSelected: boolean;
  showCorrect: boolean;
  shouldShake: boolean;
  onPick: (id: string) => void;
}) {
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (shouldShake && isSelected && !choice.correct) {
      shakeX.value = withSequence(
        withTiming(-8, {duration: animationPresets.shakeMs / 4}),
        withTiming(8, {duration: animationPresets.shakeMs / 4}),
        withTiming(-6, {duration: animationPresets.shakeMs / 4}),
        withTiming(0, {duration: animationPresets.shakeMs / 4}),
      );
    }
  }, [choice.correct, isSelected, shakeX, shouldShake]);

  const anim = useAnimatedStyle(() => ({
    transform: [{translateX: shakeX.value}],
  }));

  return (
    <Animated.View style={[styles.choiceWrap, anim]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={choice.label}
        disabled={disabled}
        onPress={() => onPick(choice.id)}
        style={[
          styles.choice,
          {
            borderRadius: radius,
            backgroundColor,
            borderBottomColor: baseColor,
            opacity: disabled && !isSelected ? 0.55 : 1,
          },
          isSelected && choice.correct && styles.correctPick,
          showCorrect && styles.correct,
          isSelected && !choice.correct && styles.gentleWrong,
        ]}>
        <AppText variant="display" style={styles.label}>
          {choice.label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 2,
    paddingBottom: 8,
  },
  choiceWrap: {flex: 1},
  choice: {
    width: '100%',
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  correct: {
    borderColor: '#3D9A5F',
    borderWidth: 5,
  },
  correctPick: {
    borderColor: '#3D9A5F',
    borderWidth: 5,
    backgroundColor: '#3D9A5F',
  },
  gentleWrong: {
    borderColor: '#FFB347',
    opacity: 0.85,
  },
});
