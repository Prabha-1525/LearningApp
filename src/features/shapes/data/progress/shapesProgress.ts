import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_SHAPES_PROGRESS,
  type ShapeLessonState,
  type ShapesProgress,
  type ShapeSubModuleId,
} from '../../domain/entities/shapeEntities';
import {SHAPES_SUB_MODULES} from '../../domain/catalog/shapesData';

const SHAPES_PROGRESS_KEY = StorageKeys.module('shapes', 'progress');

export function readShapesProgress(): ShapesProgress {
  try {
    const raw = mmkvStorage.getString(SHAPES_PROGRESS_KEY);
    if (!raw) return DEFAULT_SHAPES_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ShapesProgress>;
    return {
      ...DEFAULT_SHAPES_PROGRESS,
      ...parsed,
      completedSubModules: parsed.completedSubModules ?? [],
      lessonsProgress: parsed.lessonsProgress ?? {},
      shapesLearned: parsed.shapesLearned ?? [],
      recognitionMastered: parsed.recognitionMastered ?? [],
      matchingDone: parsed.matchingDone ?? [],
      propertiesKnown: parsed.propertiesKnown ?? [],
      sortingDone: parsed.sortingDone ?? [],
      patternsSolved: parsed.patternsSolved ?? [],
      puzzlesSolved: parsed.puzzlesSolved ?? [],
      totalStars: parsed.totalStars ?? 0,
    };
  } catch {
    return DEFAULT_SHAPES_PROGRESS;
  }
}

export function writeShapesProgress(progress: ShapesProgress): void {
  try {
    mmkvStorage.setString(SHAPES_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Non-critical MMKV write error
  }
}

export function recordShapeLessonResult(
  subModuleId: ShapeSubModuleId,
  lessonId: string,
  stars: number,
  score: number,
  masteredItem?: string,
): {
  progress: ShapesProgress;
  isNewUnlock: boolean;
} {
  const current = readShapesProgress();
  const existingLesson = current.lessonsProgress[lessonId] ?? {
    completed: false,
    stars: 0,
    score: 0,
    unlocked: true,
  };

  const updatedLesson: ShapeLessonState = {
    completed: true,
    stars: Math.max(existingLesson.stars, stars),
    score: Math.max(existingLesson.score, score),
    unlocked: true,
  };

  const updatedCompletedSubModules = current.completedSubModules.includes(
    subModuleId,
  )
    ? current.completedSubModules
    : [...current.completedSubModules, subModuleId];

  const updateList = (list: readonly string[], item?: string) => {
    if (!item || list.includes(item)) return list;
    return [...list, item];
  };

  const updatedShapesLearned =
    subModuleId === 'learn_shapes'
      ? updateList(current.shapesLearned, masteredItem)
      : current.shapesLearned;

  const updatedRecognition =
    subModuleId === 'recognition'
      ? updateList(current.recognitionMastered, masteredItem)
      : current.recognitionMastered;

  const updatedMatching =
    subModuleId === 'matching'
      ? updateList(current.matchingDone, masteredItem)
      : current.matchingDone;

  const updatedProperties =
    subModuleId === 'properties'
      ? updateList(current.propertiesKnown, masteredItem)
      : current.propertiesKnown;

  const updatedSorting =
    subModuleId === 'sorting'
      ? updateList(current.sortingDone, masteredItem)
      : current.sortingDone;

  const updatedPatterns =
    subModuleId === 'patterns'
      ? updateList(current.patternsSolved, masteredItem)
      : current.patternsSolved;

  const updatedPuzzles =
    subModuleId === 'puzzles'
      ? updateList(current.puzzlesSolved, masteredItem)
      : current.puzzlesSolved;

  const starDifference = Math.max(0, stars - existingLesson.stars);

  const updatedProgress: ShapesProgress = {
    ...current,
    completedSubModules: updatedCompletedSubModules,
    lessonsProgress: {
      ...current.lessonsProgress,
      [lessonId]: updatedLesson,
    },
    shapesLearned: updatedShapesLearned,
    recognitionMastered: updatedRecognition,
    matchingDone: updatedMatching,
    propertiesKnown: updatedProperties,
    sortingDone: updatedSorting,
    patternsSolved: updatedPatterns,
    puzzlesSolved: updatedPuzzles,
    totalStars: current.totalStars + starDifference,
  };

  writeShapesProgress(updatedProgress);

  const isNewUnlock = !current.completedSubModules.includes(subModuleId);

  return {
    progress: updatedProgress,
    isNewUnlock,
  };
}

export function isShapeSubModuleUnlocked(
  subModuleId: ShapeSubModuleId,
  overrideProgress?: ShapesProgress,
): boolean {
  // First 3 submodules are unlocked by default for instant engagement
  if (
    subModuleId === 'learn_shapes' ||
    subModuleId === 'recognition' ||
    subModuleId === 'matching'
  ) {
    return true;
  }

  const progress = overrideProgress ?? readShapesProgress();
  const subModuleIndex = SHAPES_SUB_MODULES.findIndex(
    m => m.id === subModuleId,
  );
  if (subModuleIndex <= 0) return true;

  const previousSubModule = SHAPES_SUB_MODULES[subModuleIndex - 1];
  if (!previousSubModule) return true;
  return progress.completedSubModules.includes(previousSubModule.id);
}

export function getShapesOverallProgress(
  customProgress?: ShapesProgress | null,
): {
  percent: number;
  shapesCount: number;
  totalSubModules: number;
  completedCount: number;
} {
  const p = customProgress ?? readShapesProgress();
  const totalSubModules = SHAPES_SUB_MODULES.length;
  const completedCount = p.completedSubModules.length;
  const percent = Math.min(
    100,
    Math.round((completedCount / totalSubModules) * 100),
  );

  return {
    percent,
    shapesCount: p.shapesLearned.length,
    totalSubModules,
    completedCount,
  };
}
