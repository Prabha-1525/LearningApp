/**
 * @format
 */

import {createAppStore} from '../src/app/store';
import {ModuleId} from '../src/core/domain';
import {moduleRegistry, registerAllModules} from '../src/modules';

test('creates persisted store with core slices', async () => {
  const {store, persistor} = createAppStore();
  const state = store.getState();

  expect(state.session.isAuthenticated).toBe(false);
  expect(state.settings.onboardingComplete).toBe(false);
  expect(state.profile.children).toEqual([]);

  persistor.pause();
  await persistor.flush();
});

test('registers chess module into the registry', () => {
  moduleRegistry.clear();
  registerAllModules();
  expect(moduleRegistry.get(ModuleId.Chess)?.id).toBe(ModuleId.Chess);
  expect(moduleRegistry.list().length).toBe(6);
});
