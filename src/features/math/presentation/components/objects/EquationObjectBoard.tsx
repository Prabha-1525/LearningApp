import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

import {ObjectImageBox} from './ObjectImageBox';
import {ObjectImageRow} from './ObjectImageRow';

export type EquationOperator = '+' | '-' | '=';

export type EquationObjectBoardProps = {
  readonly leftCount: number;
  readonly rightCount: number;
  readonly image: ImageSourcePropType;
  readonly operator: '+' | '-';
  /** Show numeral under each object row (mock design). */
  readonly showCounts?: boolean;
};

/**
 * Reusable equation image container for Addition / Subtraction
 * (and any screen that shows object groups + operators + ?).
 */
export function EquationObjectBoard({
  leftCount,
  rightCount,
  image,
  operator,
  showCounts = true,
}: EquationObjectBoardProps) {
  const {width} = useWindowDimensions();
  const maxInRow = Math.max(leftCount, rightCount, 1);
  const boardPad = 28;
  const opCol = 36;
  const available = width - boardPad * 2 - opCol - 24;
  const gap = maxInRow <= 4 ? 8 : maxInRow <= 6 ? 6 : 4;
  const raw = Math.floor((available - gap * (maxInRow - 1)) / maxInRow);
  const boxSize = Math.max(
    36,
    Math.min(raw, maxInRow <= 4 ? 64 : maxInRow <= 6 ? 52 : 42),
  );

  return (
    <View style={styles.board} testID="equation-object-board">
      <View style={styles.line}>
        <View style={styles.group}>
          <ObjectImageRow
            count={leftCount}
            image={image}
            boxSize={boxSize}
            gap={gap}
            testIDPrefix="eq-left"
          />
          {showCounts ? (
            <Text style={styles.countLabel}>{leftCount}</Text>
          ) : null}
        </View>
        <Text style={styles.operator}>{operator}</Text>
      </View>

      <View style={styles.line}>
        <View style={styles.group}>
          <ObjectImageRow
            count={rightCount}
            image={image}
            boxSize={boxSize}
            gap={gap}
            testIDPrefix="eq-right"
          />
          {showCounts ? (
            <Text style={styles.countLabel}>{rightCount}</Text>
          ) : null}
        </View>
        <Text style={styles.operator}>=</Text>
      </View>

      <View style={styles.answerRow}>
        <ObjectImageBox
          size={Math.max(56, boxSize + 8)}
          variant="answer"
          testID="eq-answer"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  group: {
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  countLabel: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2563EB',
  },
  operator: {
    fontSize: 36,
    fontWeight: '800',
    color: '#8B5E3C',
    minWidth: 28,
    textAlign: 'center',
  },
  answerRow: {
    alignItems: 'center',
    marginTop: 4,
  },
});
