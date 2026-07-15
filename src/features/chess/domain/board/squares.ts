/**
 * Chess board helpers for the kid learning board (not a full rules engine).
 */

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const; // row order top→bottom (white at bottom)

export type File = (typeof FILES)[number];
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Square = `${File}${Rank}`;

export type PieceLetter =
  | 'K'
  | 'Q'
  | 'R'
  | 'B'
  | 'N'
  | 'P'
  | 'k'
  | 'q'
  | 'r'
  | 'b'
  | 'n'
  | 'p';

export type PieceMap = Partial<Record<Square, PieceLetter>>;

export type HighlightTone = 'teach' | 'move' | 'capture' | 'success' | 'error';

export const PIECE_GLYPH: Record<PieceLetter, string> = {
  K: '♔',
  Q: '♕',
  R: '♖',
  B: '♗',
  N: '♘',
  P: '♙',
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

export function square(file: File, rank: Rank): Square {
  return `${file}${rank}` as Square;
}

export function parseSquare(value: string): Square | null {
  if (!/^[a-h][1-8]$/.test(value)) {
    return null;
  }
  return value as Square;
}

export function isLightSquare(sq: Square): boolean {
  const file = FILES.indexOf(sq[0] as File);
  const rank = Number(sq[1]);
  // a1 is dark with white at the bottom (standard orientation).
  return (file + rank) % 2 === 0;
}

export function emptyBoard(): PieceMap {
  return {};
}

/** Classic starting position — useful for board intro. */
export function startingPosition(): PieceMap {
  const pieces: PieceMap = {};
  const back: PieceLetter[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  const backBlack: PieceLetter[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  FILES.forEach((file, i) => {
    pieces[square(file, 1)] = back[i];
    pieces[square(file, 2)] = 'P';
    pieces[square(file, 7)] = 'p';
    pieces[square(file, 8)] = backBlack[i];
  });
  return pieces;
}

export function applyMove(
  pieces: PieceMap,
  from: Square,
  to: Square,
): PieceMap {
  const next = {...pieces};
  const piece = next[from];
  if (!piece) {
    return next;
  }
  delete next[from];
  next[to] = piece;
  return next;
}

export const HIGHLIGHT_COLORS: Record<HighlightTone, string> = {
  teach: '#2FA4A9AA',
  move: '#F5C84CAA',
  capture: '#E85D4CAA',
  success: '#3D9A5FAA',
  error: '#E85D4C88',
};
