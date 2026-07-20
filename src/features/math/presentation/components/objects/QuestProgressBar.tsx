import {StyleSheet, Text, View} from 'react-native';

type QuestProgressBarProps = {
  readonly label: string;
  readonly percent: number;
};

/** Quest progress track with star badge (addition mock). */
export function QuestProgressBar({label, percent}: QuestProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackRow}>
        <View style={styles.track}>
          <View style={[styles.fill, {width: `${clamped}%`}]} />
        </View>
        <View style={styles.starBadge}>
          <Text style={styles.star}>★</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {gap: 6, flex: 1},
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  track: {
    flex: 1,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#D6E8F5',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#2F8F4E',
    borderRadius: 999,
  },
  starBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2F8F4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
