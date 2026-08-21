import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalPatternBoard,
  AnimalsHeader,
} from '../../features/animals/presentation/components';
import {ANIMAL_PATTERNS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalPatterns'>;

export function AnimalPatternsScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'patterns',
      'animal_patterns_quiz',
      stars,
      score,
      'Animal Patterns',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'patterns',
      title: 'Animal Pattern Master 🔄',
      stars,
      score,
      totalQuestions: ANIMAL_PATTERNS.length,
      nextSubModuleId: 'puzzles',
    });
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Animal Patterns"
        subtitle="Complete the repeating animal patterns!"
        emoji="🔄"
        accentColor="#F59E0B"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalPatternBoard
          items={ANIMAL_PATTERNS}
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
