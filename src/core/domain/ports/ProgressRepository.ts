import type {Result} from '@shared/lib';

import type {
  ChildId,
  ChildProgressSnapshot,
  ModuleId,
  ModuleProgressEntry,
} from '../entities';

/**
 * Port: progress persistence / sync.
 * Modules write entries; core reads snapshots for Home.
 */
export type ProgressRepository = {
  getSnapshot(childId: ChildId): Promise<Result<ChildProgressSnapshot>>;
  upsertEntry(entry: ModuleProgressEntry): Promise<Result<void>>;
  listByModule(
    childId: ChildId,
    moduleId: ModuleId,
  ): Promise<Result<readonly ModuleProgressEntry[]>>;
};
