import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';
import {
  DEFAULT_MUSIC_PROGRESS,
  type MusicProgress,
  type MusicTopicId,
  type TopicProgress,
} from '../../domain/entities/musicEntities';

const PROGRESS_KEY = StorageKeys.module('rhymes', 'userProgress');

export function readMusicProgress(): MusicProgress {
  try {
    const raw = mmkvStorage.getString(PROGRESS_KEY);
    if (!raw) {
      return DEFAULT_MUSIC_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<MusicProgress>;
    return {
      topicsProgress: {
        ...DEFAULT_MUSIC_PROGRESS.topicsProgress,
        ...(parsed.topicsProgress ?? {}),
      },
      instrumentsExplored:
        parsed.instrumentsExplored ??
        DEFAULT_MUSIC_PROGRESS.instrumentsExplored,
      rhythmLevelsCompleted:
        parsed.rhythmLevelsCompleted ??
        DEFAULT_MUSIC_PROGRESS.rhythmLevelsCompleted,
      soundGuessesCorrect:
        parsed.soundGuessesCorrect ??
        DEFAULT_MUSIC_PROGRESS.soundGuessesCorrect,
      totalStars: parsed.totalStars ?? DEFAULT_MUSIC_PROGRESS.totalStars,
    };
  } catch {
    return DEFAULT_MUSIC_PROGRESS;
  }
}

export function writeMusicProgress(progress: MusicProgress): void {
  try {
    mmkvStorage.set(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function recordMusicTopicCompletion(
  topicId: MusicTopicId,
  starsEarned: number,
): MusicProgress {
  const current = readMusicProgress();
  const prevTopic: TopicProgress = current.topicsProgress[topicId] ?? {
    completed: false,
    stars: 0,
  };

  const newStars = Math.max(prevTopic.stars, starsEarned);
  const updatedTopics: Record<MusicTopicId, TopicProgress> = {
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

  const updated: MusicProgress = {
    ...current,
    topicsProgress: updatedTopics,
    totalStars: allStars,
  };

  writeMusicProgress(updated);
  return updated;
}

export function recordInstrumentExplored(): MusicProgress {
  const current = readMusicProgress();
  const updated: MusicProgress = {
    ...current,
    instrumentsExplored: Math.min(6, current.instrumentsExplored + 1),
  };
  writeMusicProgress(updated);
  return updated;
}

export function recordRhythmLevelCompleted(
  _levelNumber: number,
  stars: number,
): MusicProgress {
  const current = readMusicProgress();
  const updated: MusicProgress = {
    ...current,
    rhythmLevelsCompleted: current.rhythmLevelsCompleted + 1,
    totalStars: current.totalStars + stars,
  };
  writeMusicProgress(updated);
  return updated;
}

export function recordSoundGuessCorrect(): MusicProgress {
  const current = readMusicProgress();
  const updated: MusicProgress = {
    ...current,
    soundGuessesCorrect: current.soundGuessesCorrect + 1,
  };
  writeMusicProgress(updated);
  return updated;
}
