export type GKCategoryId =
  | 'vehicles'
  | 'occupations'
  | 'places'
  | 'nature'
  | 'festivals'
  | 'objects'
  | 'weatherOceans'
  | 'challenge';

export type GKQuestionType =
  | 'identify-object'
  | 'identify-image'
  | 'match-purpose'
  | 'match-job'
  | 'fact-check'
  | 'scenario'
  | 'odd-one-out';

export interface GKLessonQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly questionType: GKQuestionType;
  readonly promptEmoji?: string;
  readonly options: readonly {
    readonly id: string;
    readonly textKey: string;
    readonly icon?: string;
    readonly isCorrect: boolean;
  }[];
  readonly explanationKey: string;
}

export interface GKPracticeActivity {
  readonly promptKey: string;
  readonly targetEmoji: string;
  readonly hintKey?: string;
  readonly choices: readonly {
    readonly id: string;
    readonly labelKey: string;
    readonly emoji: string;
    readonly isCorrect: boolean;
  }[];
}

export interface GKLesson {
  readonly id: string;
  readonly categoryId: GKCategoryId;
  readonly orderIndex: number;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly factKey: string;
  readonly purposeKey: string;
  readonly accentColor: string;
  readonly practice: GKPracticeActivity;
  readonly quizQuestions: readonly GKLessonQuestion[];
}

export interface GKCategory {
  readonly id: GKCategoryId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly badgeTag: string;
  readonly lessons: readonly GKLesson[];
}

export interface LessonProgressState {
  readonly completed: boolean;
  readonly stars: number;
  readonly unlocked: boolean;
}

export interface GKProgress {
  readonly lessonsProgress: Record<string, LessonProgressState>;
  readonly completedCategories: readonly string[];
  readonly challengeScore: number;
  readonly totalStars: number;
}

export const DEFAULT_GK_PROGRESS: GKProgress = {
  lessonsProgress: {},
  completedCategories: [],
  challengeScore: 0,
  totalStars: 0,
};
