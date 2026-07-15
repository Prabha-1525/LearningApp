import type {IsoDateTimeString} from '@shared/types';

import type {ChildId, LessonId, ModuleId} from './ModuleId';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * Normalized progress unit every learning module contributes.
 * Core aggregates these without knowing Chess/Math internals.
 */
export type ModuleProgressEntry = {
  readonly childId: ChildId;
  readonly moduleId: ModuleId;
  readonly lessonId: LessonId | null;
  readonly status: ProgressStatus;
  readonly scorePercent: number | null;
  readonly starsEarned: number;
  readonly timeSpentSeconds: number;
  readonly updatedAt: IsoDateTimeString;
};

export type ChildProgressSnapshot = {
  readonly childId: ChildId;
  readonly entries: readonly ModuleProgressEntry[];
  readonly lastModuleId: ModuleId | null;
  readonly syncedAt: IsoDateTimeString | null;
};
