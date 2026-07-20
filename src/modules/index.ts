import {ModuleId} from '@core/domain';
import {registerChessModule} from '@features/chess';
import {registerMathModule} from '@features/math';
import {featureFlags} from '@shared/config';

import {createCatalogModule} from './createCatalogModule';
import {moduleRegistry} from './registry';

/**
 * Single composition point for feature registration.
 * Adding a module = register here (or feature entry) — never edit HomeScreen.
 */
export function registerAllModules(): void {
  if (moduleRegistry.list().length > 0) {
    return;
  }

  moduleRegistry.register(registerChessModule());
  moduleRegistry.register(registerMathModule());

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.English,
      titleKey: 'modules.english.title',
      subtitleKey: 'modules.english.subtitle',
      iconKey: 'english',
      accentColor: '#E4578C',
      deepLinkPrefix: 'learningapp://module/english',
      isEnabled: () => featureFlags.englishEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Drawing,
      titleKey: 'modules.drawing.title',
      subtitleKey: 'modules.drawing.subtitle',
      iconKey: 'drawing',
      accentColor: '#8B5CF6',
      deepLinkPrefix: 'learningapp://module/drawing',
      isEnabled: () => featureFlags.drawingEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Shapes,
      titleKey: 'modules.shapes.title',
      subtitleKey: 'modules.shapes.subtitle',
      iconKey: 'shapes',
      accentColor: '#7BC96F',
      deepLinkPrefix: 'learningapp://module/shapes',
      isEnabled: () => featureFlags.shapesEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Animals,
      titleKey: 'modules.animals.title',
      subtitleKey: 'modules.animals.subtitle',
      iconKey: 'animals',
      accentColor: '#F5A623',
      deepLinkPrefix: 'learningapp://module/animals',
      isEnabled: () => featureFlags.animalsEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Rhymes,
      titleKey: 'modules.rhymes.title',
      subtitleKey: 'modules.rhymes.subtitle',
      iconKey: 'rhymes',
      accentColor: '#A855D3',
      deepLinkPrefix: 'learningapp://module/rhymes',
      isEnabled: () => featureFlags.rhymesEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Story,
      titleKey: 'modules.story.title',
      subtitleKey: 'modules.story.subtitle',
      iconKey: 'story',
      accentColor: '#C4A05A',
      deepLinkPrefix: 'learningapp://module/story',
      isEnabled: () => featureFlags.storyEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Phonics,
      titleKey: 'modules.phonics.title',
      subtitleKey: 'modules.phonics.subtitle',
      iconKey: 'phonics',
      accentColor: '#F06292',
      deepLinkPrefix: 'learningapp://module/phonics',
      isEnabled: () => featureFlags.phonicsEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Science,
      titleKey: 'modules.science.title',
      subtitleKey: 'modules.science.subtitle',
      iconKey: 'science',
      accentColor: '#5B7CFA',
      deepLinkPrefix: 'learningapp://module/science',
      isEnabled: () => featureFlags.scienceEnabled,
    }),
  );

  moduleRegistry.register(
    createCatalogModule({
      id: ModuleId.Memory,
      titleKey: 'modules.memory.title',
      subtitleKey: 'modules.memory.subtitle',
      iconKey: 'memory',
      accentColor: '#FF9F1C',
      deepLinkPrefix: 'learningapp://module/memory',
      isEnabled: () => featureFlags.memoryEnabled,
    }),
  );
}

export {moduleRegistry} from './registry';
export {createCatalogModule} from './createCatalogModule';
export type {
  LearningModuleHomeCard,
  LearningModuleManifest,
  ModuleRegistration,
  ModuleStoreRegistrar,
} from './types';
