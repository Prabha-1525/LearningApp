import {ModuleId} from '@core/domain';
import {registerChessModule} from '@features/chess';
import {registerMathModule} from '@features/math';
import {registerWorldExplorerModule} from '@features/worldExplorer';
import {registerBrainGamesModule} from '@features/brainGames';
import {registerScienceModule} from '@features/science';
import {registerTimeModule} from '@features/time';
import {registerCodingModule} from '@features/coding';
import {registerRhymesModule} from '@features/rhymes';
import {registerLifeSkillsModule} from '@features/lifeSkills';
import {registerGeneralKnowledgeModule} from '@features/generalKnowledge';
import {registerEnglishModule} from '@features/english';
import {registerDrawingModule} from '@features/drawing';
import {registerShapesModule} from '@features/shapes';
import {registerAnimalsModule} from '@features/animals';
import {registerStoryModule} from '@features/story';
import {registerPhonicsModule} from '@features/phonics';
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
  moduleRegistry.register(registerWorldExplorerModule());
  moduleRegistry.register(registerBrainGamesModule());
  moduleRegistry.register(registerScienceModule());
  moduleRegistry.register(registerTimeModule());
  moduleRegistry.register(registerCodingModule());
  moduleRegistry.register(registerRhymesModule());
  moduleRegistry.register(registerLifeSkillsModule());
  moduleRegistry.register(registerGeneralKnowledgeModule());
  moduleRegistry.register(registerEnglishModule());
  moduleRegistry.register(registerDrawingModule());
  moduleRegistry.register(registerShapesModule());
  moduleRegistry.register(registerAnimalsModule());
  moduleRegistry.register(registerStoryModule());
  moduleRegistry.register(registerPhonicsModule());

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
