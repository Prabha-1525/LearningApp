import {StyleSheet, Text, View} from 'react-native';

export type SubjectProgressRowProps = {
  readonly subjectName: string;
  readonly percentage: number;
  readonly color: string;
  readonly testID?: string;
};

export function SubjectProgressRow({
  subjectName,
  percentage,
  color,
  testID,
}: SubjectProgressRowProps) {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.headerRow}>
        <Text style={styles.subjectName}>{subjectName}</Text>
        <Text style={[styles.percentage, {color}]}>{clamped}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A4A',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '800',
  },
  track: {
    height: 18,
    width: '100%',
    backgroundColor: '#E8F2FA',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
