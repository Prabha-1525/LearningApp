import type {HighlightTone, PieceMap, Square} from '../board/squares';

export type ChessLessonId =
  | 'board'
  | 'pawn'
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'queen'
  | 'king';

export type LessonStepKind = 'talk' | 'demo' | 'practice';

export type DemoMove = {
  readonly from: Square;
  readonly to: Square;
};

export type PracticeSpec = {
  readonly mode: 'tap' | 'move';
  /** For tap: correct squares. For move: destination squares after selecting from. */
  readonly targets: readonly Square[];
  /** Required start square when mode is move. */
  readonly from?: Square;
  readonly praiseTa: string;
  readonly praiseEn: string;
  readonly comfortTa: string;
  readonly comfortEn: string;
};

export type LessonStep = {
  readonly id: string;
  readonly kind: LessonStepKind;
  readonly coachTa: string;
  readonly coachEn: string;
  readonly pieces?: PieceMap;
  readonly highlights?: readonly Square[];
  readonly highlightTone?: HighlightTone;
  readonly demo?: readonly DemoMove[];
  readonly practice?: PracticeSpec;
};

export type ChessLesson = {
  readonly id: ChessLessonId;
  readonly order: number;
  readonly titleTa: string;
  readonly titleEn: string;
  readonly subtitleTa: string;
  readonly subtitleEn: string;
  readonly steps: readonly LessonStep[];
};

export function isChessLessonId(value: string): value is ChessLessonId {
  return (
    value === 'board' ||
    value === 'pawn' ||
    value === 'rook' ||
    value === 'knight' ||
    value === 'bishop' ||
    value === 'queen' ||
    value === 'king'
  );
}
