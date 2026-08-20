export type CodingCommand = 'up' | 'down' | 'left' | 'right' | 'jump' | 'grab';

export type CodingTopicId =
  | 'robot'
  | 'instructions'
  | 'sequencing'
  | 'loops'
  | 'conditionals'
  | 'debugging'
  | 'challenge';

export interface CommandMeta {
  readonly id: CodingCommand;
  readonly labelKey: string;
  readonly icon: string;
  readonly dx: number;
  readonly dy: number;
  readonly color: string;
}

export type GridCellType =
  | 'empty'
  | 'obstacle'
  | 'water'
  | 'star'
  | 'gem'
  | 'key'
  | 'door';

export interface GridPosition {
  readonly row: number;
  readonly col: number;
}

export interface RobotMazeLevel {
  readonly id: string;
  readonly levelNumber: number;
  readonly titleKey: string;
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced';
  readonly gridSize: {readonly rows: number; readonly cols: number};
  readonly startPos: GridPosition;
  readonly goalPos: GridPosition;
  readonly obstacles: readonly GridPosition[];
  readonly starsTarget: number;
  readonly maxCommands: number;
  readonly hintCommands?: readonly CodingCommand[];
  readonly theme: 'space' | 'forest' | 'treasure' | 'castle';
  readonly loopAllowed?: boolean;
}

export interface SequencingStep {
  readonly id: string;
  readonly stepNumber: number;
  readonly textKey: string;
  readonly icon: string;
}

export interface SequencingStory {
  readonly id: string;
  readonly titleKey: string;
  readonly category: 'daily' | 'nature' | 'cooking' | 'health';
  readonly steps: readonly SequencingStep[];
  readonly correctOrder: readonly string[]; // Array of step IDs in 1..4 order
  readonly storySummaryKey: string;
}

export interface LoopChallenge {
  readonly id: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly repeatCount: number;
  readonly loopCommand: CodingCommand;
  readonly targetDistance: number;
  readonly themeEmoji: string;
  readonly options: readonly {
    readonly count: number;
    readonly cmd: CodingCommand;
    readonly isCorrect: boolean;
  }[];
}

export interface ConditionScenario {
  readonly id: string;
  readonly ifConditionKey: string;
  readonly ifIcon: string;
  readonly correctThenKey: string;
  readonly correctThenIcon: string;
  readonly distractorThens: readonly {
    readonly textKey: string;
    readonly icon: string;
  }[];
}

export interface DebuggingPuzzle {
  readonly id: string;
  readonly titleKey: string;
  readonly promptKey: string;
  readonly gridSize: {readonly rows: number; readonly cols: number};
  readonly startPos: GridPosition;
  readonly goalPos: GridPosition;
  readonly obstacles: readonly GridPosition[];
  readonly initialCode: readonly CodingCommand[];
  readonly buggyIndex: number;
  readonly correctCommand: CodingCommand;
  readonly explanationKey: string;
}

export interface ChallengeQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly category: CodingTopicId;
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
  readonly highLevel?: number;
}

export interface CodingProgress {
  readonly topicsProgress: Record<CodingTopicId, TopicProgress>;
  readonly robotMazesSolved: number;
  readonly debuggingPuzzlesSolved: number;
  readonly sequencingPuzzlesSolved: number;
  readonly totalStars: number;
}

export const DEFAULT_CODING_PROGRESS: CodingProgress = {
  topicsProgress: {
    robot: {completed: false, stars: 0},
    instructions: {completed: false, stars: 0},
    sequencing: {completed: false, stars: 0},
    loops: {completed: false, stars: 0},
    conditionals: {completed: false, stars: 0},
    debugging: {completed: false, stars: 0},
    challenge: {completed: false, stars: 0},
  },
  robotMazesSolved: 0,
  debuggingPuzzlesSolved: 0,
  sequencingPuzzlesSolved: 0,
  totalStars: 0,
};
