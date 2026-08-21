import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {LearningHeader} from '@components/LearningHeader';
import {readDrawingProgress} from '../../data/progress/drawingProgress';

export interface DrawingHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly showGalleryBtn?: boolean;
  readonly onGalleryPress?: () => void;
}

export function DrawingHeader({
  title,
  subtitle,
  emoji = '🎨',
  accentColor = '#EC4899',
  showGalleryBtn = false,
  onGalleryPress,
}: DrawingHeaderProps) {
  const progress = readDrawingProgress();

  const galleryButton =
    showGalleryBtn && onGalleryPress ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open Art Gallery"
        onPress={onGalleryPress}
        style={styles.galleryBtn}>
        <Text style={styles.galleryEmoji}>🖼️</Text>
      </Pressable>
    ) : null;

  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      emoji={emoji}
      accentColor={accentColor}
      titleColor={accentColor}
      stars={progress.totalDrawingsCount}
      rightElement={galleryButton}
    />
  );
}

const styles = StyleSheet.create({
  galleryBtn: {
    backgroundColor: '#FDF2F8',
    borderWidth: 1.5,
    borderColor: '#FBCFE8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryEmoji: {
    fontSize: 16,
  },
});
