import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ShapeCounterBoard} from '../../features/shapes/presentation/components';
import {SHAPE_COUNT_ITEMS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeCount'>;

export function ShapeCountScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordShapeLessonResult(
      'count',
      'count_shapes_quiz',
      stars,
      score,
      'Shape Counting',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'count',
      title: 'Shape Counter Star',
      stars,
      score,
      totalQuestions: SHAPE_COUNT_ITEMS.length,
      nextSubModuleId: 'patterns',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Count Shapes"
        subtitle="Count the shapes on the board!"
        emoji="🔢"
        accentColor="#6366F1"
        titleColor="#6366F1"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapeCounterBoard
          items={SHAPE_COUNT_ITEMS}
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
