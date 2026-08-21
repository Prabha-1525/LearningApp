import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {StoryNavigator} from '@navigation';

export function registerStoryModule(): LearningModuleManifest {
  return {
    id: ModuleId.Story,
    titleKey: 'modules.story.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.story.title',
      subtitleKey: 'modules.story.subtitle',
      iconKey: 'story',
      accentColor: '#C4A05A',
    },
    deepLinkPrefix: 'learningapp://module/story',
    isEnabled: () => featureFlags.storyEnabled,
    getNavigator: () => StoryNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export * from './domain/entities/storyEntities';
export * from './domain/catalog/storiesData';
export * from './domain/audio/storyAudioEngine';
export * from './data/progress/storyProgress';
export * from './presentation/components';
