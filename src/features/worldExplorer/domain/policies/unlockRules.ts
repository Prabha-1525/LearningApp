export type ActivityId =
  | 'countries'
  | 'flags'
  | 'continents'
  | 'capitals'
  | 'landmarks'
  | 'quiz';

export type ActivityProgressState = {
  readonly exploredCountryCodes: readonly string[];
  readonly learnedFlagCodes: readonly string[];
  readonly exploredContinents: readonly string[];
  readonly learnedCapitals: readonly string[];
  readonly exploredLandmarkIds: readonly string[];
  readonly quizCompletedCount: number;
};

export type UnlockRequirement = {
  readonly activityId: ActivityId;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly isUnlocked: (progress: ActivityProgressState) => boolean;
  readonly requiredCountLabel?: string;
};

export const UNLOCK_RULES: Record<ActivityId, UnlockRequirement> = {
  countries: {
    activityId: 'countries',
    titleKey: 'worldExplorer.activities.countries',
    descriptionKey: 'worldExplorer.activities.countriesDesc',
    isUnlocked: () => true, // Unlocked by default
  },
  flags: {
    activityId: 'flags',
    titleKey: 'worldExplorer.activities.flags',
    descriptionKey: 'worldExplorer.activities.flagsDesc',
    isUnlocked: p => p.exploredCountryCodes.length >= 3,
    requiredCountLabel: 'Explore 3 countries first',
  },
  continents: {
    activityId: 'continents',
    titleKey: 'worldExplorer.activities.continents',
    descriptionKey: 'worldExplorer.activities.continentsDesc',
    isUnlocked: p => p.exploredCountryCodes.length >= 5,
    requiredCountLabel: 'Explore 5 countries first',
  },
  capitals: {
    activityId: 'capitals',
    titleKey: 'worldExplorer.activities.capitals',
    descriptionKey: 'worldExplorer.activities.capitalsDesc',
    isUnlocked: p => p.exploredCountryCodes.length >= 8,
    requiredCountLabel: 'Explore 8 countries first',
  },
  landmarks: {
    activityId: 'landmarks',
    titleKey: 'worldExplorer.activities.landmarks',
    descriptionKey: 'worldExplorer.activities.landmarksDesc',
    isUnlocked: p => p.exploredCountryCodes.length >= 10,
    requiredCountLabel: 'Explore 10 countries first',
  },
  quiz: {
    activityId: 'quiz',
    titleKey: 'worldExplorer.activities.quiz',
    descriptionKey: 'worldExplorer.activities.quizDesc',
    isUnlocked: p =>
      p.exploredCountryCodes.length >= 12 || p.learnedFlagCodes.length >= 5,
    requiredCountLabel: 'Explore 12 countries or 5 flags first',
  },
};

export function isActivityUnlocked(
  activityId: ActivityId,
  progress: ActivityProgressState,
): boolean {
  const rule = UNLOCK_RULES[activityId];
  return rule ? rule.isUnlocked(progress) : true;
}
