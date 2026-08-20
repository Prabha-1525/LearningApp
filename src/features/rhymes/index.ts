import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {RhymesNavigator} from '@navigation';

export function registerRhymesModule(): LearningModuleManifest {
  return {
    id: ModuleId.Rhymes,
    titleKey: 'modules.rhymes.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.rhymes.title',
      subtitleKey: 'modules.rhymes.subtitle',
      iconKey: 'rhymes',
      accentColor: '#DB2777',
    },
    deepLinkPrefix: 'learningapp://module/rhymes',
    isEnabled: () => featureFlags.rhymesEnabled,
    getNavigator: () => RhymesNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {RhymesNavigator} from '@navigation';
