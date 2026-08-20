import {Pressable, StyleSheet, Text, View} from 'react-native';

export type FlagCardProps = {
  readonly flagEmoji: string;
  readonly countryName: string;
  readonly continentName?: string;
  readonly descriptionText?: string;
  readonly onListen?: () => void;
};

export function FlagCard({
  flagEmoji,
  countryName,
  continentName,
  descriptionText,
  onListen,
}: FlagCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.flagWrap}>
        <Text style={styles.flagEmoji}>{flagEmoji}</Text>
      </View>

      <Text style={styles.countryTitle}>{countryName}</Text>
      {continentName && (
        <Text style={styles.continentText}>{continentName}</Text>
      )}

      <View style={styles.divider} />

      {descriptionText && (
        <Text style={styles.description}>{descriptionText}</Text>
      )}

      {onListen && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Listen speech"
          onPress={onListen}
          style={({pressed}) => [
            styles.listenBtn,
            pressed && styles.btnPressed,
          ]}>
          <Text style={styles.listenIcon}>🔊</Text>
          <Text style={styles.listenText}>கேள் (Listen)</Text>
        </Pressable>
      )}
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
    shadowColor: '#1E3A8A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  flagWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#93C5FD',
    marginBottom: 12,
  },
  flagEmoji: {
    fontSize: 64,
  },
  countryTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  continentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  divider: {
    height: 2,
    width: 60,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  description: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#B45309',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.96}],
  },
  listenIcon: {
    fontSize: 18,
  },
  listenText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
