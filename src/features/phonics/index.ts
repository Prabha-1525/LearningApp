import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {PhonicsNavigator} from '@navigation';

export function registerPhonicsModule(): LearningModuleManifest {
  return {
    id: ModuleId.Phonics,
    titleKey: 'modules.phonics.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.phonics.title',
      subtitleKey: 'modules.phonics.subtitle',
      iconKey: 'phonics',
      accentColor: '#3B82F6',
    },
    deepLinkPrefix: 'learningapp://module/phonics',
    isEnabled: () => featureFlags.phonicsEnabled,
    getNavigator: () => PhonicsNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export * from './domain/entities/phonicsEntities';
export * from './domain/catalog/phonicsData';
export * from './domain/audio/phonicsAudioEngine';
export * from './data/progress/phonicsProgress';
export * from './presentation/components';
