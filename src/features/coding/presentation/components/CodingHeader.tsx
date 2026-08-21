import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export interface CodingHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
}

export function CodingHeader({
  title,
  subtitle,
  emoji = '🧩',
  accentColor = '#6366F1',
  stars,
  onBack,
}: CodingHeaderProps) {
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
