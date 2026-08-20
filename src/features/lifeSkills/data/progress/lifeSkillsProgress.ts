import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_LIFE_SKILLS_PROGRESS,
  type LifeSkillsProgress,
  type LifeSkillsTopicId,
  type TopicProgress,
} from '../../domain/entities/lifeSkillsEntities';

const PROGRESS_KEY = StorageKeys.module('lifeSkills', 'userProgress');

export function readLifeSkillsProgress(): LifeSkillsProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_LIFE_SKILLS_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<LifeSkillsProgress>;
    return {
      topicsProgress: {
        ...DEFAULT_LIFE_SKILLS_PROGRESS.topicsProgress,
        ...(parsed.topicsProgress ?? {}),
      },
      hygieneHabitsMastered:
        parsed.hygieneHabitsMastered ??
        DEFAULT_LIFE_SKILLS_PROGRESS.hygieneHabitsMastered,
      emotionsExplored:
        parsed.emotionsExplored ??
        DEFAULT_LIFE_SKILLS_PROGRESS.emotionsExplored,
      mannersScenariosSolved:
        parsed.mannersScenariosSolved ??
        DEFAULT_LIFE_SKILLS_PROGRESS.mannersScenariosSolved,
      routinesSequenced:
        parsed.routinesSequenced ??
        DEFAULT_LIFE_SKILLS_PROGRESS.routinesSequenced,
      totalStars: parsed.totalStars ?? DEFAULT_LIFE_SKILLS_PROGRESS.totalStars,
    };
  } catch {
    return DEFAULT_LIFE_SKILLS_PROGRESS;
  }
}

export function writeLifeSkillsProgress(progress: LifeSkillsProgress): void {
  try {
    mmkvStorage.set(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function recordLifeSkillsTopicCompletion(
  topicId: LifeSkillsTopicId,
  starsEarned: number,
): LifeSkillsProgress {
  const current = readLifeSkillsProgress();
  const prevTopic: TopicProgress = current.topicsProgress[topicId] ?? {
    completed: false,
    stars: 0,
  };

  const newStars = Math.max(prevTopic.stars, starsEarned);
  const updatedTopics: Record<LifeSkillsTopicId, TopicProgress> = {
    ...current.topicsProgress,
    [topicId]: {
      completed: true,
      stars: newStars,
    },
  };

  const allStars = Object.values(updatedTopics).reduce(
    (acc, val) => acc + val.stars,
    0,
  );

  const updated: LifeSkillsProgress = {
    ...current,
    topicsProgress: updatedTopics,
    totalStars: allStars,
  };

  writeLifeSkillsProgress(updated);
  return updated;
}

export function recordHygieneHabitMastered(): LifeSkillsProgress {
  const current = readLifeSkillsProgress();
  const updated: LifeSkillsProgress = {
    ...current,
    hygieneHabitsMastered: Math.min(6, current.hygieneHabitsMastered + 1),
  };
  writeLifeSkillsProgress(updated);
  return updated;
}

export function recordMannersScenarioSolved(): LifeSkillsProgress {
  const current = readLifeSkillsProgress();
  const updated: LifeSkillsProgress = {
    ...current,
    mannersScenariosSolved: current.mannersScenariosSolved + 1,
  };
  writeLifeSkillsProgress(updated);
  return updated;
}

export function recordRoutineSequenced(): LifeSkillsProgress {
  const current = readLifeSkillsProgress();
  const updated: LifeSkillsProgress = {
    ...current,
    routinesSequenced: current.routinesSequenced + 1,
  };
  writeLifeSkillsProgress(updated);
  return updated;
}
