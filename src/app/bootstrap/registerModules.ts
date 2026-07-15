import {moduleRegistry, registerAllModules} from '@modules';

let bootstrapped = false;

/**
 * Idempotent app bootstrap — register modules before the shell renders.
 */
export function bootstrapApp(): void {
  if (bootstrapped) {
    return;
  }
  registerAllModules();
  bootstrapped = true;
}

/** Test helper — clears module registry and bootstrap flag. */
export function resetBootstrapForTests(): void {
  moduleRegistry.clear();
  bootstrapped = false;
}
