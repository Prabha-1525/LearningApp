import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ShapesAroundUsBoard} from '../../features/shapes/presentation/components';
import {SHAPES_AROUND_US_ITEMS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapesAroundUs'>;

export function ShapesAroundUsScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordShapeLessonResult(
      'around_us',
      'around_us_objects',
      stars,
      score,
      'Real World Shapes',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'around_us',
      title: 'Real-World Shape Explorer',
      stars,
      score,
      totalQuestions: SHAPES_AROUND_US_ITEMS.length,
      nextSubModuleId: 'count',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Shapes Around Us"
        subtitle="Discover shapes in everyday real-world items!"
        emoji="🏠"
        accentColor="#14B8A6"
        titleColor="#14B8A6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapesAroundUsBoard
          items={SHAPES_AROUND_US_ITEMS}
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
