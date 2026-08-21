import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {AnimalDietBoard} from '../../features/animals/presentation/components';
import {ANIMAL_DIET_ITEMS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalDiets'>;

export function AnimalDietsScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'animal_diets',
      'diets_matching',
      stars,
      score,
      'Animal Diets',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'animal_diets',
      title: 'Animal Food Explorer',
      stars,
      score,
      totalQuestions: ANIMAL_DIET_ITEMS.length,
      nextSubModuleId: 'birds',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="What Do Animals Eat?"
        subtitle="Learn what delicious foods different animals love to eat!"
        emoji="🥕"
        accentColor="#EF4444"
        titleColor="#EF4444"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalDietBoard
          items={ANIMAL_DIET_ITEMS}
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
