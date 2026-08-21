export type ShapeSubModuleId =
  | 'learn_shapes'
  | 'recognition'
  | 'matching'
  | 'properties'
  | 'sorting'
  | 'compare'
  | 'around_us'
  | 'count'
  | 'patterns'
  | 'puzzles'
  | 'quiz'
  | 'challenge';

export interface ShapeDefinition {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly color: string;
  readonly lightColor: string;
  readonly darkColor: string;
  readonly sides: number;
  readonly corners: number;
  readonly isCurved: boolean;
  readonly description: string;
  readonly audioPronunciation: string;
  readonly sideLabels: readonly string[]; // Labels for each side when counting
  readonly cornerLabels: readonly string[]; // Labels for each corner when counting
  readonly realWorldExamples: readonly {
    readonly id: string;
    readonly name: string;
    readonly emoji: string;
    readonly description: string;
  }[];
  readonly funFact: string;
}

export interface ShapeRecognitionItem {
  readonly id: string;
  readonly prompt: string;
  readonly targetShapeId: string;
  readonly options: readonly {
    readonly id: string;
    readonly shapeId: string;
    readonly emoji: string;
    readonly color: string;
    readonly rotationDeg: number;
    readonly scale: number;
  }[];
}

export interface ShapeMatchingPair {
  readonly id: string;
  readonly shapeId: string;
  readonly shapeName: string;
  readonly leftEmoji: string;
  readonly leftColor: string;
  readonly rightEmoji: string;
  readonly rightColor: string;
}

export interface ShapeSortingItem {
  readonly id: string;
  readonly shapeId: string;
  readonly emoji: string;
  readonly color: string;
  readonly size: 'small' | 'medium' | 'large';
}

export interface ShapeSortingContainer {
  readonly id: string;
  readonly targetShapeId: string;
  readonly title: string;
  readonly emoji: string;
  readonly color: string;
}

export interface ShapeSortingLevel {
  readonly id: string;
  readonly levelNumber: 1 | 2 | 3;
  readonly title: string;
  readonly containers: readonly ShapeSortingContainer[];
  readonly items: readonly ShapeSortingItem[];
}

export interface ShapeComparisonItem {
  readonly id: string;
  readonly question: string;
  readonly promptAudio: string;
  readonly shapeA: ShapeDefinition;
  readonly shapeB: ShapeDefinition;
  readonly correctShapeId: string;
  readonly explanation: string;
}

export interface ShapeAroundUsItem {
  readonly id: string;
  readonly objectName: string;
  readonly objectEmoji: string;
  readonly correctShapeId: string;
  readonly correctShapeName: string;
  readonly options: readonly {
    readonly shapeId: string;
    readonly name: string;
    readonly emoji: string;
  }[];
}

export interface ShapeCountItem {
  readonly id: string;
  readonly targetShapeId: string;
  readonly targetShapeName: string;
  readonly targetEmoji: string;
  readonly displayedItems: readonly {
    readonly id: string;
    readonly shapeId: string;
    readonly emoji: string;
    readonly color: string;
  }[];
  readonly correctCount: number;
  readonly options: readonly number[];
}

export interface ShapePatternItem {
  readonly id: string;
  readonly patternType: 'AB' | 'AAB' | 'ABC' | 'AABB';
  readonly sequence: readonly {
    readonly shapeId: string;
    readonly emoji: string;
  }[];
  readonly correctShapeId: string;
  readonly correctEmoji: string;
  readonly options: readonly {
    readonly shapeId: string;
    readonly emoji: string;
  }[];
}

export interface ShapePuzzleItem {
  readonly id: string;
  readonly puzzleType: 'odd_one_out' | 'missing_sequence' | 'match_missing';
  readonly prompt: string;
  readonly items: readonly {
    readonly id: string;
    readonly shapeId: string;
    readonly emoji: string;
    readonly color: string;
    readonly isDifferent?: boolean;
  }[];
  readonly answerId: string;
  readonly explanation: string;
}

export interface ShapeMemoryCard {
  readonly id: string;
  readonly shapeId: string;
  readonly emoji: string;
  readonly name: string;
  readonly matchKey: string;
}

export interface ShapeQuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly promptAudio?: string;
  readonly type:
    | 'identify'
    | 'match_object'
    | 'count_sides'
    | 'count_corners'
    | 'pattern'
    | 'odd_one';
  readonly targetEmoji?: string;
  readonly options: readonly {
    readonly id: string;
    readonly text: string;
    readonly emoji?: string;
  }[];
  readonly answerId: string;
  readonly explanation: string;
}

export interface ShapeLessonState {
  readonly completed: boolean;
  readonly stars: number;
  readonly score: number;
  readonly unlocked: boolean;
}

export interface ShapesProgress {
  readonly completedSubModules: readonly ShapeSubModuleId[];
  readonly lessonsProgress: Record<string, ShapeLessonState>;
  readonly shapesLearned: readonly string[];
  readonly recognitionMastered: readonly string[];
  readonly matchingDone: readonly string[];
  readonly propertiesKnown: readonly string[];
  readonly sortingDone: readonly string[];
  readonly patternsSolved: readonly string[];
  readonly puzzlesSolved: readonly string[];
  readonly totalStars: number;
}

export const DEFAULT_SHAPES_PROGRESS: ShapesProgress = {
  completedSubModules: [],
  lessonsProgress: {
    learn_shapes_intro: {completed: false, stars: 0, score: 0, unlocked: true},
    recognition_intro: {completed: false, stars: 0, score: 0, unlocked: true},
  },
  shapesLearned: [],
  recognitionMastered: [],
  matchingDone: [],
  propertiesKnown: [],
  sortingDone: [],
  patternsSolved: [],
  puzzlesSolved: [],
  totalStars: 0,
};

export interface ShapeSubModuleConfig {
  readonly id: ShapeSubModuleId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly bgLightColor: string;
  readonly orderIndex: number;
  readonly routeName: string;
}
