import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalBabiesBoard,
  AnimalsHeader,
} from '../../features/animals/presentation/components';
import {BABY_ANIMALS_DATA} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalBabies'>;

export function AnimalBabiesScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'animal_babies',
      'babies_quiz',
      stars,
      score,
      'Animal Babies',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'animal_babies',
      title: 'Baby Animal Friend 👶',
      stars,
      score,
      totalQuestions: BABY_ANIMALS_DATA.length,
      nextSubModuleId: 'matching',
    });
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Animal Babies"
        subtitle="Learn the cute names of baby animals!"
        emoji="👶"
        accentColor="#EC4899"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalBabiesBoard
          items={BABY_ANIMALS_DATA}
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
