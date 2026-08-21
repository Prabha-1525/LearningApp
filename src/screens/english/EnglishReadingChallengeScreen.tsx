import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {EnglishQuizEngine} from '../../features/english/presentation/components';
import {SUBMODULE_QUIZZES} from '../../features/english/domain/catalog/englishData';
import {
  recordEnglishLessonResult,
  recordReadingChallengeScore,
} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'ReadingChallenge'>;

export function EnglishReadingChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const questions = SUBMODULE_QUIZZES.reading_challenge ?? [];

  const handleFinish = (score: number, stars: number) => {
    recordReadingChallengeScore(score);
    recordEnglishLessonResult(
      'reading_challenge',
      'reading_challenge_final',
      stars,
      score,
    );

    navigation.navigate('LessonComplete', {
      subModuleId: 'reading_challenge',
      title: 'Grand Reading Champion',
      stars,
      score,
      totalQuestions: questions.length,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="My First Reading Challenge"
        subtitle="Prove your reading superpowers!"
        emoji="🏆"
        accentColor="#EA580C"
        titleColor="#EA580C"
      />

      <EnglishQuizEngine
        questions={questions}
        accentColor="#EA580C"
        onFinish={handleFinish}
      />
    </AppSafeAreaView>
  );
}
