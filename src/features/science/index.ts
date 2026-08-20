import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {ScienceNavigator} from '@navigation';

export function registerScienceModule(): LearningModuleManifest {
  return {
    id: ModuleId.Science,
    titleKey: 'modules.science.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.science.title',
      subtitleKey: 'modules.science.subtitle',
      iconKey: 'science',
      accentColor: '#10B981',
    },
    deepLinkPrefix: 'learningapp://module/science',
    isEnabled: () => featureFlags.scienceEnabled,
    getNavigator: () => ScienceNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {ScienceNavigator} from '@navigation';
