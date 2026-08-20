import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type GameHeaderProps = {
  readonly title: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly score?: number;
  readonly totalScore?: number;
  readonly onBack?: () => void;
};

export function GameHeader({
  title,
  emoji,
  accentColor,
  score,
  totalScore,
  onBack,
}: GameHeaderProps) {
  const bounce = useSharedValue(1);
  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{scale: bounce.value}],
  }));

  React.useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(1.12, {duration: 600}),
        withTiming(1, {duration: 600}),
      ),
      -1,
      false,
    );
  }, [bounce]);

  return (
    <View style={[styles.container, {backgroundColor: accentColor}]}>
      {onBack && (
        <Pressable
          onPress={onBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
      )}

      <Animated.Text style={[styles.emoji, emojiStyle]}>{emoji}</Animated.Text>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {score !== undefined && totalScore !== undefined && (
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>
            {score}/{totalScore}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
