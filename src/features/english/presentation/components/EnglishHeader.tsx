import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export interface EnglishHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly starsCount?: number;
  readonly onBack?: () => void;
}

export function EnglishHeader({
  title,
  subtitle,
  emoji = '🔤',
  accentColor = '#3B82F6',
  starsCount,
  onBack,
}: EnglishHeaderProps) {
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
