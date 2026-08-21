import type {ReactNode} from 'react';
import {LearningHeader} from '@components/LearningHeader';

export type TopAppBarProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly onBack?: () => void;
  readonly trailing?: ReactNode;
  readonly showAudio?: boolean;
  readonly soundEnabled?: boolean;
  readonly onToggleSound?: (enabled: boolean) => void;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Organism — standard top chrome for every learning screen.
 * Delegates to the unified LearningHeader based on the Maths module.
 */
export function TopAppBar({
  title,
  subtitle,
  onBack,
  trailing,
  showAudio = false,
  soundEnabled = true,
  onToggleSound,
  testID,
}: TopAppBarProps) {
  return (
    <LearningHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      showAudio={showAudio}
      onAudioPress={
        onToggleSound ? () => onToggleSound(!soundEnabled) : undefined
      }
      rightElement={trailing}
      testID={testID}
    />
  );
}
