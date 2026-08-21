import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapeComparatorBoard,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {SHAPE_COMPARISON_ITEMS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeCompare'>;

export function ShapeCompareScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordShapeLessonResult(
      'compare',
      'compare_shapes_quiz',
      stars,
      score,
      'Shape Comparisons',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'compare',
      title: 'Shape Comparison Master',
      stars,
      score,
      totalQuestions: SHAPE_COMPARISON_ITEMS.length,
      nextSubModuleId: 'around_us',
    });
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Compare Shapes"
        subtitle="Which shape has more sides or corners?"
        emoji="⚖️"
        accentColor="#0EA5E9"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapeComparatorBoard
          items={SHAPE_COMPARISON_ITEMS}
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
