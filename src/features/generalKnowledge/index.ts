import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {GeneralKnowledgeNavigator} from '@navigation';

export function registerGeneralKnowledgeModule(): LearningModuleManifest {
  return {
    id: ModuleId.GeneralKnowledge,
    titleKey: 'modules.generalKnowledge.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.generalKnowledge.title',
      subtitleKey: 'modules.generalKnowledge.subtitle',
      iconKey: 'generalKnowledge',
      accentColor: '#F59E0B',
    },
    deepLinkPrefix: 'learningapp://module/generalKnowledge',
    isEnabled: () => featureFlags.generalKnowledgeEnabled,
    getNavigator: () => GeneralKnowledgeNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {GeneralKnowledgeNavigator} from '@navigation';
