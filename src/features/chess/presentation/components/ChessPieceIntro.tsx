import {StyleSheet, Text, View} from 'react-native';

export type ChessPieceIntroProps = {
  readonly titleTa: string;
  readonly subtitleTa: string;
  readonly pieceSymbol?: string;
  readonly descriptionTa: string;
};

export function ChessPieceIntro({
  titleTa,
  subtitleTa,
  pieceSymbol = '♟️',
  descriptionTa,
}: ChessPieceIntroProps) {
  return (
    <View style={styles.card}>
      <View style={styles.symbolBadge}>
        <Text style={styles.pieceSymbol}>{pieceSymbol}</Text>
      </View>
      <Text style={styles.title}>{titleTa}</Text>
      <Text style={styles.subtitle}>{subtitleTa}</Text>
      <View style={styles.divider} />
      <Text style={styles.description}>{descriptionTa}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3B82F6',
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  symbolBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#93C5FD',
    marginBottom: 12,
  },
  pieceSymbol: {
    fontSize: 54,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2A4A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B6B74',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    height: 2,
    width: 60,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  description: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
    textAlign: 'center',
    lineHeight: 26,
  },
});
