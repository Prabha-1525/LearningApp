import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {WorldExplorerNavigator} from '@navigation';

/**
 * Public entry for the World Explorer feature.
 * Registered in modules/index.ts.
 */
export function registerWorldExplorerModule(): LearningModuleManifest {
  return {
    id: ModuleId.WorldExplorer,
    titleKey: 'modules.worldExplorer.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.worldExplorer.title',
      subtitleKey: 'modules.worldExplorer.subtitle',
      iconKey: 'worldExplorer',
      accentColor: '#FF9F1C',
    },
    deepLinkPrefix: 'learningapp://module/worldExplorer',
    isEnabled: () => featureFlags.worldExplorerEnabled,
    getNavigator: () => WorldExplorerNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {WorldExplorerNavigator} from '@navigation';
