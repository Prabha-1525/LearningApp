import {ModuleId} from '@core/domain';
import {moduleRegistry, registerAllModules} from '@modules';
import {resetBootstrapForTests} from '@app/bootstrap';

describe('moduleRegistry', () => {
  beforeEach(() => {
    resetBootstrapForTests();
  });

  it('registers catalog modules with only Chess enabled', () => {
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(6);
    expect(moduleRegistry.get(ModuleId.Chess)?.isEnabled()).toBe(true);
    expect(moduleRegistry.get(ModuleId.Math)?.isEnabled()).toBe(false);
    expect(moduleRegistry.listEnabled()).toHaveLength(1);
    expect(moduleRegistry.get(ModuleId.Chess)?.getNavigator()).not.toBeNull();
  });

  it('is idempotent', () => {
    registerAllModules();
    registerAllModules();

    expect(moduleRegistry.list()).toHaveLength(6);
  });
});
