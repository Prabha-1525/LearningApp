import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export interface MusicHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
}

export function MusicHeader({
  title,
  subtitle,
  emoji = '🎵',
  accentColor = '#EC4899',
  stars,
  onBack,
}: MusicHeaderProps) {
  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      emoji={emoji}
      accentColor={accentColor}
      titleColor={accentColor}
      stars={stars}
      onBack={onBack}
    />
  );
}
