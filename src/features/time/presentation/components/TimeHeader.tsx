import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export type TimeHeaderProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly stars?: number;
  readonly accentColor?: string;
  readonly onBack?: () => void;
};

export function TimeHeader({
  title,
  subtitle,
  emoji = '⏰',
  stars,
  accentColor = '#3B82F6',
  onBack,
}: TimeHeaderProps) {
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
