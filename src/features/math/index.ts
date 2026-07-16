import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {MathNavigator} from './presentation/navigation';

export function registerMathModule(): LearningModuleManifest {
  return {
    id: ModuleId.Math,
    titleKey: 'modules.math.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.math.title',
      subtitleKey: 'modules.math.subtitle',
      iconKey: 'math',
      accentColor: '#4DB7E8',
    },
    deepLinkPrefix: 'learningapp://module/math',
    isEnabled: () => featureFlags.mathEnabled,
    getNavigator: () => MathNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {MathNavigator} from './presentation/navigation';
export * from './domain/curriculum/types';
