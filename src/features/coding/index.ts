import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {CodingNavigator} from '@navigation';

export function registerCodingModule(): LearningModuleManifest {
  return {
    id: ModuleId.Coding,
    titleKey: 'modules.coding.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.coding.title',
      subtitleKey: 'modules.coding.subtitle',
      iconKey: 'coding',
      accentColor: '#6366F1',
    },
    deepLinkPrefix: 'learningapp://module/coding',
    isEnabled: () => featureFlags.codingEnabled,
    getNavigator: () => CodingNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {CodingNavigator} from '@navigation';
