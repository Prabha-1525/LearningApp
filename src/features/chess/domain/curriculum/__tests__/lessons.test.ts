import {isLightSquare, square} from '../../board/squares';
import {CHESS_LESSONS, getLesson, nextLessonId} from '../lessons';

describe('chess curriculum', () => {
  it('includes the twelve child-friendly lessons in order', () => {
    expect(CHESS_LESSONS.map(l => l.id)).toEqual([
      'pawn',
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
      'capture',
      'check',
      'checkmate',
      'castling',
      'mini-game',
      'full-game',
    ]);
  });

  it('has talk, demo, and practice steps for the pawn lesson', () => {
    const pawn = getLesson('pawn');
    expect(pawn.steps.some(s => Boolean(s.demo?.length))).toBe(true);
    expect(pawn.steps.some(s => s.kind === 'practice')).toBe(true);
    expect(pawn.steps.every(s => s.coachTa.length > 0)).toBe(true);
  });

  it('chains to the next lesson', () => {
    expect(nextLessonId('pawn')).toBe('rook');
    expect(nextLessonId('king')).toBe('capture');
    expect(nextLessonId('full-game')).toBeNull();
  });

  it('uses standard light/dark coloring', () => {
    expect(isLightSquare(square('a', 1))).toBe(false);
    expect(isLightSquare(square('h', 1))).toBe(true);
  });
});
