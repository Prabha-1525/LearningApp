import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export interface GKHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly starsCount?: number;
  readonly onBack?: () => void;
}

export function GKHeader({
  title,
  subtitle,
  emoji = '🗣️',
  accentColor = '#F59E0B',
  starsCount,
  onBack,
}: GKHeaderProps) {
  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      emoji={emoji}
      accentColor={accentColor}
      titleColor={accentColor}
      stars={starsCount}
      onBack={onBack}
    />
  );
}
