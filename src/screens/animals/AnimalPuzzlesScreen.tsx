import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalPuzzleBoard,
  AnimalsHeader,
} from '../../features/animals/presentation/components';
import {ANIMAL_PUZZLES} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalPuzzles'>;

export function AnimalPuzzlesScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'puzzles',
      'animal_puzzles_reasoning',
      stars,
      score,
      'Animal Puzzles',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'puzzles',
      title: 'Animal Puzzle Star 🎯',
      stars,
      score,
      totalQuestions: ANIMAL_PUZZLES.length,
      nextSubModuleId: 'challenge',
    });
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Animal Puzzles"
        subtitle="Solve odd-one-out and visual reasoning puzzles!"
        emoji="🎯"
        accentColor="#3B82F6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalPuzzleBoard items={ANIMAL_PUZZLES} onComplete={handleComplete} />
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
