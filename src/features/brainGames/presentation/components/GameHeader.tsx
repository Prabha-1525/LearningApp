import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LearningHeader} from '@components/LearningHeader';

export type GameHeaderProps = {
  readonly title: string;
  readonly emoji: string;
  readonly accentColor?: string;
  readonly score?: number;
  readonly totalScore?: number;
  readonly onBack?: () => void;
};

export function GameHeader({
  title,
  emoji,
  accentColor = '#6366F1',
  score,
  totalScore,
  onBack,
}: GameHeaderProps) {
  const scoreElement =
    score !== undefined && totalScore !== undefined ? (
      <View style={styles.scorePill}>
        <Text style={styles.starIcon}>★</Text>
        <Text style={styles.scoreText}>
          {score}/{totalScore}
        </Text>
      </View>
    ) : null;

  return (
    <LearningHeader
      title={title}
      emoji={emoji}
      accentColor={accentColor}
      titleColor={accentColor}
      rightElement={scoreElement}
      onBack={onBack}
    />
  );
}

const styles = StyleSheet.create({
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  starIcon: {
    fontSize: 14,
    color: '#4F46E5',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3730A3',
  },
});
