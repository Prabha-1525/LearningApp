import {ModuleId} from '@core/domain';
import {moduleRegistry, registerAllModules} from '@modules';
import {resetBootstrapForTests} from '@app/bootstrap';

describe('moduleRegistry', () => {
  beforeEach(() => {
    resetBootstrapForTests();
  });

  it('registers Chess, Math, WorldExplorer, BrainGames, and Science with navigators', () => {
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(13);
    expect(moduleRegistry.get(ModuleId.Chess)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Math)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.WorldExplorer)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.BrainGames)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Science)?.isEnabled()).toBe(true);
    expect(moduleRegistry.listEnabled()).toHaveLength(5);
    expect(moduleRegistry.get(ModuleId.Chess)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Math)?.getNavigator()).not.toBeNull();
    expect(
      moduleRegistry.get(ModuleId.WorldExplorer)?.getNavigator(),
    ).not.toBeNull();
    expect(
      moduleRegistry.get(ModuleId.BrainGames)?.getNavigator(),
    ).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Science)?.getNavigator()).not.toBeNull();
  });

  it('is idempotent', () => {
    registerAllModules();
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(13);
  });
});
