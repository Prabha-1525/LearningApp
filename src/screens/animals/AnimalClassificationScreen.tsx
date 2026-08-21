import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {AnimalClassifierBoard} from '../../features/animals/presentation/components';
import {ANIMAL_CLASSIFICATION_ITEMS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<
  AnimalsStackParamList,
  'AnimalClassification'
>;

export function AnimalClassificationScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'classification',
      'classification_traits',
      stars,
      score,
      'Animal Traits',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'classification',
      title: 'Animal Classifier Star 🧠',
      stars,
      score,
      totalQuestions: ANIMAL_CLASSIFICATION_ITEMS.length,
      nextSubModuleId: 'count',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Classify Animals"
        subtitle="Sort animals by where they live and how they move!"
        emoji="🧠"
        accentColor="#6366F1"
        titleColor="#6366F1"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalClassifierBoard
          items={ANIMAL_CLASSIFICATION_ITEMS}
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
