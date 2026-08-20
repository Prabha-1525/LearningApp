import type {ScienceTopicId} from '../entities/ScienceTopic';
import type {ScienceProgress} from '../entities/ScienceProgress';

/**
 * Returns true if a given science topic is unlocked.
 * All science topics are unlocked for exploration.
 */
export function isScienceTopicUnlocked(
  _topicId: ScienceTopicId,
  _progress: ScienceProgress,
): boolean {
  return true;
}
