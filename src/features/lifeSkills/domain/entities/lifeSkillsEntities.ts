export type LifeSkillsTopicId =
  | 'hygiene'
  | 'emotions'
  | 'manners'
  | 'routine'
  | 'habits'
  | 'safety'
  | 'quiz';

export interface HygieneHabit {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly emoji: string;
  readonly tipKey: string;
  readonly sparkleColor: string;
}

export interface EmotionItem {
  readonly id: string;
  readonly nameKey: string;
  readonly emoji: string;
  readonly color: string;
  readonly descriptionKey: string;
  readonly comfortingTipKey: string;
}

export interface EmotionScenario {
  readonly id: string;
  readonly storyKey: string;
  readonly scenarioEmoji: string;
  readonly correctEmotionId: string;
  readonly options: readonly string[];
  readonly explanationKey: string;
}

export interface MannersScenario {
  readonly id: string;
  readonly titleKey: string;
  readonly storyKey: string;
  readonly scenarioEmoji: string;
  readonly options: readonly {
    readonly id: string;
    readonly textKey: string;
    readonly isCorrect: boolean;
    readonly feedbackKey: string;
  }[];
}

export interface DailyRoutineStep {
  readonly id: string;
  readonly titleKey: string;
  readonly emoji: string;
  readonly orderIndex: number;
  readonly timeHint: string;
}

export interface HealthyHabitItem {
  readonly id: string;
  readonly category: 'food' | 'water' | 'sleep' | 'exercise';
  readonly titleKey: string;
  readonly descKey: string;
  readonly emoji: string;
  readonly color: string;
}

export interface SafetyTipItem {
  readonly id: string;
  readonly titleKey: string;
  readonly ruleKey: string;
  readonly emoji: string;
  readonly color: string;
  readonly safeChoiceKey: string;
}

export interface LifeSkillsQuizQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly promptEmoji?: string;
  readonly options: readonly {
    readonly id: string;
    readonly textKey: string;
    readonly icon?: string;
    readonly isCorrect: boolean;
  }[];
  readonly explanationKey: string;
}

export interface TopicProgress {
  readonly completed: boolean;
  readonly stars: number;
}

export interface LifeSkillsProgress {
  readonly topicsProgress: Record<LifeSkillsTopicId, TopicProgress>;
  readonly hygieneHabitsMastered: number;
  readonly emotionsExplored: number;
  readonly mannersScenariosSolved: number;
  readonly routinesSequenced: number;
  readonly totalStars: number;
}

export const DEFAULT_LIFE_SKILLS_PROGRESS: LifeSkillsProgress = {
  topicsProgress: {
    hygiene: {completed: false, stars: 0},
    emotions: {completed: false, stars: 0},
    manners: {completed: false, stars: 0},
    routine: {completed: false, stars: 0},
    habits: {completed: false, stars: 0},
    safety: {completed: false, stars: 0},
    quiz: {completed: false, stars: 0},
  },
  hygieneHabitsMastered: 0,
  emotionsExplored: 0,
  mannersScenariosSolved: 0,
  routinesSequenced: 0,
  totalStars: 0,
};
