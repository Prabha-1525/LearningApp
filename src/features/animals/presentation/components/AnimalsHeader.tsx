import React from 'react';
import {LearningHeader} from '@components/LearningHeader';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

export interface AnimalsHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly onBack?: () => void;
}

export function AnimalsHeader({
  title,
  subtitle,
  emoji = '🐾',
  accentColor = '#F59E0B',
  onBack,
}: AnimalsHeaderProps) {
  const handleAudioPrompt = () => {
    animalsAudio.speak(`${title}. ${subtitle ?? ''}`);
  };

  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      emoji={emoji}
      accentColor={accentColor}
      titleColor={accentColor}
      onAudioPress={handleAudioPrompt}
      showAudio
      onBack={onBack}
    />
  );
}
