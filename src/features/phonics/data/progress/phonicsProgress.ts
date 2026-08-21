import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_PHONICS_PROGRESS,
  type PhonicsProgress,
  type PhonicsSubModuleId,
} from '../../domain/entities/phonicsEntities';
import {PHONICS_SUBMODULES} from '../../domain/catalog/phonicsData';

const PHONICS_PROGRESS_KEY = StorageKeys.module('phonics', 'progress');

export function readPhonicsProgress(): PhonicsProgress {
  try {
    const raw = mmkvStorage.getString(PHONICS_PROGRESS_KEY);
    if (!raw) return DEFAULT_PHONICS_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PhonicsProgress>;
    return {
      ...DEFAULT_PHONICS_PROGRESS,
      ...parsed,
      unlockedSubModuleIds: parsed.unlockedSubModuleIds ?? ['letter_sounds'],
      completedSubModuleIds: parsed.completedSubModuleIds ?? [],
      subModuleProgress: parsed.subModuleProgress ?? {},
      totalStars: parsed.totalStars ?? 0,
      lettersLearnedCount: parsed.lettersLearnedCount ?? 0,
      cvcWordsLearnedCount: parsed.cvcWordsLearnedCount ?? 0,
      wordFamiliesCompletedCount: parsed.wordFamiliesCompletedCount ?? 0,
      sentencesReadCount: parsed.sentencesReadCount ?? 0,
    };
  } catch {
    return DEFAULT_PHONICS_PROGRESS;
  }
}

export function writePhonicsProgress(progress: PhonicsProgress): void {
  try {
    mmkvStorage.setString(PHONICS_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Non-critical MMKV write error
  }
}

export function resetPhonicsProgress(): PhonicsProgress {
  writePhonicsProgress(DEFAULT_PHONICS_PROGRESS);
  return DEFAULT_PHONICS_PROGRESS;
}

export function recordPhonicsLessonResult(
  subModuleId: PhonicsSubModuleId,
  scorePercent: number,
  starsEarned: number,
): {
  progress: PhonicsProgress;
  isFirstCompletion: boolean;
  unlockedNextId?: PhonicsSubModuleId;
} {
  const current = readPhonicsProgress();
  const isFirstCompletion =
    !current.completedSubModuleIds.includes(subModuleId);

  const updatedCompletedIds = isFirstCompletion
    ? [...current.completedSubModuleIds, subModuleId]
    : current.completedSubModuleIds;

  // Find next submodule in order to unlock
  const currentIndex = PHONICS_SUBMODULES.findIndex(s => s.id === subModuleId);
  const nextSubModule =
    currentIndex >= 0 && currentIndex < PHONICS_SUBMODULES.length - 1
      ? PHONICS_SUBMODULES[currentIndex + 1]
      : null;

  const nextId = nextSubModule?.id;
  let unlockedNextId: PhonicsSubModuleId | undefined;

  const updatedUnlockedIds = [...current.unlockedSubModuleIds];
  if (nextId && !updatedUnlockedIds.includes(nextId)) {
    updatedUnlockedIds.push(nextId);
    unlockedNextId = nextId;
  }

  const existingSubProgress = current.subModuleProgress[subModuleId];
  const updatedSubProgressMap = {
    ...current.subModuleProgress,
    [subModuleId]: {
      completed: true,
      stars: Math.max(existingSubProgress?.stars ?? 0, starsEarned),
      scorePercent: Math.max(
        existingSubProgress?.scorePercent ?? 0,
        scorePercent,
      ),
      attempts: (existingSubProgress?.attempts ?? 0) + 1,
      lastPlayedTimestamp: Date.now(),
    },
  };

  const starIncrease = isFirstCompletion ? starsEarned : 0;

  const updated: PhonicsProgress = {
    ...current,
    unlockedSubModuleIds: updatedUnlockedIds,
    completedSubModuleIds: updatedCompletedIds,
    subModuleProgress: updatedSubProgressMap,
    totalStars: current.totalStars + starIncrease,
    lastPlayedSubModuleId: subModuleId,
    lettersLearnedCount:
      subModuleId === 'letter_sounds' ? 26 : current.lettersLearnedCount,
    cvcWordsLearnedCount:
      subModuleId === 'cvc_words' || subModuleId === 'read_words'
        ? Math.max(current.cvcWordsLearnedCount, 15)
        : current.cvcWordsLearnedCount,
    wordFamiliesCompletedCount:
      subModuleId === 'word_families'
        ? Math.max(current.wordFamiliesCompletedCount, 8)
        : current.wordFamiliesCompletedCount,
    sentencesReadCount:
      subModuleId === 'read_sentences'
        ? Math.max(current.sentencesReadCount, 8)
        : current.sentencesReadCount,
  };

  writePhonicsProgress(updated);

  return {
    progress: updated,
    isFirstCompletion,
    unlockedNextId,
  };
}

export function getPhonicsOverallProgress(
  customProgress?: PhonicsProgress | null,
): {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  totalStars: number;
} {
  const p = customProgress ?? readPhonicsProgress();
  const totalLessons = PHONICS_SUBMODULES.length;
  const completedLessons = p.completedSubModuleIds.length;
  const percent = Math.min(
    100,
    Math.round((completedLessons / Math.max(1, totalLessons)) * 100),
  );

  return {
    percent,
    completedLessons,
    totalLessons,
    totalStars: p.totalStars,
  };
}
