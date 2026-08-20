import {Pressable, StyleSheet, Text, View} from 'react-native';

export type ChessInstructionCardProps = {
  readonly titleTa?: string;
  readonly pieceSymbol?: string;
  readonly instructionTa: string;
  readonly onReplayAudio?: () => void;
};

export function ChessInstructionCard({
  titleTa,
  pieceSymbol = '♟️',
  instructionTa,
  onReplayAudio,
}: ChessInstructionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeSymbol}>{pieceSymbol}</Text>
          {titleTa ? <Text style={styles.badgeTitle}>{titleTa}</Text> : null}
        </View>

        {onReplayAudio && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Listen speech"
            onPress={onReplayAudio}
            style={({pressed}) => [
              styles.audioBtn,
              pressed && styles.audioBtnPressed,
            ]}>
            <Text style={styles.audioIcon}>🔊</Text>
            <Text style={styles.audioText}>கேள் (Listen)</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.instructionText}>{instructionTa}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2.5,
    borderColor: '#FCD34D',
    shadowColor: '#D97706',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
    alignSelf: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#FBBF24',
  },
  badgeSymbol: {
    fontSize: 20,
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#1D4ED8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  audioBtnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.96}],
  },
  audioIcon: {
    fontSize: 16,
  },
  audioText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    lineHeight: 26,
  },
});
