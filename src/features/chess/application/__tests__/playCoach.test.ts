import {Chess} from 'chess.js';

import {chooseCoachMove, suggestChildMove} from '../beginnerCoachAi';
import {createGame, applyMove, boardToPieceMap} from '../chessEngine';

describe('chessEngine', () => {
  it('starts with a full board', () => {
    const game = createGame();
    const pieces = boardToPieceMap(game);
    expect(pieces.e2).toBe('P');
    expect(pieces.e7).toBe('p');
    expect(pieces.e1).toBe('K');
  });

  it('applies a legal pawn move', () => {
    const game = createGame();
    const move = applyMove(game, 'e2', 'e4');
    expect(move?.san).toBe('e4');
    expect(game.fen()).toContain('4P3');
  });
});

describe('beginnerCoachAi', () => {
  it('chooses a legal coach move for black', () => {
    const game = createGame();
    applyMove(game, 'e2', 'e4');
    const plan = chooseCoachMove(game, 1);
    expect(plan).not.toBeNull();
    expect(plan?.move.from.length).toBe(2);
    expect(plan?.explainTa.length).toBeGreaterThan(5);
  });

  it('suggests a child move', () => {
    const game = new Chess();
    const tip = suggestChildMove(game);
    expect(tip?.from).toBeTruthy();
    expect(tip?.to).toBeTruthy();
  });
});
