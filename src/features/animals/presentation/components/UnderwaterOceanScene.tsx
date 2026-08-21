import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {AnimalItem} from '../../domain/entities/animalEntities';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface UnderwaterOceanSceneProps {
  readonly seaAnimals: readonly AnimalItem[];
  readonly onComplete?: (stars: number) => void;
}

export function UnderwaterOceanScene({
  seaAnimals,
  onComplete,
}: UnderwaterOceanSceneProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const swimAnim = useRef(new Animated.Value(0)).current;
  const zoomAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animalsAudio.speak(
      'Welcome to the Deep Blue Ocean! Tap any sea animal to explore and watch it swim!',
    );
    // Continuous subtle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(swimAnim, {
          toValue: 10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(swimAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [swimAnim]);

  const handleTapAnimal = (animal: AnimalItem) => {
    setSelectedAnimal(animal);
    if (!exploredIds.includes(animal.id)) {
      setExploredIds(prev => [...prev, animal.id]);
    }

    Animated.sequence([
      Animated.timing(zoomAnim, {
        toValue: 1.25,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(zoomAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    animalsAudio.playAnimalSound(
      animal.soundFrequencyHz,
      animal.soundOnomatopoeia,
    );
    animalsAudio.speak(`${animal.name}! ${animal.simpleFact}`);
  };

  return (
    <View style={styles.container}>
      {/* Ocean Scene Header */}
      <View style={styles.oceanHeader}>
        <Text style={styles.oceanTitle}>🌊 Interactive Ocean Exploration</Text>
        <Text style={styles.oceanSubtitle}>
          Explored: {exploredIds.length} / {seaAnimals.length} Sea Creatures
        </Text>
      </View>

      {/* Underwater Interactive Aquarium Canvas */}
      <View style={styles.oceanCanvas}>
        {/* Bubbles & Coral Decor */}
        <Text style={styles.decorBubble1}>🫧</Text>
        <Text style={styles.decorBubble2}>🫧</Text>
        <Text style={styles.decorCoralLeft}>🪸</Text>
        <Text style={styles.decorCoralRight}>🪸</Text>
        <Text style={styles.decorSeaweed}>🌿</Text>

        {/* Sea Animals Grid / Swimming Nodes */}
        <Animated.View
          style={[styles.animalsGrid, {transform: [{translateY: swimAnim}]}]}>
          {seaAnimals.map(animal => {
            const isSelected = selectedAnimal?.id === animal.id;
            const isExplored = exploredIds.includes(animal.id);

            return (
              <Pressable
                key={animal.id}
                accessibilityRole="button"
                accessibilityLabel={animal.name}
                onPress={() => handleTapAnimal(animal)}
                style={[
                  styles.animalNode,
                  isSelected && styles.animalNodeSelected,
                ]}>
                <Text style={styles.animalEmoji}>{animal.emoji}</Text>
                <Text style={styles.animalNodeName}>{animal.name}</Text>
                {isExplored && <Text style={styles.starCheck}>⭐</Text>}
              </Pressable>
            );
          })}
        </Animated.View>
      </View>

      {/* Selected Animal Spotlight Card */}
      {selectedAnimal && (
        <Animated.View
          style={[
            styles.spotlightCard,
            {
              backgroundColor: selectedAnimal.lightColor,
              borderColor: selectedAnimal.color,
              transform: [{scale: zoomAnim}],
            },
          ]}>
          <View style={styles.spotlightHeader}>
            <Text style={styles.spotlightEmoji}>{selectedAnimal.emoji}</Text>
            <View style={styles.spotlightTextWrap}>
              <Text
                style={[
                  styles.spotlightTitle,
                  {color: selectedAnimal.darkColor},
                ]}>
                {selectedAnimal.name}
              </Text>
              <Text style={styles.spotlightSound}>
                "{selectedAnimal.soundOnomatopoeia}"
              </Text>
            </View>
          </View>
          <Text style={styles.spotlightFact}>{selectedAnimal.simpleFact}</Text>
        </Animated.View>
      )}

      {/* Completion Button */}
      {exploredIds.length >= 4 && onComplete && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Claim sea explorer badge"
          onPress={() => onComplete(3)}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>Claim Ocean Explorer ⭐⭐⭐</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  oceanHeader: {
    alignItems: 'center',
    gap: 2,
  },
  oceanTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0369A1',
  },
  oceanSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  oceanCanvas: {
    width: '100%',
    minHeight: 260,
    backgroundColor: '#0284C7',
    borderRadius: 26,
    borderWidth: 3.5,
    borderColor: '#0369A1',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  decorBubble1: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 20,
    opacity: 0.7,
  },
  decorBubble2: {
    position: 'absolute',
    top: 40,
    right: 25,
    fontSize: 24,
    opacity: 0.8,
  },
  decorCoralLeft: {
    position: 'absolute',
    bottom: 6,
    left: 10,
    fontSize: 32,
  },
  decorCoralRight: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    fontSize: 32,
  },
  decorSeaweed: {
    position: 'absolute',
    bottom: 8,
    left: '48%',
    fontSize: 28,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  animalNode: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  animalNodeSelected: {
    backgroundColor: '#FEF08A',
    borderColor: '#F59E0B',
    borderWidth: 3.5,
    transform: [{scale: 1.12}],
  },
  animalEmoji: {
    fontSize: 32,
  },
  animalNodeName: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0369A1',
    marginTop: 2,
  },
  starCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 14,
  },
  spotlightCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 2.5,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spotlightEmoji: {
    fontSize: 42,
  },
  spotlightTextWrap: {
    flex: 1,
    gap: 2,
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  spotlightSound: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
  },
  spotlightFact: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    lineHeight: 18,
  },
  finishBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
