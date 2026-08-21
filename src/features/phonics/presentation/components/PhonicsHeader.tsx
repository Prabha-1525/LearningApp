import React from 'react';
import {LearningHeader} from '@components/LearningHeader';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

export interface PhonicsHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
  readonly accentColor?: string;
  readonly audioPromptText?: string;
}

export function PhonicsHeader({
  title,
  subtitle,
  stars,
  onBack,
  accentColor = '#3B82F6',
  audioPromptText,
}: PhonicsHeaderProps) {
  const handleAudio = () => {
    if (audioPromptText) {
      phonicsAudio.speak(audioPromptText);
    } else if (subtitle) {
      phonicsAudio.speak(subtitle);
    } else {
      phonicsAudio.speak(title);
    }
  };

  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      stars={stars}
      accentColor={accentColor}
      titleColor={accentColor}
      onAudioPress={handleAudio}
      showAudio={Boolean(audioPromptText || subtitle)}
      onBack={onBack}
    />
  );
}
