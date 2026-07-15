import type {Result} from '@shared/lib';

/**
 * Port: chess rules engine. Adapter: chess.js (Phase 1 implementation).
 */
export type ChessSquare = string;
export type ChessColor = 'w' | 'b';

export type ChessPosition = {
  readonly fen: string;
  readonly turn: ChessColor;
  readonly isCheck: boolean;
  readonly isCheckmate: boolean;
  readonly isStalemate: boolean;
  readonly isDraw: boolean;
};

export type ChessMoveInput = {
  readonly from: ChessSquare;
  readonly to: ChessSquare;
  readonly promotion?: 'q' | 'r' | 'b' | 'n';
};

export type ChessMoveResult = {
  readonly position: ChessPosition;
  readonly san: string;
};

export type ChessEnginePort = {
  createFromFen(fen?: string): Result<ChessPosition>;
  getLegalMoves(
    fen: string,
    square?: ChessSquare,
  ): Result<readonly ChessSquare[]>;
  applyMove(fen: string, move: ChessMoveInput): Result<ChessMoveResult>;
};
