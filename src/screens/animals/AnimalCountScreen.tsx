import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalCounterBoard,
  AnimalsHeader,
} from '../../features/animals/presentation/components';
import {ANIMAL_COUNT_ITEMS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalCount'>;

export function AnimalCountScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'count',
      'animal_count_quiz',
      stars,
      score,
      'Animal Counting',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'count',
      title: 'Animal Counter Star 🔢',
      stars,
      score,
      totalQuestions: ANIMAL_COUNT_ITEMS.length,
      nextSubModuleId: 'patterns',
    });
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Count the Animals"
        subtitle="Count the target animals on the board!"
        emoji="🔢"
        accentColor="#D946EF"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalCounterBoard
          items={ANIMAL_COUNT_ITEMS}
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
