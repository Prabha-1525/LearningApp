export type StoryCategoryType =
  | 'moral'
  | 'animals'
  | 'friendship'
  | 'nature'
  | 'adventure'
  | 'school'
  | 'indian'
  | 'bedtime';

export type CharacterAnimationType =
  | 'idle'
  | 'hop'
  | 'walk'
  | 'fly'
  | 'bounce'
  | 'wave'
  | 'float'
  | 'wag_tail';

export type CharacterPositionType = 'left' | 'center' | 'right' | 'top';

export type CharacterExpressionType =
  | 'happy'
  | 'surprised'
  | 'sad'
  | 'sleepy'
  | 'thinking'
  | 'excited';

export type StoryCharacterDef = {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly roleDescription?: string;
  readonly defaultPosition: CharacterPositionType;
  readonly defaultAnimation: CharacterAnimationType;
  readonly expression?: CharacterExpressionType;
};

export type SceneCharacterPlacement = {
  readonly id: string;
  readonly name?: string;
  readonly emoji: string;
  readonly position: CharacterPositionType;
  readonly animation: CharacterAnimationType;
  readonly speechBubble?: string;
  readonly expression?: CharacterExpressionType;
};

export type StorySceneDef = {
  readonly id: string;
  readonly sceneNumber: number;
  readonly backgroundKey: string;
  readonly bgColors: readonly [string, string];
  readonly bgDecorEmoji?: readonly string[];
  readonly characters: readonly SceneCharacterPlacement[];
  readonly text: string;
  readonly narrationText: string;
  readonly dialogueSpeaker?: string;
};

export type StoryCategory = {
  readonly id: StoryCategoryType;
  readonly titleKey: string;
  readonly emoji: string;
  readonly color: string;
  readonly lightColor: string;
};

export type StoryItem = {
  readonly id: string;
  readonly title: string;
  readonly titleKey: string;
  readonly description: string;
  readonly descriptionKey: string;
  readonly categoryId: StoryCategoryType;
  readonly level: 1 | 2 | 3;
  readonly durationMinutes: number;
  readonly coverEmoji: string;
  readonly coverBgColor: string;
  readonly accentColor: string;
  readonly moralLesson: string;
  readonly moralKey: string;
  readonly characters: readonly StoryCharacterDef[];
  readonly scenes: readonly StorySceneDef[];
};

export type StoryAudioSettings = {
  readonly autoNarration: boolean;
  readonly narrationSpeed: number;
  readonly readAlongHighlight: boolean;
};

export type StoryBookmark = {
  readonly currentSceneIndex: number;
  readonly totalScenes: number;
  readonly completed: boolean;
  readonly lastReadTimestamp: number;
  readonly starsEarned: number;
};

export type StoryProgress = {
  readonly completedStoryIds: readonly string[];
  readonly storyProgressMap: Record<string, StoryBookmark>;
  readonly favoriteStoryIds: readonly string[];
  readonly lastReadStoryId?: string;
  readonly audioSettings: StoryAudioSettings;
  readonly totalStars: number;
};

export const DEFAULT_STORY_PROGRESS: StoryProgress = {
  completedStoryIds: [],
  storyProgressMap: {},
  favoriteStoryIds: [],
  audioSettings: {
    autoNarration: true,
    narrationSpeed: 0.38,
    readAlongHighlight: true,
  },
  totalStars: 0,
};
