import type {BrainGameId} from '../entities/BrainGame';
import type {BrainGamesProgress} from '../entities/GameProgress';

/**
 * Returns true if a given brain game should be available for play.
 * All brain games are unlocked.
 */
export function isGameUnlocked(
  _gameId: BrainGameId,
  _progress: BrainGamesProgress,
): boolean {
  return true;
}
