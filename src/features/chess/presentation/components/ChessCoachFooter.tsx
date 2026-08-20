import {Pressable, StyleSheet, Text, View} from 'react-native';

export type ChessCoachFooterProps = {
  readonly instructionTa: string;
  readonly onReplayAudio?: () => void;
  readonly onShowHint?: () => void;
  readonly onContinue?: () => void;
  readonly continueLabel?: string;
  readonly isAnswered?: boolean;
};

export function ChessCoachFooter({
  instructionTa,
  onReplayAudio,
  onShowHint,
  onContinue,
  continueLabel = 'அடுத்து (Next)',
  isAnswered = false,
}: ChessCoachFooterProps) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.bubble}>
        <Text style={styles.instructionText}>{instructionTa}</Text>
      </View>

      <View style={styles.actionRow}>
        {onReplayAudio && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Replay speech"
            onPress={onReplayAudio}
            style={({pressed}) => [
              styles.iconBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.iconText}>🔊</Text>
          </Pressable>
        )}

        {onShowHint && !isAnswered && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show hint"
            onPress={onShowHint}
            style={({pressed}) => [
              styles.hintBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.hintText}>💡 குறிப்பு (Hint)</Text>
          </Pressable>
        )}

        {onContinue && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue"
            onPress={onContinue}
            style={({pressed}) => [
              styles.continueBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.continueText}>{continueLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  bubble: {
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  instructionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5D6',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  hintBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  hintText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.97}],
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
