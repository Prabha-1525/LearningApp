import type {ScienceTopicId} from './ScienceTopic';

export type TopicProgress = {
  readonly completed: boolean;
  readonly stars: number;
  readonly attempts: number;
  readonly lastPlayedAt?: string;
};

export type ScienceProgress = {
  readonly topicsProgress: Record<ScienceTopicId, TopicProgress>;
  readonly completedExperiments: readonly string[];
  readonly totalStars: number;
  readonly quizzesCompleted: number;
};

export const DEFAULT_SCIENCE_PROGRESS: ScienceProgress = {
  topicsProgress: {
    plants: {completed: false, stars: 0, attempts: 0},
    'human-body': {completed: false, stars: 0, attempts: 0},
    animals: {completed: false, stars: 0, attempts: 0},
    'sun-moon': {completed: false, stars: 0, attempts: 0},
    space: {completed: false, stars: 0, attempts: 0},
    weather: {completed: false, stars: 0, attempts: 0},
    water: {completed: false, stars: 0, attempts: 0},
    earth: {completed: false, stars: 0, attempts: 0},
    experiments: {completed: false, stars: 0, attempts: 0},
    quiz: {completed: false, stars: 0, attempts: 0},
  },
  completedExperiments: [],
  totalStars: 0,
  quizzesCompleted: 0,
};
