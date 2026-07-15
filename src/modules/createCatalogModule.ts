import type {ModuleId} from '@core/domain';
import {TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';

import type {LearningModuleManifest} from './types';

export type ComingSoonModuleConfig = {
  readonly id: ModuleId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly iconKey: string;
  readonly accentColor: string;
  readonly deepLinkPrefix: string;
  readonly isEnabled: () => boolean;
  readonly minAge?: number;
  readonly maxAge?: number;
};

/**
 * Factory for catalog entries that appear on Home before the feature ships.
 * Home never hardcodes module ids — it only reads the registry.
 */
export function createCatalogModule(
  config: ComingSoonModuleConfig,
): LearningModuleManifest {
  return {
    id: config.id,
    titleKey: config.titleKey,
    minAge: config.minAge ?? TARGET_AGE_MIN,
    maxAge: config.maxAge ?? TARGET_AGE_MAX,
    homeCard: {
      titleKey: config.titleKey,
      subtitleKey: config.subtitleKey,
      iconKey: config.iconKey,
      accentColor: config.accentColor,
    },
    deepLinkPrefix: config.deepLinkPrefix,
    isEnabled: config.isEnabled,
    getNavigator: () => null,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}
