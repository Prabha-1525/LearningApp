import {Pressable, StyleSheet, Text, View} from 'react-native';

import type {Country} from '../../domain/entities/Country';

export type CountryCardProps = {
  readonly country: Country;
  readonly isExplored?: boolean;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function CountryCard({
  country,
  isExplored = false,
  onPress,
  testID,
}: CountryCardProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Country ${country.name}`}
      onPress={onPress}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.flagHeader}>
        <Text style={styles.flagEmoji}>{country.flag}</Text>
        {isExplored && (
          <View style={styles.exploredBadge}>
            <Text style={styles.exploredCheck}>✓</Text>
          </View>
        )}
      </View>

      <Text style={styles.countryName} numberOfLines={1}>
        {country.name}
      </Text>

      <View style={styles.continentChip}>
        <Text style={styles.continentText}>{country.continent}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    flex: 1,
    margin: 6,
    minWidth: 140,
  },
  pressed: {
    transform: [{scale: 0.96}],
    opacity: 0.9,
  },
  flagHeader: {
    position: 'relative',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 52,
  },
  exploredBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  exploredCheck: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  countryName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  continentChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  continentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
});
