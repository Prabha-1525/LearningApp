import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import type {Landmark} from '../../domain/entities/Landmark';
import {codeToFlagEmoji} from '../../data/api/countryApi';

export type LandmarkCardProps = {
  readonly landmark: Landmark;
  readonly onPress?: () => void;
  readonly testID?: string;
};

export function LandmarkCard({landmark, onPress, testID}: LandmarkCardProps) {
  const flag = codeToFlagEmoji(landmark.countryCode);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Landmark ${landmark.name}`}
      onPress={onPress}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <Image
        source={{uri: landmark.image}}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlayContainer}>
        <View style={styles.countryTag}>
          <Text style={styles.tagFlag}>{flag}</Text>
          <Text style={styles.tagCountry}>{landmark.countryName}</Text>
        </View>

        <Text style={styles.nameText}>{landmark.name}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {landmark.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  overlayContainer: {
    padding: 16,
    gap: 6,
  },
  countryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tagFlag: {
    fontSize: 14,
  },
  tagCountry: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 20,
  },
});
