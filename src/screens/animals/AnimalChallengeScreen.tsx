import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {AnimalQuizEngine} from '../../features/animals/presentation/components';
import {ANIMAL_QUIZZES} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalChallenge'>;

export function AnimalChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const challengeQuestions = ANIMAL_QUIZZES.challenge ?? [];

  const handleFinish = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'challenge',
      'animal_grand_challenge',
      stars,
      score,
      'Animal Champion',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'challenge',
      title: 'Grand Animal Champion 🏆',
      stars,
      score,
      totalQuestions: challengeQuestions.length,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Animal Challenge"
        subtitle="Prove you are the Grand Animal Champion!"
        emoji="🏆"
        accentColor="#EA580C"
        titleColor="#EA580C"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalQuizEngine
          questions={challengeQuestions}
          accentColor="#EA580C"
          onFinish={handleFinish}
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
