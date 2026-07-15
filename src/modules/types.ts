import type {ComponentType} from 'react';

import type {ModuleId, ProgressContributor} from '@core/domain';

/**
 * Visual card rendered on the Home module grid.
 * Core renders from this contract — never from feature internals.
 */
export type LearningModuleHomeCard = {
  readonly titleKey: string;
  readonly subtitleKey?: string;
  readonly iconKey: string;
  readonly accentColor: string;
};

/**
 * Future hook for RTK dynamic reducer injection.
 * Phase 1 may register statically; contract stays stable.
 */
export type ModuleStoreRegistrar = {
  register(): void;
};

/**
 * Contract every learning subject must satisfy to plug into the shell.
 * Core and Home depend only on this — not on Chess/Math code.
 */
export type LearningModuleManifest = {
  readonly id: ModuleId;
  readonly titleKey: string;
  readonly minAge: number;
  readonly maxAge: number;
  readonly homeCard: LearningModuleHomeCard;
  readonly deepLinkPrefix: string;
  readonly isEnabled: () => boolean;
  readonly getNavigator: () => ComponentType | null;
  readonly getStoreRegistrar?: () => ModuleStoreRegistrar | null;
  readonly getProgressContributor?: () => ProgressContributor | null;
};

export type ModuleRegistration = {
  readonly manifest: LearningModuleManifest;
  readonly registeredAt: number;
};
