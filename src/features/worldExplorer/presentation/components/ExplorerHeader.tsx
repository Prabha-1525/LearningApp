import {Pressable, StyleSheet, Text, View} from 'react-native';

export type ExplorerHeaderProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
};

export function ExplorerHeader({
  title,
  subtitle,
  stars,
  onBack,
}: ExplorerHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={({pressed}) => [
              styles.backBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <Text style={styles.titleText}>{title}</Text>

        {stars !== undefined ? (
          <View style={styles.starPill}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starText}>{stars}</Text>
          </View>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  backPlaceholder: {
    width: 64,
  },
  btnPressed: {
    opacity: 0.75,
  },
  backIcon: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '700',
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  starIcon: {
    fontSize: 14,
  },
  starText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
});
