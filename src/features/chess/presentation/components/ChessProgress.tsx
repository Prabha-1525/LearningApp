import {Pressable, StyleSheet, Text, View} from 'react-native';

export type ChessProgressProps = {
  readonly title: string;
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly stars?: number;
  readonly maxStars?: number;
  readonly onBack?: () => void;
};

export function ChessProgress({
  title,
  currentStep,
  totalSteps,
  stars = 3,
  maxStars = 3,
  onBack,
}: ChessProgressProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
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

        <View style={styles.starPill}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starText}>
            {stars}/{maxStars}
          </Text>
        </View>
      </View>

      {/* Step dot progress indicator: ●━━●━━●━━○━━○ */}
      <View style={styles.dotsRow}>
        {Array.from({length: totalSteps}).map((_, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <View key={`dot-step-${idx}`} style={styles.stepUnit}>
              <View
                style={[
                  styles.dot,
                  isDone && styles.dotDone,
                  isCurrent && styles.dotCurrent,
                ]}
              />
              {idx < totalSteps - 1 && (
                <View style={[styles.line, isDone && styles.lineDone]} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    gap: 10,
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
    width: 60,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
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
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stepUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
  },
  dotDone: {
    backgroundColor: '#22C55E',
  },
  dotCurrent: {
    backgroundColor: '#3B82F6',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#93C5FD',
  },
  line: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
  },
  lineDone: {
    backgroundColor: '#22C55E',
  },
});
