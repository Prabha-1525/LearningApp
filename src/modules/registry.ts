import type {ModuleId} from '@core/domain';
import {invariant} from '@shared/lib';

import type {LearningModuleManifest, ModuleRegistration} from './types';

/**
 * In-memory module registry.
 * Features call register(); core/Home reads list/get.
 */
class ModuleRegistryImpl {
  private readonly modules = new Map<ModuleId, ModuleRegistration>();

  register(manifest: LearningModuleManifest): void {
    invariant(
      !this.modules.has(manifest.id),
      `Module already registered: ${manifest.id}`,
    );
    this.modules.set(manifest.id, {
      manifest,
      registeredAt: Date.now(),
    });
  }

  get(id: ModuleId): LearningModuleManifest | undefined {
    return this.modules.get(id)?.manifest;
  }

  list(): readonly LearningModuleManifest[] {
    return Array.from(this.modules.values()).map(
      registration => registration.manifest,
    );
  }

  listEnabled(): readonly LearningModuleManifest[] {
    return this.list().filter(manifest => manifest.isEnabled());
  }

  listForAge(ageYears: number): readonly LearningModuleManifest[] {
    return this.listEnabled().filter(
      manifest => ageYears >= manifest.minAge && ageYears <= manifest.maxAge,
    );
  }

  has(id: ModuleId): boolean {
    return this.modules.has(id);
  }

  /** Test / hot-reload helper — do not call from production UI. */
  clear(): void {
    this.modules.clear();
  }
}

export const moduleRegistry = new ModuleRegistryImpl();
