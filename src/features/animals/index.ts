import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {AnimalsNavigator} from '@navigation';

export function registerAnimalsModule(): LearningModuleManifest {
  return {
    id: ModuleId.Animals,
    titleKey: 'modules.animals.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.animals.title',
      subtitleKey: 'modules.animals.subtitle',
      iconKey: 'animals',
      accentColor: '#F5A623',
    },
    deepLinkPrefix: 'learningapp://module/animals',
    isEnabled: () => featureFlags.animalsEnabled,
    getNavigator: () => AnimalsNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export * from './domain/entities/animalEntities';
export * from './domain/catalog/animalsData';
export * from './domain/audio/animalsAudioEngine';
export * from './data/progress/animalsProgress';
export * from './presentation/components';
