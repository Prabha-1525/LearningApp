import type {MathLessonId} from '../curriculum/types';

export type DifficultyLevel = 1 | 2 | 3 | 4;

export type MathChoice = {
  readonly id: string;
  readonly label: string;
  readonly correct?: boolean;
};

export type MathVisualType =
  | 'number'
  | 'objects'
  | 'equation'
  | 'sequence'
  | 'shapes'
  | 'colors'
  | 'pattern'
  | 'compare';

export type MathVisual = {
  readonly type: MathVisualType;
  readonly number?: number;
  readonly emojis?: readonly string[];
  readonly equation?: string;
  readonly sequence?: readonly (number | null)[];
  readonly pattern?: readonly string[];
  readonly shape?: string;
  readonly color?: string;
  readonly compareLeft?: number;
  readonly compareRight?: number;
};

export type ScatterOffset = {
  readonly x: number;
  readonly y: number;
};

export type MathQuestionPractice = {
  readonly mode: 'choice' | 'count';
  readonly choices?: readonly MathChoice[];
  readonly emojis?: readonly string[];
  readonly scatterOffsets?: readonly ScatterOffset[];
  readonly targetCount?: number;
};

export type MathQuestion = {
  readonly id: string;
  readonly lessonId: MathLessonId;
  readonly coachTa: string;
  readonly coachEn: string;
  readonly explainTa: string;
  readonly explainEn: string;
  readonly visual: MathVisual;
  readonly practice: MathQuestionPractice;
};

export type ObjectPool = {
  readonly id: string;
  readonly labelTa: string;
  readonly labelEn: string;
  readonly emojis: readonly string[];
};
