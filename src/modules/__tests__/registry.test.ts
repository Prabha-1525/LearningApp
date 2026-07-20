import {ModuleId} from '@core/domain';
import {moduleRegistry, registerAllModules} from '@modules';
import {resetBootstrapForTests} from '@app/bootstrap';

describe('moduleRegistry', () => {
  beforeEach(() => {
    resetBootstrapForTests();
  });

  it('registers Chess and Math with navigators', () => {
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(11);
    expect(moduleRegistry.get(ModuleId.Chess)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Math)?.isEnabled()).toBe(true);
    expect(moduleRegistry.listEnabled()).toHaveLength(2);
    expect(moduleRegistry.get(ModuleId.Chess)?.getNavigator()).not.toBeNull();
    expect(moduleRegistry.get(ModuleId.Math)?.getNavigator()).not.toBeNull();
  });

  it('is idempotent', () => {
    registerAllModules();
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(11);
  });
});
