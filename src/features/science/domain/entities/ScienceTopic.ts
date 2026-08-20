export type ScienceTopicId =
  | 'plants'
  | 'human-body'
  | 'animals'
  | 'sun-moon'
  | 'space'
  | 'weather'
  | 'water'
  | 'earth'
  | 'experiments'
  | 'quiz';

export type ScienceTopicMeta = {
  readonly id: ScienceTopicId;
  readonly icon: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly accentColor: string;
  readonly bgLightColor: string;
  readonly targetScreen: string;
  readonly starReward: number;
};
