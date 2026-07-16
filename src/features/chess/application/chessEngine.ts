import {Chess, type Square as ChessSquare} from 'chess.js';

import {
  type PieceLetter,
  type PieceMap,
  type Square,
  parseSquare,
} from '../domain/board/squares';

const PIECE_CODE: Record<string, PieceLetter> = {
  wK: 'K',
  wQ: 'Q',
  wR: 'R',
  wB: 'B',
  wN: 'N',
  wP: 'P',
  bK: 'k',
  bQ: 'q',
  bR: 'r',
  bB: 'b',
  bN: 'n',
  bP: 'p',
};

export type EngineMove = {
  readonly from: Square;
  readonly to: Square;
  readonly san: string;
  readonly piece: string;
  readonly captured?: string;
  readonly isCapture: boolean;
  readonly isCheck: boolean;
  readonly isCheckmate: boolean;
  readonly isPromotion: boolean;
};

export function createGame(fen?: string): Chess {
  return fen ? new Chess(fen) : new Chess();
}

export function boardToPieceMap(game: Chess): PieceMap {
  const map: PieceMap = {};
  const board = game.board();
  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
      const cell = board[rankIndex]?.[fileIndex];
      if (!cell) {
        continue;
      }
      const file = 'abcdefgh'[fileIndex];
      const rank = 8 - rankIndex;
      const sq = parseSquare(`${file}${rank}`);
      if (!sq) {
        continue;
      }
      const code = `${cell.color}${cell.type.toUpperCase()}`;
      map[sq] = PIECE_CODE[code] ?? (cell.color === 'w' ? 'P' : 'p');
    }
  }
  return map;
}

export function legalMovesFrom(game: Chess, from: Square): Square[] {
  return game
    .moves({square: from as ChessSquare, verbose: true})
    .map(move => move.to as Square);
}

export function allLegalMoves(game: Chess): EngineMove[] {
  return game.moves({verbose: true}).map(move => ({
    from: move.from as Square,
    to: move.to as Square,
    san: move.san,
    piece: move.piece,
    captured: move.captured,
    isCapture: Boolean(move.captured),
    isCheck: move.san.includes('+'),
    isCheckmate: move.san.includes('#'),
    isPromotion: Boolean(move.promotion),
  }));
}

export function applyMove(
  game: Chess,
  from: Square,
  to: Square,
): EngineMove | null {
  try {
    const move = game.move({
      from: from as ChessSquare,
      to: to as ChessSquare,
      promotion: 'q',
    });
    if (!move) {
      return null;
    }
    return {
      from: move.from as Square,
      to: move.to as Square,
      san: move.san,
      piece: move.piece,
      captured: move.captured,
      isCapture: Boolean(move.captured),
      isCheck: move.san.includes('+'),
      isCheckmate: move.san.includes('#'),
      isPromotion: Boolean(move.promotion),
    };
  } catch {
    return null;
  }
}

export function isGameOver(game: Chess): boolean {
  return game.isGameOver();
}

export function gameStatus(game: Chess): {
  check: boolean;
  checkmate: boolean;
  draw: boolean;
  turn: 'w' | 'b';
} {
  return {
    check: game.isCheck(),
    checkmate: game.isCheckmate(),
    draw: game.isDraw(),
    turn: game.turn(),
  };
}
