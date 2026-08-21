import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export interface LifeSkillsHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
}

export function LifeSkillsHeader({
  title,
  subtitle,
  emoji = '😊',
  accentColor = '#10B981',
  stars,
  onBack,
}: LifeSkillsHeaderProps) {
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
