export type QuizType = 'flag' | 'capital' | 'continent' | 'landmark' | 'fact';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type QuizOption = {
  readonly id: string;
  readonly label: string;
  readonly isCorrect: boolean;
  readonly flagEmoji?: string;
  readonly icon?: string;
};

export type QuizQuestion = {
  readonly id: string;
  readonly type: QuizType;
  readonly difficulty: DifficultyLevel;
  readonly promptText: string;
  readonly promptSubtext?: string;
  readonly flagEmoji?: string;
  readonly imageUrl?: string;
  readonly countryCode?: string;
  readonly options: readonly QuizOption[];
  readonly explanationText?: string;
};
