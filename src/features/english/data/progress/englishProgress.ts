import {createMMKV} from 'react-native-mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_ENGLISH_PROGRESS,
  type EnglishProgress,
  type EnglishSubModuleId,
} from '../../domain/entities/englishEntities';
import {ENGLISH_SUB_MODULES} from '../../domain/catalog/englishData';

const storage = createMMKV({id: 'learningapp.english'});

export function readEnglishProgress(): EnglishProgress {
  try {
    const raw = storage.getString(StorageKeys.module('english', 'progress'));
    if (!raw) {
      return DEFAULT_ENGLISH_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<EnglishProgress>;
    return {
      completedSubModules: parsed.completedSubModules ?? [],
      lessonsProgress:
        parsed.lessonsProgress ?? DEFAULT_ENGLISH_PROGRESS.lessonsProgress,
      totalStars: parsed.totalStars ?? 0,
      wordsMastered: parsed.wordsMastered ?? [],
      sightWordsMastered: parsed.sightWordsMastered ?? [],
      storiesCompleted: parsed.storiesCompleted ?? [],
      readingChallengeScore: parsed.readingChallengeScore ?? 0,
      readingChallengePassed: parsed.readingChallengePassed ?? false,
    };
  } catch {
    return DEFAULT_ENGLISH_PROGRESS;
  }
}

export function writeEnglishProgress(progress: EnglishProgress): void {
  storage.set(
    StorageKeys.module('english', 'progress'),
    JSON.stringify(progress),
  );
}

/**
 * Checks whether a sub-module is unlocked in the sequential journey:
 * 1. Alphabet (unlocked by default)
 * 2. Capital & Small Letters (unlocked by default or after Alphabet)
 * Subsequent sub-modules unlock when previous sub-module is completed or has >= 2 stars.
 */
export function isSubModuleUnlocked(
  subModuleId: EnglishSubModuleId,
  progress: EnglishProgress,
): boolean {
  const index = ENGLISH_SUB_MODULES.findIndex(sm => sm.id === subModuleId);
  if (index <= 1) {
    return true; // Alphabet and Capital/Small are available from start
  }

  // Check if already registered as completed
  if (progress.completedSubModules.includes(subModuleId)) {
    return true;
  }

  // Otherwise check if previous sub-module is completed
  const prevSubModule = ENGLISH_SUB_MODULES[index - 1];
  if (!prevSubModule) {
    return true;
  }

  return progress.completedSubModules.includes(prevSubModule.id);
}

export function isLessonUnlocked(
  lessonId: string,
  progress: EnglishProgress,
): boolean {
  const state = progress.lessonsProgress[lessonId];
  if (state?.unlocked) return true;
  if (lessonId.endsWith('_intro') || lessonId.endsWith('_1')) return true;
  return false;
}

export function recordEnglishLessonResult(
  subModuleId: EnglishSubModuleId,
  lessonId: string,
  starsEarned: number,
  score: number,
  masteredWord?: string,
): {
  progress: EnglishProgress;
  subModuleCompleted: boolean;
  isNewBadgeEligible: boolean;
} {
  const current = readEnglishProgress();
  const lessonsProgress = {...current.lessonsProgress};

  const oldStars = lessonsProgress[lessonId]?.stars ?? 0;
  const newStars = Math.max(oldStars, starsEarned);
  const isPassed = starsEarned >= 1;

  lessonsProgress[lessonId] = {
    completed: isPassed || Boolean(lessonsProgress[lessonId]?.completed),
    stars: newStars,
    score: Math.max(lessonsProgress[lessonId]?.score ?? 0, score),
    unlocked: true,
  };

  const completedSubModules = [...current.completedSubModules];
  let subModuleCompleted = false;

  if (isPassed && !completedSubModules.includes(subModuleId)) {
    completedSubModules.push(subModuleId);
    subModuleCompleted = true;
  }

  const wordsMastered = [...current.wordsMastered];
  if (masteredWord && !wordsMastered.includes(masteredWord)) {
    wordsMastered.push(masteredWord);
  }

  const totalStars = Object.values(lessonsProgress).reduce(
    (acc, val) => acc + (val.stars || 0),
    0,
  );

  const updated: EnglishProgress = {
    ...current,
    lessonsProgress,
    completedSubModules,
    wordsMastered,
    totalStars,
  };

  writeEnglishProgress(updated);

  return {
    progress: updated,
    subModuleCompleted,
    isNewBadgeEligible: isPassed,
  };
}

export function recordReadingChallengeScore(score: number): EnglishProgress {
  const current = readEnglishProgress();
  const passed = score >= 3;
  const updated: EnglishProgress = {
    ...current,
    readingChallengeScore: Math.max(current.readingChallengeScore, score),
    readingChallengePassed: current.readingChallengePassed || passed,
    totalStars: current.totalStars + (passed ? 3 : 1),
  };
  writeEnglishProgress(updated);
  return updated;
}

export function getEnglishOverallProgress(
  progress?: Partial<EnglishProgress> | null,
): {
  readonly percent: number;
  readonly alphabetDone: boolean;
  readonly soundsDone: boolean;
  readonly phonicsDone: boolean;
  readonly cvcDone: boolean;
  readonly sentencesDone: boolean;
  readonly storiesDone: boolean;
} {
  const completed = progress?.completedSubModules ?? [];
  const completedCount = completed.length;
  const total = ENGLISH_SUB_MODULES.length;
  const percent = Math.min(100, Math.round((completedCount / total) * 100));

  return {
    percent,
    alphabetDone: completed.includes('alphabet'),
    soundsDone: completed.includes('letter_sounds'),
    phonicsDone: completed.includes('phonics'),
    cvcDone: completed.includes('cvc_words'),
    sentencesDone: completed.includes('sentence_reading'),
    storiesDone: completed.includes('short_stories'),
  };
}
