import type {Result} from '@shared/lib';
import type {LessonId} from '@core/domain';

export type ChessLessonSummary = {
  readonly id: LessonId;
  readonly titleKey: string;
  readonly order: number;
  readonly minAge: number;
};

/**
 * Port: chess lesson catalog (Firebase / remote config adapter later).
 */
export type ChessLessonRepository = {
  listLessons(): Promise<Result<readonly ChessLessonSummary[]>>;
  getLesson(id: LessonId): Promise<Result<ChessLessonSummary | null>>;
};
