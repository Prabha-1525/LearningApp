import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {ShapesNavigator} from '@navigation';

export function registerShapesModule(): LearningModuleManifest {
  return {
    id: ModuleId.Shapes,
    titleKey: 'modules.shapes.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.shapes.title',
      subtitleKey: 'modules.shapes.subtitle',
      iconKey: 'shapes',
      accentColor: '#3B82F6',
    },
    deepLinkPrefix: 'learningapp://module/shapes',
    isEnabled: () => featureFlags.shapesEnabled,
    getNavigator: () => ShapesNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export * from './domain/entities/shapeEntities';
export * from './domain/catalog/shapesData';
export * from './domain/audio/shapesAudioEngine';
export * from './data/progress/shapesProgress';
export * from './presentation/components';
