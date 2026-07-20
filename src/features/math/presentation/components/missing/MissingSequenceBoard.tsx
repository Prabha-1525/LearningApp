import {StyleSheet, Text, View} from 'react-native';

type MissingSequenceBoardProps = {
  readonly sequence: readonly (number | null)[];
  readonly filledAnswer?: number | null;
};

/**
 * Number tiles + dashed "?" gap (MathAdventure Missing Number).
 * Wraps into two rows for five tiles like the design.
 */
export function MissingSequenceBoard({
  sequence,
  filledAnswer = null,
}: MissingSequenceBoardProps) {
  const display = sequence.map(n =>
    n == null && filledAnswer != null ? filledAnswer : n,
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {display.slice(0, 3).map((value, index) => (
          <NumberTile key={`r1-${index}`} value={value} />
        ))}
      </View>
      <View style={styles.row}>
        {display.slice(3).map((value, index) => (
          <NumberTile key={`r2-${index}`} value={value} />
        ))}
      </View>
    </View>
  );
}

function NumberTile({value}: {readonly value: number | null}) {
  if (value == null) {
    return (
      <View style={[styles.tile, styles.gapTile]}>
        <Text style={styles.gapText}>?</Text>
      </View>
    );
  }

  return (
    <View style={[styles.tile, styles.numberTile]}>
      <Text style={styles.numberText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  tile: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberTile: {
    backgroundColor: '#3B82F6',
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 4,
    borderBottomWidth: 5,
    borderBottomColor: '#1D4ED8',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  gapTile: {
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#60A5FA',
  },
  gapText: {
    color: '#1D4ED8',
    fontSize: 32,
    fontWeight: '800',
  },
});
