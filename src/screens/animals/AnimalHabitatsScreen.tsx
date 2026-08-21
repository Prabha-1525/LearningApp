import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalHabitatBoard,
  AnimalsHeader,
} from '../../features/animals/presentation/components';
import {ANIMAL_HABITAT_ITEMS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalHabitats'>;

export function AnimalHabitatsScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'habitats',
      'habitats_quiz',
      stars,
      score,
      'Habitats',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'habitats',
      title: 'Habitat Helper Star',
      stars,
      score,
      totalQuestions: ANIMAL_HABITAT_ITEMS.length,
      nextSubModuleId: 'animal_diets',
    });
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Animal Habitats"
        subtitle="Discover where animals live across forests, oceans, and farms!"
        emoji="🏠"
        accentColor="#8B5CF6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalHabitatBoard
          items={ANIMAL_HABITAT_ITEMS}
          onComplete={handleComplete}
        />
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
});
