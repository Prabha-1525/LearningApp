export type TimeTopicId =
  | 'clock'
  | 'day-parts'
  | 'days'
  | 'months'
  | 'seasons'
  | 'calendar'
  | 'quiz';

export type TimeTopicMeta = {
  readonly id: TimeTopicId;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly icon: string;
  readonly accentColor: string;
  readonly bgLightColor: string;
  readonly targetScreen: string;
};

export type TopicProgress = {
  readonly completed: boolean;
  readonly stars: number;
  readonly attempts: number;
  readonly lastPlayedAt?: string;
};

export type TimeProgress = {
  readonly topicsProgress: Record<TimeTopicId, TopicProgress>;
  readonly totalStars: number;
  readonly clockChallengesCompleted: readonly string[];
  readonly quizzesCompleted: number;
  readonly calendarExplored: boolean;
};

export const DEFAULT_TIME_PROGRESS: TimeProgress = {
  topicsProgress: {
    clock: {completed: false, stars: 0, attempts: 0},
    'day-parts': {completed: false, stars: 0, attempts: 0},
    days: {completed: false, stars: 0, attempts: 0},
    months: {completed: false, stars: 0, attempts: 0},
    seasons: {completed: false, stars: 0, attempts: 0},
    calendar: {completed: false, stars: 0, attempts: 0},
    quiz: {completed: false, stars: 0, attempts: 0},
  },
  totalStars: 0,
  clockChallengesCompleted: [],
  quizzesCompleted: 0,
  calendarExplored: false,
};

export type ClockStep = {
  readonly id: string;
  readonly hour: number;
  readonly minute: number;
  readonly titleKey: string;
  readonly explanationKey: string;
  readonly speechText: string;
  readonly isChallenge?: boolean;
};

export type DayPartInfo = {
  readonly id: 'morning' | 'afternoon' | 'evening' | 'night';
  readonly nameKey: string;
  readonly icon: string;
  readonly timeRange: string;
  readonly skyGradient: readonly [string, string];
  readonly descriptionKey: string;
  readonly activities: readonly {
    readonly icon: string;
    readonly titleKey: string;
  }[];
};

export type DayOfWeekInfo = {
  readonly id: string;
  readonly dayIndex: number;
  readonly nameKey: string;
  readonly shortNameKey: string;
  readonly color: string;
  readonly icon: string;
  readonly activityKey: string;
};

export type MonthInfo = {
  readonly id: string;
  readonly monthIndex: number;
  readonly nameKey: string;
  readonly shortNameKey: string;
  readonly daysCount: number;
  readonly seasonId: string;
  readonly icon: string;
  readonly color: string;
  readonly highlightKey: string;
};

export type SeasonInfo = {
  readonly id: 'summer' | 'rainy' | 'autumn' | 'winter';
  readonly nameKey: string;
  readonly icon: string;
  readonly color: string;
  readonly bgGradient: readonly [string, string];
  readonly monthsKey: string;
  readonly weatherKey: string;
  readonly clothesKey: string;
  readonly activitiesKey: string;
  readonly funFactKey: string;
  readonly visualElements: readonly string[];
};

export type QuizOption = {
  readonly id: string;
  readonly labelKey?: string;
  readonly text?: string;
  readonly icon?: string;
  readonly isCorrect: boolean;
};

export type TimeQuizQuestion = {
  readonly id: string;
  readonly type:
    | 'clock_identify'
    | 'clock_set'
    | 'day_sequence'
    | 'yesterday_tomorrow'
    | 'month_sequence'
    | 'season_match'
    | 'calendar_read'
    | 'day_part';
  readonly questionKey: string;
  readonly clockHour?: number;
  readonly clockMinute?: number;
  readonly targetHour?: number;
  readonly targetMinute?: number;
  readonly promptText?: string;
  readonly options: readonly QuizOption[];
  readonly explanationKey: string;
};
