import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_DRAWING_PROGRESS,
  type DrawingProgress,
  type DrawingSubModuleId,
  type GalleryArtwork,
} from '../../domain/entities/drawingEntities';
import {DRAWING_SUB_MODULES} from '../../domain/catalog/drawingData';

const DRAWING_PROGRESS_KEY = StorageKeys.module('drawing', 'progress');
const DRAWING_GALLERY_KEY = StorageKeys.module('drawing', 'gallery');

export function readDrawingProgress(): DrawingProgress {
  try {
    const raw = mmkvStorage.getString(DRAWING_PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_DRAWING_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<DrawingProgress>;
    return {
      completedSubModules:
        parsed.completedSubModules ??
        DEFAULT_DRAWING_PROGRESS.completedSubModules,
      lessonsProgress:
        parsed.lessonsProgress ?? DEFAULT_DRAWING_PROGRESS.lessonsProgress,
      colorsLearned:
        parsed.colorsLearned ?? DEFAULT_DRAWING_PROGRESS.colorsLearned,
      objectsColored:
        parsed.objectsColored ?? DEFAULT_DRAWING_PROGRESS.objectsColored,
      shapesMastered:
        parsed.shapesMastered ?? DEFAULT_DRAWING_PROGRESS.shapesMastered,
      guidedDrawingsCompleted:
        parsed.guidedDrawingsCompleted ??
        DEFAULT_DRAWING_PROGRESS.guidedDrawingsCompleted,
      challengesCompleted:
        parsed.challengesCompleted ??
        DEFAULT_DRAWING_PROGRESS.challengesCompleted,
      totalStars: parsed.totalStars ?? DEFAULT_DRAWING_PROGRESS.totalStars,
      savedGalleryCount:
        parsed.savedGalleryCount ?? DEFAULT_DRAWING_PROGRESS.savedGalleryCount,
    };
  } catch {
    return DEFAULT_DRAWING_PROGRESS;
  }
}

export function writeDrawingProgress(progress: DrawingProgress): void {
  try {
    mmkvStorage.setString(DRAWING_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Fallback gracefully
  }
}

export function readGalleryArtworks(): readonly GalleryArtwork[] {
  try {
    const raw = mmkvStorage.getString(DRAWING_GALLERY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGalleryArtwork(artwork: GalleryArtwork): void {
  try {
    const current = readGalleryArtworks();
    const existingIdx = current.findIndex(a => a.id === artwork.id);
    let updated: GalleryArtwork[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = artwork;
    } else {
      updated = [artwork, ...current];
    }
    mmkvStorage.setString(DRAWING_GALLERY_KEY, JSON.stringify(updated));

    // Update gallery count in main progress
    const progress = readDrawingProgress();
    writeDrawingProgress({
      ...progress,
      savedGalleryCount: updated.length,
    });
  } catch {
    // Non-fatal
  }
}

export function toggleFavoriteArtwork(artworkId: string): boolean {
  try {
    const current = readGalleryArtworks();
    let newFavState = false;
    const updated = current.map(art => {
      if (art.id === artworkId) {
        newFavState = !art.isFavorite;
        return {...art, isFavorite: newFavState};
      }
      return art;
    });
    mmkvStorage.setString(DRAWING_GALLERY_KEY, JSON.stringify(updated));
    return newFavState;
  } catch {
    return false;
  }
}

export function deleteGalleryArtwork(artworkId: string): void {
  try {
    const current = readGalleryArtworks();
    const updated = current.filter(a => a.id !== artworkId);
    mmkvStorage.setString(DRAWING_GALLERY_KEY, JSON.stringify(updated));

    const progress = readDrawingProgress();
    writeDrawingProgress({
      ...progress,
      savedGalleryCount: updated.length,
    });
  } catch {
    // Non-fatal
  }
}

export function isDrawingSubModuleUnlocked(
  subModuleId: DrawingSubModuleId,
  progress: DrawingProgress = readDrawingProgress(),
): boolean {
  // First 2 submodules (colors and color_match) are unlocked by default
  if (
    subModuleId === 'colors' ||
    subModuleId === 'color_match' ||
    subModuleId === 'coloring'
  ) {
    return true;
  }

  const subModuleIndex = DRAWING_SUB_MODULES.findIndex(
    m => m.id === subModuleId,
  );
  if (subModuleIndex <= 0) return true;

  const previousSubModule = DRAWING_SUB_MODULES[subModuleIndex - 1];
  if (!previousSubModule) return true;
  return progress.completedSubModules.includes(previousSubModule.id);
}

export function recordDrawingLessonResult(
  subModuleId: DrawingSubModuleId,
  lessonId: string,
  stars: number,
  score: number,
  masteredItem?: string,
): {
  readonly isNewUnlock: boolean;
  readonly progress: DrawingProgress;
} {
  const current = readDrawingProgress();
  const prevLesson = current.lessonsProgress[lessonId];
  const oldStars = prevLesson?.stars ?? 0;
  const starDiff = Math.max(0, stars - oldStars);

  const completedSubs = new Set(current.completedSubModules);
  completedSubs.add(subModuleId);

  const colorsLearned = new Set(current.colorsLearned);
  const objectsColored = new Set(current.objectsColored);
  const shapesMastered = new Set(current.shapesMastered);
  const guidedDrawings = new Set(current.guidedDrawingsCompleted);
  const challenges = new Set(current.challengesCompleted);

  if (masteredItem) {
    if (subModuleId === 'colors') colorsLearned.add(masteredItem);
    if (subModuleId === 'coloring') objectsColored.add(masteredItem);
    if (subModuleId === 'shapes') shapesMastered.add(masteredItem);
    if (subModuleId === 'guided_drawing') guidedDrawings.add(masteredItem);
    if (subModuleId === 'creative_challenge') challenges.add(masteredItem);
  }

  const updated: DrawingProgress = {
    ...current,
    completedSubModules: Array.from(completedSubs),
    lessonsProgress: {
      ...current.lessonsProgress,
      [lessonId]: {
        completed: true,
        stars: Math.max(oldStars, stars),
        score: Math.max(prevLesson?.score ?? 0, score),
        unlocked: true,
      },
    },
    totalStars: current.totalStars + starDiff,
    colorsLearned: Array.from(colorsLearned),
    objectsColored: Array.from(objectsColored),
    shapesMastered: Array.from(shapesMastered),
    guidedDrawingsCompleted: Array.from(guidedDrawings),
    challengesCompleted: Array.from(challenges),
  };

  writeDrawingProgress(updated);

  return {
    isNewUnlock: !current.completedSubModules.includes(subModuleId),
    progress: updated,
  };
}

export function getDrawingOverallProgress(
  progress?: Partial<DrawingProgress> | null,
): {
  readonly percent: number;
  readonly colorsDone: boolean;
  readonly coloringDone: boolean;
  readonly drawingDone: boolean;
  readonly challengesDone: boolean;
  readonly totalStars: number;
} {
  const completed = progress?.completedSubModules ?? [];
  const completedCount = completed.length;
  const total = DRAWING_SUB_MODULES.length;
  const percent = Math.min(100, Math.round((completedCount / total) * 100));

  return {
    percent,
    colorsDone: completed.includes('colors') && completed.includes('color_mix'),
    coloringDone: completed.includes('coloring'),
    drawingDone:
      completed.includes('shapes') || completed.includes('guided_drawing'),
    challengesDone: completed.includes('creative_challenge'),
    totalStars: progress?.totalStars ?? 0,
  };
}
