import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LearningHeader} from '@components/LearningHeader';

export type ScienceHeaderProps = {
  readonly title: string;
  readonly emoji: string;
  readonly accentColor?: string;
  readonly score?: number;
  readonly totalScore?: number;
  readonly onBack: () => void;
};

export function ScienceHeader({
  title,
  emoji,
  accentColor = '#10B981',
  score,
  totalScore,
  onBack,
}: ScienceHeaderProps) {
  const scoreBadge =
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
      rightElement={scoreBadge}
      onBack={onBack}
    />
  );
}

const styles = StyleSheet.create({
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  starIcon: {
    fontSize: 14,
    color: '#059669',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
});
