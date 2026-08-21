import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalsHeader,
  AnimalsProgressTracker,
  AnimalSubModuleCard,
} from '../../features/animals/presentation/components';
import {ANIMALS_SUB_MODULES} from '../../features/animals/domain/catalog/animalsData';
import {
  isAnimalSubModuleUnlocked,
  readAnimalsProgress,
} from '../../features/animals/data/progress/animalsProgress';
import type {
  AnimalsProgress,
  AnimalSubModuleConfig,
} from '../../features/animals/domain/entities/animalEntities';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalsHome'>;

export function AnimalsHomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<AnimalsProgress>(
    readAnimalsProgress(),
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(readAnimalsProgress());
    }, []),
  );

  const handleOpenSubModule = (config: AnimalSubModuleConfig) => {
    switch (config.id) {
      case 'meet_animals':
        navigation.navigate('MeetAnimals');
        break;
      case 'land_animals':
        navigation.navigate('LandAnimals');
        break;
      case 'animal_sounds':
        navigation.navigate('AnimalSounds');
        break;
      case 'habitats':
        navigation.navigate('AnimalHabitats');
        break;
      case 'animal_diets':
        navigation.navigate('AnimalDiets');
        break;
      case 'birds':
        navigation.navigate('Birds');
        break;
      case 'sea_animals':
        navigation.navigate('SeaAnimals');
        break;
      case 'amphibians_reptiles':
        navigation.navigate('AmphibiansReptiles');
        break;
      case 'insects':
        navigation.navigate('Insects');
        break;
      case 'animal_babies':
        navigation.navigate('AnimalBabies');
        break;
      case 'matching':
        navigation.navigate('AnimalMatching');
        break;
      case 'classification':
        navigation.navigate('AnimalClassification');
        break;
      case 'count':
        navigation.navigate('AnimalCount');
        break;
      case 'patterns':
        navigation.navigate('AnimalPatterns');
        break;
      case 'puzzles':
        navigation.navigate('AnimalPuzzles');
        break;
      case 'challenge':
        navigation.navigate('AnimalChallenge');
        break;
      case 'quiz':
        navigation.navigate('AnimalChallenge');
        break;
    }
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Animals"
        subtitle="Let's explore the animal world!"
        emoji="🐾"
        accentColor="#F59E0B"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Progress Tracker */}
        <AnimalsProgressTracker progress={progress} />

        {/* Submodule Grid */}
        <View style={styles.grid}>
          {ANIMALS_SUB_MODULES.map(config => {
            const isUnlocked = isAnimalSubModuleUnlocked(config.id, progress);
            const isCompleted = progress.completedSubModules.includes(
              config.id,
            );
            const lesson = progress.lessonsProgress[config.id];
            const stars = lesson?.stars ?? 0;

            return (
              <AnimalSubModuleCard
                key={config.id}
                config={config}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                stars={stars}
                onPress={() => handleOpenSubModule(config)}
              />
            );
          })}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  grid: {
    gap: 12,
  },
});
