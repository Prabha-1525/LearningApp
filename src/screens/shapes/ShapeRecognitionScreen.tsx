import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapeRecognitionBoard,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {SHAPE_RECOGNITION_ITEMS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeRecognition'>;

export function ShapeRecognitionScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordShapeLessonResult(
      'recognition',
      'recognition_invariance',
      stars,
      score,
      'Shape Invariance',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'recognition',
      title: 'Shape Detective Star',
      stars,
      score,
      totalQuestions: SHAPE_RECOGNITION_ITEMS.length,
      nextSubModuleId: 'matching',
    });
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Find & Recognize"
        subtitle="Identify shapes even when tilted or resized!"
        emoji="👀"
        accentColor="#8B5CF6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapeRecognitionBoard
          items={SHAPE_RECOGNITION_ITEMS}
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
