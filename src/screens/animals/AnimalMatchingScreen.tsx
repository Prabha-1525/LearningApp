import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {AnimalMatcherBoard} from '../../features/animals/presentation/components';
import {ANIMAL_MATCHING_PAIRS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalMatching'>;

export function AnimalMatchingScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'matching',
      'matching_pairs',
      stars,
      score,
      'Animal Matching',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'matching',
      title: 'Animal Matcher Star 🧩',
      stars,
      score,
      totalQuestions: ANIMAL_MATCHING_PAIRS.length,
      nextSubModuleId: 'classification',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Match Animals"
        subtitle="Match animals with sounds, habitats, foods, and babies!"
        emoji="🧩"
        accentColor="#14B8A6"
        titleColor="#14B8A6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalMatcherBoard
          pairs={ANIMAL_MATCHING_PAIRS}
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
