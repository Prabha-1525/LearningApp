import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {ChessNavigator} from './presentation/navigation';

/**
 * Public entry for the Chess feature.
 * Core/shell imports only this file via modules/index registration.
 */
export function registerChessModule(): LearningModuleManifest {
  return {
    id: ModuleId.Chess,
    titleKey: 'modules.chess.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.chess.title',
      subtitleKey: 'modules.chess.subtitle',
      iconKey: 'chess',
      accentColor: '#3D9A5F',
    },
    deepLinkPrefix: 'learningapp://module/chess',
    isEnabled: () => featureFlags.chessEnabled,
    getNavigator: () => ChessNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export * from './domain';
export {chessQueryKeys} from './api';
export {ChessNavigator} from './presentation/navigation';
