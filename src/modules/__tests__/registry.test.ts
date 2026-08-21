import {ModuleId} from '@core/domain';
import {moduleRegistry, registerAllModules} from '@modules';
import {resetBootstrapForTests} from '@app/bootstrap';

describe('moduleRegistry', () => {
  beforeEach(() => {
    resetBootstrapForTests();
  });

  it('registers Chess, Math, WorldExplorer, BrainGames, Science, Time, Coding, Rhymes, LifeSkills, and GeneralKnowledge with navigators', () => {
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(17);
    expect(moduleRegistry.get(ModuleId.Chess)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Math)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.WorldExplorer)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.BrainGames)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Science)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Time)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Coding)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Rhymes)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.LifeSkills)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.GeneralKnowledge)?.isEnabled()).toBe(
      true,
    );
    expect(moduleRegistry.get(ModuleId.English)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Drawing)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Shapes)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Animals)?.isEnabled()).toBe(true);
    expect(moduleRegistry.listEnabled()).toHaveLength(14);
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
    expect(
      moduleRegistry.get(ModuleId.LifeSkills)?.getNavigator(),
    ).not.toBeNull();
    expect(
      moduleRegistry.get(ModuleId.GeneralKnowledge)?.getNavigator(),
    ).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.English)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Drawing)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Shapes)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Animals)?.getNavigator()).not.toBeNull();
  });

  it('is idempotent', () => {
    registerAllModules();
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(17);
  });
});
