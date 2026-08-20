import {useMemo} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {
  FILES,
  RANKS,
  type HighlightTone,
  type PieceMap,
  type Square,
} from '../../domain/board/squares';
import {getLegalMovesForSquare} from '../../domain/policies/chessRules';
import {ChessSquare} from './ChessSquare';

export type ChessBoardProps = {
  readonly size?: number;
  readonly pieces: PieceMap;
  readonly highlights?: readonly Square[];
  readonly highlightTone?: HighlightTone;
  readonly selectedFrom?: Square | null;
  readonly legalMoves?: readonly Square[];
  readonly interactive?: boolean;
  readonly dimUnusedPieces?: boolean;
  readonly activePieceSquare?: Square;
  readonly onSquarePress?: (square: Square) => void;
  readonly testID?: string;
};

export function ChessBoard({
  size: customSize,
  pieces,
  highlights = [],
  highlightTone = 'teach',
  selectedFrom = null,
  legalMoves,
  interactive = true,
  dimUnusedPieces = false,
  activePieceSquare,
  onSquarePress,
  testID = 'chess-board',
}: ChessBoardProps) {
  const {width: windowWidth} = useWindowDimensions();

  // Compute responsive board size maintaining 1:1 aspect ratio
  const boardSize = useMemo(() => {
    if (customSize && customSize > 0) {
      return customSize;
    }
    return Math.min(windowWidth - 32, 390);
  }, [customSize, windowWidth]);

  const cellSize = boardSize / 8;
  const highlightSet = useMemo(() => new Set(highlights), [highlights]);

  // Compute legal moves automatically if selectedFrom is provided
  const computedLegalMoves = useMemo(() => {
    if (legalMoves) {
      return legalMoves;
    }
    if (selectedFrom && pieces[selectedFrom]) {
      return getLegalMovesForSquare(selectedFrom, pieces);
    }
    return [];
  }, [legalMoves, pieces, selectedFrom]);

  const legalSet = useMemo(
    () => new Set(computedLegalMoves),
    [computedLegalMoves],
  );

  return (
    <View
      testID={testID}
      accessibilityLabel="Responsive chess board"
      style={[
        styles.boardShadowContainer,
        {
          width: boardSize,
          height: boardSize,
          borderRadius: 24,
        },
      ]}>
      <View
        style={[
          styles.boardGrid,
          {
            width: boardSize,
            height: boardSize,
            borderRadius: 24,
          },
        ]}>
        {RANKS.map(rank => (
          <View key={`r${rank}`} style={styles.row}>
            {FILES.map(file => {
              const sq = `${file}${rank}` as Square;
              const piece = pieces[sq];
              const isSelected = selectedFrom === sq;
              const isHighlighted = highlightSet.has(sq);
              const isLegal = legalSet.has(sq);
              const isTargetEnemy = isLegal && piece != null;

              const isDimmed =
                dimUnusedPieces &&
                activePieceSquare != null &&
                sq !== activePieceSquare &&
                !isLegal;

              return (
                <ChessSquare
                  key={sq}
                  square={sq}
                  size={cellSize}
                  piece={piece}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  highlightTone={highlightTone}
                  isLegalMove={isLegal}
                  isCaptureTarget={isTargetEnemy}
                  isDimmed={isDimmed}
                  interactive={interactive}
                  onPress={onSquarePress}
                  testID={`square-${sq}`}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardShadowContainer: {
    shadowColor: '#143820',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
    alignSelf: 'center',
  },
  boardGrid: {
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#3D7A49',
    backgroundColor: '#3D7A49',
  },
  row: {
    flexDirection: 'row',
  },
});
