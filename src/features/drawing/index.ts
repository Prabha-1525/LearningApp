import {ModuleId, TARGET_AGE_MAX, TARGET_AGE_MIN} from '@core/domain';
import type {LearningModuleManifest} from '@modules/types';
import {featureFlags} from '@shared/config';

import {DrawingNavigator} from '@navigation';

export function registerDrawingModule(): LearningModuleManifest {
  return {
    id: ModuleId.Drawing,
    titleKey: 'modules.drawing.title',
    minAge: TARGET_AGE_MIN,
    maxAge: TARGET_AGE_MAX,
    homeCard: {
      titleKey: 'modules.drawing.title',
      subtitleKey: 'modules.drawing.subtitle',
      iconKey: 'drawing',
      accentColor: '#EC4899',
    },
    deepLinkPrefix: 'learningapp://module/drawing',
    isEnabled: () => featureFlags.drawingEnabled,
    getNavigator: () => DrawingNavigator,
    getStoreRegistrar: () => null,
    getProgressContributor: () => null,
  };
}

export {DrawingNavigator} from '@navigation';
