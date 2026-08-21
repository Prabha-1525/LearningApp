import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapeSorterBoard,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {SHAPE_SORTING_LEVELS} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeSorting'>;

export function ShapeSortingScreen() {
  const navigation = useNavigation<Nav>();
  const [levelIdx, setLevelIdx] = useState(0);

  const currentLevel =
    SHAPE_SORTING_LEVELS[levelIdx] ?? SHAPE_SORTING_LEVELS[0]!;

  const handleCompleteLevel = (score: number, stars: number) => {
    recordShapeLessonResult(
      'sorting',
      `sorting_lvl_${currentLevel.levelNumber}`,
      stars,
      score,
      `Level ${currentLevel.levelNumber}`,
    );

    if (levelIdx < SHAPE_SORTING_LEVELS.length - 1) {
      setLevelIdx(prev => prev + 1);
    } else {
      navigation.navigate('LessonComplete', {
        subModuleId: 'sorting',
        title: 'Shape Sorter Star',
        stars: 3,
        score: SHAPE_SORTING_LEVELS.length,
        totalQuestions: SHAPE_SORTING_LEVELS.length,
        nextSubModuleId: 'compare',
      });
    }
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Sort Shapes"
        subtitle="Put each shape into its matching box!"
        emoji="📦"
        accentColor="#F59E0B"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapeSorterBoard
          level={currentLevel}
          onCompleteLevel={handleCompleteLevel}
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
