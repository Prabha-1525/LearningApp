import {StyleSheet, View} from 'react-native';

import {AppText, useTheme} from '@shared/ui';

const LIGHT = '#F0E6D2';
const DARK = '#6B9B76';

/** Demo starting positions — visual only, not a rules engine. */
const DEMO: (string | null)[][] = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

export type MiniChessBoardProps = {
  readonly size?: number;
  readonly compact?: boolean;
  readonly testID?: string;
};

/**
 * Kid-facing board illustration for Chess hub / lessons.
 * Not an interactive engine board — Phase 1 learning visual.
 */
export function MiniChessBoard({
  size = 280,
  compact = false,
  testID,
}: MiniChessBoardProps) {
  const {radius} = useTheme();
  const rows = compact ? DEMO.slice(4, 8) : DEMO;
  const cols = compact ? 4 : 8;
  const cell = size / cols;

  return (
    <View
      testID={testID}
      accessibilityLabel="Chess board"
      style={[
        styles.board,
        {
          width: size,
          height: compact ? size : size,
          borderRadius: radius.md,
        },
      ]}>
      {rows.map((row, rowIndex) => (
        <View key={`r${rowIndex}`} style={styles.row}>
          {(compact ? row.slice(2, 6) : row).map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;
            return (
              <View
                key={`c${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: cell,
                    height: cell,
                    backgroundColor: isDark ? DARK : LIGHT,
                  },
                ]}>
                {piece ? (
                  <AppText
                    variant="title"
                    style={{fontSize: cell * 0.55, lineHeight: cell * 0.7}}>
                    {piece}
                  </AppText>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3D9A5F',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
