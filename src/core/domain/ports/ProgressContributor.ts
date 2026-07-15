import type {ChildId, ModuleId, ModuleProgressEntry} from '../entities';

/**
 * Optional contributor each learning module can expose so the Home shell
 * can summarize progress without importing feature internals.
 */
export type ProgressContributor = {
  readonly moduleId: ModuleId;
  summarize(
    childId: ChildId,
    entries: readonly ModuleProgressEntry[],
  ): {
    readonly completedLessons: number;
    readonly totalLessons: number | null;
    readonly starsEarned: number;
  };
};
