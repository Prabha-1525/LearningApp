import {ModuleId} from '@core/domain';
import {moduleRegistry, registerAllModules} from '@modules';
import {resetBootstrapForTests} from '@app/bootstrap';

describe('moduleRegistry', () => {
  beforeEach(() => {
    resetBootstrapForTests();
  });

  it('registers Chess, Math, WorldExplorer, BrainGames, Science, Time, Coding, and Rhymes with navigators', () => {
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(15);
    expect(moduleRegistry.get(ModuleId.Chess)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Math)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.WorldExplorer)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.BrainGames)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Science)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Time)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Coding)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Rhymes)?.isEnabled()).toBe(true);
    expect(moduleRegistry.listEnabled()).toHaveLength(8);
    expect(moduleRegistry.get(ModuleId.Chess)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Math)?.getNavigator()).not.toBeNull();
    expect(
      moduleRegistry.get(ModuleId.WorldExplorer)?.getNavigator(),
    ).not.toBeNull();
    expect(
      moduleRegistry.get(ModuleId.BrainGames)?.getNavigator(),
    ).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Science)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Time)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Coding)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Rhymes)?.getNavigator()).not.toBeNull();
  });

  it('is idempotent', () => {
    registerAllModules();
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(15);
  });
});
