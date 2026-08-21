import React from 'react';
import {LearningHeader} from '@components/LearningHeader';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

export interface ShapesHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly rightElement?: React.ReactNode;
}

export function ShapesHeader({
  title,
  subtitle,
  emoji = '🔷',
  accentColor = '#3B82F6',
  rightElement,
}: ShapesHeaderProps) {
  const handleHearTitle = () => {
    shapesAudio.speak(`${title}. ${subtitle ?? ''}`);
  };

  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      emoji={emoji}
      accentColor={accentColor}
      titleColor={accentColor}
      onAudioPress={handleHearTitle}
      showAudio
      rightElement={rightElement}
    />
  );
}
