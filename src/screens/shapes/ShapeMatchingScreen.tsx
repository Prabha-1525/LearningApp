import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapeMatcherBoard,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {SHAPE_MATCHING_PAIRS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeMatching'>;

export function ShapeMatchingScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordShapeLessonResult(
      'matching',
      'matching_pairs',
      stars,
      score,
      'Shape Pairs',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'matching',
      title: 'Shape Matcher Star',
      stars,
      score,
      totalQuestions: SHAPE_MATCHING_PAIRS.length,
      nextSubModuleId: 'properties',
    });
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Match Shapes"
        subtitle="Match identical shapes with different colors!"
        emoji="🧩"
        accentColor="#EC4899"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapeMatcherBoard
          pairs={SHAPE_MATCHING_PAIRS}
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
