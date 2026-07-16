export type MathLessonId =
  | 'numbers'
  | 'counting'
  | 'missing'
  | 'sequence'
  | 'matching'
  | 'compare'
  | 'addition'
  | 'subtraction'
  | 'shapes'
  | 'colors'
  | 'big-small'
  | 'patterns'
  | 'practice';

export type MathHubActivityId =
  | MathLessonId
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'games';

export type MathStepKind = 'talk' | 'demo' | 'practice';

export type MathVisualType =
  | 'number'
  | 'objects'
  | 'equation'
  | 'sequence'
  | 'shapes'
  | 'colors'
  | 'pattern'
  | 'compare';

export type MathChoice = {
  readonly id: string;
  readonly label: string;
  readonly correct?: boolean;
};

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

export type MathPractice = {
  readonly mode: 'choice' | 'count';
  readonly choices?: readonly MathChoice[];
  readonly emojis?: readonly string[];
  readonly targetCount?: number;
  readonly praiseTa: string;
  readonly praiseEn: string;
  readonly comfortTa: string;
  readonly comfortEn: string;
};

export type MathLessonStep = {
  readonly id: string;
  readonly kind: MathStepKind;
  readonly coachTa: string;
  readonly coachEn: string;
  readonly visual?: MathVisual;
  readonly practice?: MathPractice;
};

export type MathLesson = {
  readonly id: MathLessonId;
  readonly order: number;
  readonly icon: string;
  readonly accent: string;
  readonly titleTa: string;
  readonly titleEn: string;
  readonly subtitleTa: string;
  readonly subtitleEn: string;
  readonly introTa: string;
  readonly introEn: string;
};

export type MathHubActivity = {
  readonly id: MathHubActivityId;
  readonly icon: string;
  readonly accent: string;
  readonly titleTa: string;
  readonly titleEn: string;
  readonly lessonId?: MathLessonId;
  readonly comingSoon?: boolean;
};

export function isMathLessonId(value: string): value is MathLessonId {
  return (
    value === 'numbers' ||
    value === 'counting' ||
    value === 'missing' ||
    value === 'sequence' ||
    value === 'matching' ||
    value === 'compare' ||
    value === 'addition' ||
    value === 'subtraction' ||
    value === 'shapes' ||
    value === 'colors' ||
    value === 'big-small' ||
    value === 'patterns' ||
    value === 'practice'
  );
}
