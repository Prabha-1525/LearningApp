import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_ANIMALS_PROGRESS,
  type AnimalLessonState,
  type AnimalsProgress,
  type AnimalSubModuleId,
} from '../../domain/entities/animalEntities';
import {ANIMALS_SUB_MODULES} from '../../domain/catalog/animalsData';

const ANIMALS_PROGRESS_KEY = StorageKeys.module('animals', 'progress');

export function readAnimalsProgress(): AnimalsProgress {
  try {
    const raw = mmkvStorage.getString(ANIMALS_PROGRESS_KEY);
    if (!raw) return DEFAULT_ANIMALS_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<AnimalsProgress>;
    return {
      ...DEFAULT_ANIMALS_PROGRESS,
      ...parsed,
      completedSubModules: parsed.completedSubModules ?? [],
      lessonsProgress: parsed.lessonsProgress ?? {},
      animalsLearned: parsed.animalsLearned ?? [],
      birdsLearned: parsed.birdsLearned ?? [],
      seaAnimalsLearned: parsed.seaAnimalsLearned ?? [],
      soundsMastered: parsed.soundsMastered ?? [],
      habitatsMastered: parsed.habitatsMastered ?? [],
      dietsMastered: parsed.dietsMastered ?? [],
      babiesMastered: parsed.babiesMastered ?? [],
      patternsSolved: parsed.patternsSolved ?? [],
      puzzlesSolved: parsed.puzzlesSolved ?? [],
      totalStars: parsed.totalStars ?? 0,
    };
  } catch {
    return DEFAULT_ANIMALS_PROGRESS;
  }
}

export function writeAnimalsProgress(progress: AnimalsProgress): void {
  try {
    mmkvStorage.setString(ANIMALS_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Non-critical MMKV write error
  }
}

export function resetAnimalsProgress(): AnimalsProgress {
  writeAnimalsProgress(DEFAULT_ANIMALS_PROGRESS);
  return DEFAULT_ANIMALS_PROGRESS;
}

export function recordAnimalLessonResult(
  subModuleId: AnimalSubModuleId,
  lessonId: string,
  stars: number,
  score: number,
  masteredItem?: string,
): {
  progress: AnimalsProgress;
  isNewUnlock: boolean;
} {
  const current = readAnimalsProgress();
  const existingLesson = current.lessonsProgress[lessonId] ?? {
    completed: false,
    stars: 0,
    score: 0,
    unlocked: true,
  };

  const updatedLesson: AnimalLessonState = {
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

  const updatedAnimalsLearned =
    subModuleId === 'land_animals' || subModuleId === 'meet_animals'
      ? updateList(current.animalsLearned, masteredItem)
      : current.animalsLearned;

  const updatedBirds =
    subModuleId === 'birds'
      ? updateList(current.birdsLearned, masteredItem)
      : current.birdsLearned;

  const updatedSeaAnimals =
    subModuleId === 'sea_animals'
      ? updateList(current.seaAnimalsLearned, masteredItem)
      : current.seaAnimalsLearned;

  const updatedSounds =
    subModuleId === 'animal_sounds'
      ? updateList(current.soundsMastered, masteredItem)
      : current.soundsMastered;

  const updatedHabitats =
    subModuleId === 'habitats'
      ? updateList(current.habitatsMastered, masteredItem)
      : current.habitatsMastered;

  const updatedDiets =
    subModuleId === 'animal_diets'
      ? updateList(current.dietsMastered, masteredItem)
      : current.dietsMastered;

  const updatedBabies =
    subModuleId === 'animal_babies'
      ? updateList(current.babiesMastered, masteredItem)
      : current.babiesMastered;

  const updatedPatterns =
    subModuleId === 'patterns'
      ? updateList(current.patternsSolved, masteredItem)
      : current.patternsSolved;

  const updatedPuzzles =
    subModuleId === 'puzzles'
      ? updateList(current.puzzlesSolved, masteredItem)
      : current.puzzlesSolved;

  const starDifference = Math.max(0, stars - existingLesson.stars);

  const updatedProgress: AnimalsProgress = {
    ...current,
    completedSubModules: updatedCompletedSubModules,
    lessonsProgress: {
      ...current.lessonsProgress,
      [lessonId]: updatedLesson,
    },
    animalsLearned: updatedAnimalsLearned,
    birdsLearned: updatedBirds,
    seaAnimalsLearned: updatedSeaAnimals,
    soundsMastered: updatedSounds,
    habitatsMastered: updatedHabitats,
    dietsMastered: updatedDiets,
    babiesMastered: updatedBabies,
    patternsSolved: updatedPatterns,
    puzzlesSolved: updatedPuzzles,
    totalStars: current.totalStars + starDifference,
  };

  writeAnimalsProgress(updatedProgress);

  const isNewUnlock = !current.completedSubModules.includes(subModuleId);

  return {
    progress: updatedProgress,
    isNewUnlock,
  };
}

export function isAnimalSubModuleUnlocked(
  subModuleId: AnimalSubModuleId,
  overrideProgress?: AnimalsProgress,
): boolean {
  // First submodule unlocked by default
  if (subModuleId === 'meet_animals') {
    return true;
  }

  const progress = overrideProgress ?? readAnimalsProgress();
  const subModuleIndex = ANIMALS_SUB_MODULES.findIndex(
    m => m.id === subModuleId,
  );
  if (subModuleIndex <= 0) return true;

  const previousSubModule = ANIMALS_SUB_MODULES[subModuleIndex - 1];
  if (!previousSubModule) return true;
  return progress.completedSubModules.includes(previousSubModule.id);
}

export function getAnimalsOverallProgress(
  customProgress?: AnimalsProgress | null,
): {
  percent: number;
  animalsCount: number;
  totalSubModules: number;
  completedCount: number;
} {
  const p = customProgress ?? readAnimalsProgress();
  const totalSubModules = ANIMALS_SUB_MODULES.length;
  const completedCount = p.completedSubModules.length;
  const percent = Math.min(
    100,
    Math.round((completedCount / totalSubModules) * 100),
  );

  return {
    percent,
    animalsCount:
      p.animalsLearned.length +
      p.birdsLearned.length +
      p.seaAnimalsLearned.length,
    totalSubModules,
    completedCount,
  };
}
