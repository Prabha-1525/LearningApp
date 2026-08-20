import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {LifeSkillsNavigator} from '@navigation';

export function registerLifeSkillsModule(): LearningModuleManifest {
  return {
    id: ModuleId.LifeSkills,
    titleKey: 'modules.lifeSkills.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.lifeSkills.title',
      subtitleKey: 'modules.lifeSkills.subtitle',
      iconKey: 'lifeSkills',
      accentColor: '#10B981',
    },
    deepLinkPrefix: 'learningapp://module/lifeSkills',
    isEnabled: () => featureFlags.lifeSkillsEnabled,
    getNavigator: () => LifeSkillsNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {LifeSkillsNavigator} from '@navigation';
