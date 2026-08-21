import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalCardProps {
  readonly animal: AnimalItem;
  readonly onNext?: () => void;
}

export function AnimalCard({animal, onNext}: AnimalCardProps) {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animalsAudio.speak(`This is a ${animal.name}. ${animal.simpleFact}`);
  }, [animal]);

  const handlePlaySound = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.18,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    animalsAudio.playAnimalSound(
      animal.soundFrequencyHz,
      animal.soundOnomatopoeia,
    );
  };

  const handlePronounce = () => {
    animalsAudio.speak(animal.name);
  };

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: animal.lightColor, borderColor: animal.color},
      ]}>
      {/* Top Banner with Name & Audio */}
      <View style={styles.headerRow}>
        <View style={styles.nameWrap}>
          <Text style={[styles.animalName, {color: animal.darkColor}]}>
            {animal.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Pronounce ${animal.name}`}
            onPress={handlePronounce}
            style={[styles.audioPill, {backgroundColor: animal.color}]}>
            <Text style={styles.audioPillText}>🔊 Listen</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Play ${animal.name} sound`}
          onPress={handlePlaySound}
          style={[styles.soundBtn, {backgroundColor: animal.color}]}>
          <Text style={styles.soundBtnIcon}>📢</Text>
          <Text style={styles.soundBtnText}>{animal.soundName}</Text>
        </Pressable>
      </View>

      {/* Main Animated Illustration Circle */}
      <Animated.View
        style={[
          styles.emojiCircle,
          {
            backgroundColor: '#FFFFFF',
            borderColor: animal.color,
            transform: [{scale: bounceAnim}],
          },
        ]}>
        <Pressable onPress={handlePlaySound}>
          <Text style={styles.animalEmoji}>{animal.emoji}</Text>
        </Pressable>
        <Text style={[styles.soundText, {color: animal.darkColor}]}>
          "{animal.soundOnomatopoeia}"
        </Text>
      </Animated.View>

      {/* Property Pills Grid: Habitat, Diet, Baby */}
      <View style={styles.propertiesGrid}>
        <View style={styles.propCard}>
          <Text style={styles.propLabel}>🏠 Habitat</Text>
          <Text style={styles.propValue}>
            {animal.habitatEmoji} {animal.habitatDisplayName}
          </Text>
        </View>

        <View style={styles.propCard}>
          <Text style={styles.propLabel}>🥕 Food</Text>
          <Text style={styles.propValue}>
            {animal.foodEmoji} {animal.foodDisplayName}
          </Text>
        </View>

        <View style={styles.propCard}>
          <Text style={styles.propLabel}>👶 Baby</Text>
          <Text style={styles.propValue}>{animal.babyName}</Text>
        </View>
      </View>

      {/* Simple Fact Card */}
      <View style={styles.factCard}>
        <Text style={styles.factTitle}>💡 Fun Animal Fact</Text>
        <Text style={styles.factText}>{animal.simpleFact}</Text>
      </View>

      {/* Next Animal Button */}
      {onNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next animal"
          onPress={onNext}
          style={[styles.nextBtn, {backgroundColor: animal.color}]}>
          <Text style={styles.nextBtnText}>Explore Next Animal ➔</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 26,
    borderWidth: 3,
    padding: 18,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  animalName: {
    fontSize: 22,
    fontWeight: '900',
  },
  audioPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  audioPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  soundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  soundBtnIcon: {
    fontSize: 14,
  },
  soundBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  emojiCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  animalEmoji: {
    fontSize: 68,
  },
  soundText: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: -4,
  },
  propertiesGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  propCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 2,
  },
  propLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  propValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  factTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
  },
  factText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    lineHeight: 18,
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
