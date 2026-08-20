import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {BrainGamesNavigator} from '@navigation';

export function registerBrainGamesModule(): LearningModuleManifest {
  return {
    id: ModuleId.BrainGames,
    titleKey: 'modules.brainGames.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.brainGames.title',
      subtitleKey: 'modules.brainGames.subtitle',
      iconKey: 'brainGames',
      accentColor: '#6366F1',
    },
    deepLinkPrefix: 'learningapp://module/brainGames',
    isEnabled: () => featureFlags.brainGamesEnabled,
    getNavigator: () => BrainGamesNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {BrainGamesNavigator} from '@navigation';
