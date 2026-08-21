import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {LearningHeader} from '@components/LearningHeader';

export interface StoryHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly isFavorite?: boolean;
  readonly onToggleFavorite?: () => void;
  readonly onBack?: () => void;
  readonly accentColor?: string;
}

export function StoryHeader({
  title,
  subtitle,
  isFavorite,
  onToggleFavorite,
  onBack,
  accentColor = '#C4A05A',
}: StoryHeaderProps) {
  const favoriteButton = onToggleFavorite ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add favorite'}
      onPress={onToggleFavorite}
      style={styles.favBtn}>
      <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
    </Pressable>
  ) : null;

  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      emoji="📖"
      accentColor={accentColor}
      titleColor={accentColor}
      rightElement={favoriteButton}
      onBack={onBack}
    />
  );
}

const styles = StyleSheet.create({
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  favIcon: {
    fontSize: 18,
  },
});
