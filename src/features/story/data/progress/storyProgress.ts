import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_STORY_PROGRESS,
  type StoryAudioSettings,
  type StoryProgress,
} from '../../domain/entities/storyEntities';
import {STORIES_DATA} from '../../domain/catalog/storiesData';

const STORY_PROGRESS_KEY = StorageKeys.module('story', 'progress');

export function readStoryProgress(): StoryProgress {
  try {
    const raw = mmkvStorage.getString(STORY_PROGRESS_KEY);
    if (!raw) return DEFAULT_STORY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StoryProgress>;
    return {
      ...DEFAULT_STORY_PROGRESS,
      ...parsed,
      completedStoryIds: parsed.completedStoryIds ?? [],
      storyProgressMap: parsed.storyProgressMap ?? {},
      favoriteStoryIds: parsed.favoriteStoryIds ?? [],
      audioSettings: {
        ...DEFAULT_STORY_PROGRESS.audioSettings,
        ...(parsed.audioSettings ?? {}),
      },
      totalStars: parsed.totalStars ?? 0,
    };
  } catch {
    return DEFAULT_STORY_PROGRESS;
  }
}

export function writeStoryProgress(progress: StoryProgress): void {
  try {
    mmkvStorage.setString(STORY_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Non-critical MMKV write error
  }
}

export function resetStoryProgress(): StoryProgress {
  writeStoryProgress(DEFAULT_STORY_PROGRESS);
  return DEFAULT_STORY_PROGRESS;
}

export function saveStoryBookmark(
  storyId: string,
  sceneIndex: number,
  totalScenes: number,
): StoryProgress {
  const current = readStoryProgress();
  const existingBookmark = current.storyProgressMap[storyId];

  const updatedProgressMap = {
    ...current.storyProgressMap,
    [storyId]: {
      currentSceneIndex: sceneIndex,
      totalScenes,
      completed: existingBookmark?.completed ?? false,
      lastReadTimestamp: Date.now(),
      starsEarned: existingBookmark?.starsEarned ?? 0,
    },
  };

  const updated: StoryProgress = {
    ...current,
    lastReadStoryId: storyId,
    storyProgressMap: updatedProgressMap,
  };

  writeStoryProgress(updated);
  return updated;
}

export function markStoryCompleted(
  storyId: string,
  stars = 3,
): {
  progress: StoryProgress;
  isFirstCompletion: boolean;
} {
  const current = readStoryProgress();
  const isFirstCompletion = !current.completedStoryIds.includes(storyId);

  const updatedCompletedIds = isFirstCompletion
    ? [...current.completedStoryIds, storyId]
    : current.completedStoryIds;

  const existingBookmark = current.storyProgressMap[storyId];
  const storyDef = STORIES_DATA.find(s => s.id === storyId);
  const totalScenes =
    storyDef?.scenes.length ?? existingBookmark?.totalScenes ?? 1;

  const updatedProgressMap = {
    ...current.storyProgressMap,
    [storyId]: {
      currentSceneIndex: totalScenes - 1,
      totalScenes,
      completed: true,
      lastReadTimestamp: Date.now(),
      starsEarned: Math.max(existingBookmark?.starsEarned ?? 0, stars),
    },
  };

  const starIncrease = isFirstCompletion ? stars : 0;

  const updated: StoryProgress = {
    ...current,
    completedStoryIds: updatedCompletedIds,
    storyProgressMap: updatedProgressMap,
    totalStars: current.totalStars + starIncrease,
  };

  writeStoryProgress(updated);
  return {
    progress: updated,
    isFirstCompletion,
  };
}

export function toggleFavoriteStory(storyId: string): {
  progress: StoryProgress;
  isFavorite: boolean;
} {
  const current = readStoryProgress();
  const isFav = current.favoriteStoryIds.includes(storyId);

  const updatedFavorites = isFav
    ? current.favoriteStoryIds.filter(id => id !== storyId)
    : [...current.favoriteStoryIds, storyId];

  const updated: StoryProgress = {
    ...current,
    favoriteStoryIds: updatedFavorites,
  };

  writeStoryProgress(updated);
  return {
    progress: updated,
    isFavorite: !isFav,
  };
}

export function updateStoryAudioSettings(
  settings: Partial<StoryAudioSettings>,
): StoryProgress {
  const current = readStoryProgress();
  const updated: StoryProgress = {
    ...current,
    audioSettings: {
      ...current.audioSettings,
      ...settings,
    },
  };
  writeStoryProgress(updated);
  return updated;
}

export function getStoryOverallProgress(
  customProgress?: StoryProgress | null,
): {
  percent: number;
  completedStories: number;
  totalStories: number;
  totalStars: number;
} {
  const p = customProgress ?? readStoryProgress();
  const totalStories = STORIES_DATA.length;
  const completedStories = p.completedStoryIds.length;
  const percent = Math.min(
    100,
    Math.round((completedStories / Math.max(1, totalStories)) * 100),
  );

  return {
    percent,
    completedStories,
    totalStories,
    totalStars: p.totalStars,
  };
}
