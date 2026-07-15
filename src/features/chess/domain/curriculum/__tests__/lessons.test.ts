import {isLightSquare, square} from '../../board/squares';
import {CHESS_LESSONS, getLesson, nextLessonId} from '../lessons';

describe('chess curriculum', () => {
  it('includes the seven beginner lessons in order', () => {
    expect(CHESS_LESSONS.map(l => l.id)).toEqual([
      'board',
      'pawn',
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
    ]);
  });

  it('has talk, demo, and practice steps for the pawn lesson', () => {
    const pawn = getLesson('pawn');
    expect(pawn.steps.some(s => s.kind === 'demo')).toBe(true);
    expect(pawn.steps.some(s => s.kind === 'practice')).toBe(true);
    expect(pawn.steps.every(s => s.coachTa.length > 0)).toBe(true);
  });

  it('chains to the next lesson', () => {
    expect(nextLessonId('board')).toBe('pawn');
    expect(nextLessonId('king')).toBeNull();
  });

  it('uses standard light/dark coloring', () => {
    expect(isLightSquare(square('a', 1))).toBe(false);
    expect(isLightSquare(square('h', 1))).toBe(true);
  });
});
