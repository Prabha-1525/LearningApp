import React from 'react';
import {LearningHeader} from '@components/LearningHeader';

export type ExplorerHeaderProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
};

export function ExplorerHeader({
  title,
  subtitle,
  stars,
  onBack,
}: ExplorerHeaderProps) {
  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      stars={stars}
      onBack={onBack}
    />
  );
}
