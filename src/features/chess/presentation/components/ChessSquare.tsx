import {Pressable, StyleSheet, View} from 'react-native';

import {
  HIGHLIGHT_COLORS,
  isLightSquare,
  type HighlightTone,
  type PieceLetter,
  type Square,
} from '../../domain/board/squares';
import {CaptureIndicator} from './CaptureIndicator';
import {ChessPiece} from './ChessPiece';
import {MoveIndicator} from './MoveIndicator';

const LIGHT_SQUARE = '#F9F6F0';
const DARK_SQUARE = '#7EA885';
const SELECTED_SQUARE = '#FDE68A';

export type ChessSquareProps = {
  readonly square: Square;
  readonly size: number;
  readonly piece?: PieceLetter;
  readonly isSelected?: boolean;
  readonly isHighlighted?: boolean;
  readonly highlightTone?: HighlightTone;
  readonly isLegalMove?: boolean;
  readonly isCaptureTarget?: boolean;
  readonly isDimmed?: boolean;
  readonly interactive?: boolean;
  readonly onPress?: (sq: Square) => void;
  readonly testID?: string;
};

export function ChessSquare({
  square: sq,
  size,
  piece,
  isSelected = false,
  isHighlighted = false,
  highlightTone = 'teach',
  isLegalMove = false,
  isCaptureTarget = false,
  isDimmed = false,
  interactive = true,
  onPress,
  testID,
}: ChessSquareProps) {
  const isLight = isLightSquare(sq);
  const baseBg = isSelected
    ? SELECTED_SQUARE
    : isLight
    ? LIGHT_SQUARE
    : DARK_SQUARE;

  const highlightBg = isHighlighted
    ? HIGHLIGHT_COLORS[highlightTone] ?? 'rgba(255, 245, 157, 0.6)'
    : null;

  const content = (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: baseBg,
        },
      ]}>
      {/* Highlight Overlay */}
      {highlightBg && (
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: highlightBg,
            },
          ]}
        />
      )}

      {/* Selected Gold Border Ring */}
      {isSelected && <View style={styles.selectedBorderRing} />}

      {/* Legal Move Indicator (Empty Square) */}
      {isLegalMove && !piece && <MoveIndicator size={size} />}

      {/* Capture Target Indicator */}
      {(isCaptureTarget || (isLegalMove && piece)) && (
        <CaptureIndicator size={size} />
      )}

      {/* Chess Piece */}
      {piece ? (
        <ChessPiece
          letter={piece}
          size={size}
          selected={isSelected}
          dimmed={isDimmed}
        />
      ) : null}
    </View>
  );

  if (!interactive) {
    return (
      <View style={{width: size, height: size}} testID={testID}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Chess square ${sq}`}
      onPress={() => onPress?.(sq)}
      style={({pressed}) => [
        {width: size, height: size},
        pressed && styles.pressed,
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
  selectedBorderRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 3,
    borderColor: '#F59E0B',
    zIndex: 4,
  },
  pressed: {
    opacity: 0.88,
  },
});
