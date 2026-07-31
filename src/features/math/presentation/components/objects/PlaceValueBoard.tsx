import {StyleSheet, Text, View} from 'react-native';

import type {PlaceDigits} from '../../../domain/equation/additionGenerator';

export type PlaceValueBoardProps = {
  readonly left: number;
  readonly right: number;
  readonly leftDigits: PlaceDigits;
  readonly rightDigits: PlaceDigits;
  /** Show hundreds column (lesson 5). */
  readonly showHundreds?: boolean;
  /** Emphasize base-10 block style (lesson 4). */
  readonly variant?: 'placeValue' | 'base10';
};

function BlockRow({
  count,
  color,
  kind,
  maxVisible = 9,
}: {
  readonly count: number;
  readonly color: string;
  readonly kind: 'hundred' | 'ten' | 'one';
  readonly maxVisible?: number;
}) {
  const visible = Math.min(count, maxVisible);
  const size =
    kind === 'hundred' ? {width: 28, height: 28} : kind === 'ten'
      ? {width: 12, height: 36}
      : {width: 14, height: 14};

  return (
    <View style={styles.blockRow}>
      {Array.from({length: visible}, (_, i) => (
        <View
          key={`${kind}-${i}`}
          style={[
            styles.block,
            size,
            {backgroundColor: color},
            kind === 'hundred' && styles.hundredBlock,
            kind === 'ten' && styles.tenBlock,
            kind === 'one' && styles.oneBlock,
          ]}
        />
      ))}
      {count > maxVisible ? (
        <Text style={styles.overflowLabel}>+{count - maxVisible}</Text>
      ) : null}
    </View>
  );
}

function PlaceRow({
  value,
  digits,
  showHundreds,
  operator,
}: {
  readonly value: number;
  readonly digits: PlaceDigits;
  readonly showHundreds: boolean;
  readonly operator?: '+' | '=';
}) {
  return (
    <View style={styles.placeRow}>
      {operator ? <Text style={styles.op}>{operator}</Text> : (
        <View style={styles.opSpacer} />
      )}
      <Text style={styles.numberLabel}>{value}</Text>
      <View style={styles.columns}>
        {showHundreds ? (
          <View style={styles.column}>
            <Text style={styles.columnTitle}>H</Text>
            <BlockRow
              count={digits.hundreds}
              color="#7C3AED"
              kind="hundred"
            />
            <Text style={styles.digitLabel}>{digits.hundreds}</Text>
          </View>
        ) : null}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>T</Text>
          <BlockRow count={digits.tens} color="#2563EB" kind="ten" />
          <Text style={styles.digitLabel}>{digits.tens}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>O</Text>
          <BlockRow count={digits.ones} color="#F59E0B" kind="one" />
          <Text style={styles.digitLabel}>{digits.ones}</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Place-value / Base-10 visual for multi-digit addition (lessons 3–5).
 * Shows Hundreds / Tens / Ones blocks instead of counting individual objects.
 */
export function PlaceValueBoard({
  left,
  right,
  leftDigits,
  rightDigits,
  showHundreds = false,
  variant = 'placeValue',
}: PlaceValueBoardProps) {
  return (
    <View
      style={[styles.board, variant === 'base10' && styles.boardBase10]}
      testID="place-value-board">
      <Text style={styles.legend}>
        {showHundreds ? 'Hundreds · Tens · Ones' : 'Tens · Ones'}
      </Text>

      <PlaceRow
        value={left}
        digits={leftDigits}
        showHundreds={showHundreds}
      />
      <PlaceRow
        value={right}
        digits={rightDigits}
        showHundreds={showHundreds}
        operator="+"
      />

      <View style={styles.divider} />

      <View style={styles.answerRow}>
        <Text style={styles.op}>=</Text>
        <View style={styles.answerBox}>
          <Text style={styles.answerMark}>?</Text>
        </View>
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
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  boardBase10: {
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  legend: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  op: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B5E3C',
    width: 28,
    textAlign: 'center',
  },
  opSpacer: {
    width: 28,
  },
  numberLabel: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    minWidth: 52,
    textAlign: 'right',
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 6,
  },
  column: {
    alignItems: 'center',
    gap: 4,
    minWidth: 48,
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  digitLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },
  blockRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 3,
    minHeight: 40,
    maxWidth: 72,
  },
  block: {
    borderRadius: 3,
  },
  hundredBlock: {
    borderRadius: 6,
  },
  tenBlock: {
    borderRadius: 3,
  },
  oneBlock: {
    borderRadius: 7,
  },
  overflowLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  divider: {
    height: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  answerBox: {
    width: 72,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#5BA3E8',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerMark: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
