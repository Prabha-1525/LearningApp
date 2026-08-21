export type DrawingSubModuleId =
  | 'colors'
  | 'color_match'
  | 'color_mix'
  | 'coloring'
  | 'trace'
  | 'shapes'
  | 'draw_objects'
  | 'guided_drawing'
  | 'free_drawing'
  | 'creative_challenge';

export interface ColorItem {
  readonly id: string;
  readonly name: string;
  readonly hex: string;
  readonly lightHex: string;
  readonly darkHex: string;
  readonly isPrimary: boolean;
  readonly objects: readonly {
    readonly id: string;
    readonly name: string;
    readonly emoji: string;
    readonly description: string;
  }[];
  readonly audioPronunciation: string;
  readonly funFact: string;
  readonly soundHint: string;
}

export interface ColorMatchingItem {
  readonly id: string;
  readonly prompt: string;
  readonly targetColorId: string;
  readonly targetHex: string;
  readonly objectName: string;
  readonly objectEmoji: string;
  readonly options: readonly {
    readonly colorId: string;
    readonly hex: string;
    readonly name: string;
  }[];
}

export interface ColorMixingRecipe {
  readonly id: string;
  readonly color1: {
    readonly name: string;
    readonly hex: string;
    readonly emoji: string;
  };
  readonly color2: {
    readonly name: string;
    readonly hex: string;
    readonly emoji: string;
  };
  readonly resultColor: {
    readonly name: string;
    readonly hex: string;
    readonly emoji: string;
    readonly description: string;
  };
  readonly quizOptions: readonly {
    readonly name: string;
    readonly hex: string;
    readonly emoji: string;
  }[];
}

export interface ColoringRegion {
  readonly id: string;
  readonly name: string;
  readonly suggestedColorHex: string;
  readonly defaultColorHex?: string;
  // Scalable SVG/vector-like bounding box & path coordinates
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly borderRadius?: number;
  readonly shapeType: 'rect' | 'circle' | 'ellipse' | 'triangle' | 'path';
  readonly pathData?: string; // For polygon/custom geometry
}

export interface ColoringPage {
  readonly id: string;
  readonly title: string;
  readonly category:
    | 'fruits'
    | 'nature'
    | 'animals'
    | 'vehicles'
    | 'objects'
    | 'scenes';
  readonly difficulty: 1 | 2 | 3 | 4 | 5;
  readonly emoji: string;
  readonly viewBox: {
    readonly width: number;
    readonly height: number;
  };
  readonly regions: readonly ColoringRegion[];
}

export interface TracingPath {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly type: 'line' | 'curve' | 'zigzag' | 'wave' | 'shape';
  readonly emoji: string;
  readonly points: readonly {
    readonly x: number;
    readonly y: number;
  }[];
  readonly pathGuideSvg?: string;
}

export interface ShapeItem {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly color: string;
  readonly sides: number;
  readonly funFact: string;
  readonly strokeSequence: readonly string[]; // Steps to draw e.g. "1. Start at the top", "2. Curve all the way round"
  readonly guidePoints: readonly {readonly x: number; readonly y: number}[];
}

export interface SimpleObjectDrawingItem {
  readonly id: string;
  readonly title: string;
  readonly emoji: string;
  readonly level: 1 | 2 | 3;
  readonly baseShape: string;
  readonly instructions: readonly string[];
  readonly stepPreviews: readonly string[]; // Step diagrams
}

export interface GuidedDrawingStep {
  readonly stepNumber: number;
  readonly instruction: string;
  readonly hintEmoji?: string;
  // Partial strokes or path elements added in this step
  readonly strokeDescription: string;
  readonly guidePoints: readonly {readonly x: number; readonly y: number}[];
}

export interface GuidedDrawingLesson {
  readonly id: string;
  readonly title: string;
  readonly emoji: string;
  readonly totalSteps: number;
  readonly steps: readonly GuidedDrawingStep[];
  readonly coloringSuggestion: readonly string[];
}

export interface CreativeChallengeItem {
  readonly id: string;
  readonly title: string;
  readonly prompt: string;
  readonly emoji: string;
  readonly inspirationalTips: readonly string[];
  readonly suggestedPalette: readonly string[];
}

export interface DrawingStrokePoint {
  readonly x: number;
  readonly y: number;
}

export interface DrawingStroke {
  readonly id: string;
  readonly color: string;
  readonly width: number;
  readonly isEraser: boolean;
  readonly points: readonly DrawingStrokePoint[];
}

export interface GalleryArtwork {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
  readonly strokes: readonly DrawingStroke[];
  readonly filledRegions?: Record<string, string>; // for coloring pages
  readonly coloringPageId?: string;
  readonly type: 'free_drawing' | 'guided_drawing' | 'coloring' | 'challenge';
  readonly isFavorite: boolean;
  readonly emojiThumbnail: string;
  readonly backgroundColor?: string;
}

export interface DrawingQuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly promptAudioText?: string;
  readonly type:
    | 'color_identify'
    | 'object_match'
    | 'color_mix'
    | 'shape_identify';
  readonly targetEmoji?: string;
  readonly targetHex?: string;
  readonly options: readonly {
    readonly id: string;
    readonly text: string;
    readonly hex?: string;
    readonly emoji?: string;
  }[];
  readonly answerId: string;
  readonly explanation: string;
}

export interface DrawingLessonState {
  readonly completed: boolean;
  readonly stars: number;
  readonly score: number;
  readonly unlocked: boolean;
}

export interface DrawingProgress {
  readonly completedSubModules: readonly DrawingSubModuleId[];
  readonly lessonsProgress: Record<string, DrawingLessonState>;
  readonly colorsLearned: readonly string[];
  readonly objectsColored: readonly string[];
  readonly shapesMastered: readonly string[];
  readonly guidedDrawingsCompleted: readonly string[];
  readonly challengesCompleted: readonly string[];
  readonly totalStars: number;
  readonly savedGalleryCount: number;
}

export const DEFAULT_DRAWING_PROGRESS: DrawingProgress = {
  completedSubModules: [],
  lessonsProgress: {
    learn_colors_intro: {completed: false, stars: 0, score: 0, unlocked: true},
    color_match_intro: {completed: false, stars: 0, score: 0, unlocked: true},
  },
  colorsLearned: [],
  objectsColored: [],
  shapesMastered: [],
  guidedDrawingsCompleted: [],
  challengesCompleted: [],
  totalStars: 0,
  savedGalleryCount: 0,
};

export interface DrawingSubModuleConfig {
  readonly id: DrawingSubModuleId;
  readonly titleKey: string;
  readonly subtitleKey: string;
  readonly emoji: string;
  readonly accentColor: string;
  readonly bgLightColor: string;
  readonly orderIndex: number;
  readonly routeName: string;
}
