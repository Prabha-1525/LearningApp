import {createMMKV} from 'react-native-mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_GK_PROGRESS,
  type GKCategoryId,
  type GKProgress,
} from '../../domain/entities/gkEntities';
import {GK_CATEGORIES} from '../../domain/catalog/gkData';

const storage = createMMKV({id: 'learningapp.gk'});

export function readGKProgress(): GKProgress {
  try {
    const raw = storage.getString(
      StorageKeys.module('generalKnowledge', 'progress'),
    );
    if (!raw) {
      return DEFAULT_GK_PROGRESS;
    }
    return JSON.parse(raw) as GKProgress;
  } catch {
    return DEFAULT_GK_PROGRESS;
  }
}

export function writeGKProgress(progress: GKProgress): void {
  storage.set(
    StorageKeys.module('generalKnowledge', 'progress'),
    JSON.stringify(progress),
  );
}

/**
 * Checks if a specific lesson is unlocked.
 * Lesson 1 (index 0 or orderIndex 1) is ALWAYS unlocked by default.
 * Subsequent lessons are unlocked if the prior lesson was completed with >= 2 stars or previously unlocked.
 */
export function isLessonUnlocked(
  categoryId: GKCategoryId,
  lessonId: string,
  progress: GKProgress,
): boolean {
  const category = GK_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return true;

  const lessonIndex = category.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex <= 0) return true; // First lesson in any category is always unlocked

  const lessonState = progress.lessonsProgress[lessonId];
  if (lessonState?.unlocked) return true;

  // Check if previous lesson was completed
  const prevLesson = category.lessons[lessonIndex - 1];
  if (!prevLesson) return true;

  const prevState = progress.lessonsProgress[prevLesson.id];
  return Boolean(prevState?.completed && prevState.stars >= 2);
}

/**
 * Records lesson completion and unlocks the next lesson in the category.
 */
export function recordGKLessonResult(
  categoryId: GKCategoryId,
  lessonId: string,
  starsEarned: number,
): {
  progress: GKProgress;
  nextLessonUnlockedId: string | null;
  categoryCompleted: boolean;
} {
  const current = readGKProgress();
  const category = GK_CATEGORIES.find(c => c.id === categoryId);
  const lessonsProgress = {...current.lessonsProgress};

  const oldStars = lessonsProgress[lessonId]?.stars ?? 0;
  const newStars = Math.max(oldStars, starsEarned);
  const isPassed = starsEarned >= 2;

  lessonsProgress[lessonId] = {
    completed: isPassed || Boolean(lessonsProgress[lessonId]?.completed),
    stars: newStars,
    unlocked: true,
  };

  let nextLessonUnlockedId: string | null = null;
  let categoryCompleted = false;

  if (category) {
    const lessonIdx = category.lessons.findIndex(l => l.id === lessonId);
    if (isPassed && lessonIdx >= 0 && lessonIdx < category.lessons.length - 1) {
      const nextLesson = category.lessons[lessonIdx + 1];
      nextLessonUnlockedId = nextLesson.id;
      lessonsProgress[nextLesson.id] = {
        completed: Boolean(lessonsProgress[nextLesson.id]?.completed),
        stars: lessonsProgress[nextLesson.id]?.stars ?? 0,
        unlocked: true,
      };
    }

    // Check if whole category is completed
    const allDone = category.lessons.every(
      l => lessonsProgress[l.id]?.completed,
    );
    if (allDone && !current.completedCategories.includes(categoryId)) {
      categoryCompleted = true;
    }
  }

  // Recalculate total stars
  const totalStars = Object.values(lessonsProgress).reduce(
    (acc, val) => acc + (val.stars || 0),
    0,
  );

  const completedCategories = [...current.completedCategories];
  if (categoryCompleted && !completedCategories.includes(categoryId)) {
    completedCategories.push(categoryId);
  }

  const updated: GKProgress = {
    ...current,
    lessonsProgress,
    completedCategories,
    totalStars,
  };

  writeGKProgress(updated);

  return {
    progress: updated,
    nextLessonUnlockedId,
    categoryCompleted,
  };
}

export function recordGrandChallengeScore(score: number): GKProgress {
  const current = readGKProgress();
  const updated: GKProgress = {
    ...current,
    challengeScore: Math.max(current.challengeScore, score),
  };
  writeGKProgress(updated);
  return updated;
}
