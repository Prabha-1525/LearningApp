import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {TimeNavigator} from '@navigation';

export function registerTimeModule(): LearningModuleManifest {
  return {
    id: ModuleId.Time,
    titleKey: 'modules.time.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.time.title',
      subtitleKey: 'modules.time.subtitle',
      iconKey: 'time',
      accentColor: '#3B82F6',
    },
    deepLinkPrefix: 'learningapp://module/time',
    isEnabled: () => featureFlags.timeEnabled,
    getNavigator: () => TimeNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {TimeNavigator} from '@navigation';
