import {ChessBoard, type ChessBoardProps} from './ChessBoard';

export type TeachingBoardProps = ChessBoardProps;

/**
 * Interactive teaching board delegate (backward compatibility wrapper).
 */
export function TeachingBoard(props: TeachingBoardProps) {
  return <ChessBoard {...props} />;
}
