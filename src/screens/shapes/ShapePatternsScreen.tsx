import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ShapePatternBoard} from '../../features/shapes/presentation/components';
import {SHAPE_PATTERNS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapePatterns'>;

export function ShapePatternsScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordShapeLessonResult(
      'patterns',
      'shape_patterns_quiz',
      stars,
      score,
      'Shape Patterns',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'patterns',
      title: 'Shape Pattern Master',
      stars,
      score,
      totalQuestions: SHAPE_PATTERNS.length,
      nextSubModuleId: 'puzzles',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Shape Patterns"
        subtitle="Complete the repeating shape patterns!"
        emoji="🔄"
        accentColor="#F97316"
        titleColor="#F97316"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapePatternBoard items={SHAPE_PATTERNS} onComplete={handleComplete} />
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
