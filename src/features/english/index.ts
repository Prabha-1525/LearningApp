import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {EnglishNavigator} from '@navigation';

export function registerEnglishModule(): LearningModuleManifest {
  return {
    id: ModuleId.English,
    titleKey: 'modules.english.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.english.title',
      subtitleKey: 'modules.english.subtitle',
      iconKey: 'english',
      accentColor: '#3B82F6',
    },
    deepLinkPrefix: 'learningapp://module/english',
    isEnabled: () => featureFlags.englishEnabled,
    getNavigator: () => EnglishNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {EnglishNavigator} from '@navigation';
