import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapeQuizEngine,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {SUBMODULE_QUIZZES} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeChallenge'>;

export function ShapeChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const challengeQuestions = SUBMODULE_QUIZZES.challenge ?? [];

  const handleFinish = (score: number, stars: number) => {
    recordShapeLessonResult(
      'challenge',
      'shape_grand_challenge',
      stars,
      score,
      'Shape Champion',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'challenge',
      title: 'Grand Shape Champion 🏆',
      stars,
      score,
      totalQuestions: challengeQuestions.length,
    });
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Shape Challenge"
        subtitle="Prove you are the Grand Shape Champion!"
        emoji="🏆"
        accentColor="#EA580C"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapeQuizEngine
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
