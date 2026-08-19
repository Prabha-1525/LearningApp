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
  /** Show numeral under each object row. */
  readonly showCounts?: boolean;
};

/**
 * Reusable visual board for Addition / Subtraction equations with PNG math assets.
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
  const boardPad = 24;
  const available = width - boardPad * 2 - 32;
  const gap = maxInRow <= 4 ? 8 : maxInRow <= 6 ? 6 : maxInRow <= 8 ? 4 : 3;
  const raw = Math.floor((available - gap * (maxInRow - 1)) / maxInRow);
  const boxSize = Math.max(
    28,
    Math.min(
      raw,
      maxInRow <= 4 ? 58 : maxInRow <= 6 ? 48 : maxInRow <= 8 ? 38 : 30,
    ),
  );

  return (
    <View style={styles.board} testID="equation-object-board">
      <View style={styles.line}>
        <View style={[styles.groupCard, styles.leftGroupCard]}>
          <ObjectImageRow
            count={leftCount}
            image={image}
            boxSize={boxSize}
            gap={gap}
            testIDPrefix="eq-left"
          />
          {showCounts ? (
            <View style={styles.leftPill}>
              <Text style={styles.leftPillText}>{leftCount}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.operatorCircle}>
          <Text style={styles.operatorText}>{operator}</Text>
        </View>
      </View>

      <View style={styles.line}>
        <View style={[styles.groupCard, styles.rightGroupCard]}>
          <ObjectImageRow
            count={rightCount}
            image={image}
            boxSize={boxSize}
            gap={gap}
            testIDPrefix="eq-right"
          />
          {showCounts ? (
            <View style={styles.rightPill}>
              <Text style={styles.rightPillText}>{rightCount}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.operatorCircle}>
          <Text style={styles.operatorText}>=</Text>
        </View>
      </View>

      <View style={styles.answerRow}>
        <ObjectImageBox
          size={Math.max(54, boxSize + 10)}
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
    paddingVertical: 18,
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: '#1E293B',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  groupCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
  },
  leftGroupCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  rightGroupCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  leftPill: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  leftPillText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rightPill: {
    backgroundColor: '#EA580C',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  rightPillText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  operatorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operatorText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#475569',
  },
  answerRow: {
    alignItems: 'center',
    marginTop: 2,
  },
});
