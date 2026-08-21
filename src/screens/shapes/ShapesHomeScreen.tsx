import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapesHeader,
  ShapesProgressTracker,
  ShapeSubModuleCard,
} from '../../features/shapes/presentation/components';
import {SHAPES_SUB_MODULES} from '../../features/shapes/domain/catalog/shapesData';
import {
  isShapeSubModuleUnlocked,
  readShapesProgress,
} from '../../features/shapes/data/progress/shapesProgress';
import type {
  ShapesProgress,
  ShapeSubModuleConfig,
} from '../../features/shapes/domain/entities/shapeEntities';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapesHome'>;

export function ShapesHomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<ShapesProgress>(
    readShapesProgress(),
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(readShapesProgress());
    }, []),
  );

  const handleOpenSubModule = (config: ShapeSubModuleConfig) => {
    switch (config.id) {
      case 'learn_shapes':
        navigation.navigate('LearnShapes');
        break;
      case 'recognition':
        navigation.navigate('ShapeRecognition');
        break;
      case 'matching':
        navigation.navigate('ShapeMatching');
        break;
      case 'properties':
        navigation.navigate('ShapeProperties');
        break;
      case 'sorting':
        navigation.navigate('ShapeSorting');
        break;
      case 'compare':
        navigation.navigate('ShapeCompare');
        break;
      case 'around_us':
        navigation.navigate('ShapesAroundUs');
        break;
      case 'count':
        navigation.navigate('ShapeCount');
        break;
      case 'patterns':
        navigation.navigate('ShapePatterns');
        break;
      case 'puzzles':
        navigation.navigate('ShapePuzzles');
        break;
      case 'challenge':
        navigation.navigate('ShapeChallenge');
        break;
    }
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Shapes"
        subtitle="Let's explore shapes!"
        emoji="🔷"
        accentColor="#3B82F6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Overall Progress Tracker */}
        <ShapesProgressTracker progress={progress} />

        {/* SubModules Grid */}
        <View style={styles.grid}>
          {SHAPES_SUB_MODULES.map(config => {
            const isUnlocked = isShapeSubModuleUnlocked(config.id, progress);
            const isCompleted = progress.completedSubModules.includes(
              config.id,
            );
            const lesson = progress.lessonsProgress[config.id];
            const stars = lesson?.stars ?? 0;

            return (
              <ShapeSubModuleCard
                key={config.id}
                config={config}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                stars={stars}
                onPress={() => handleOpenSubModule(config)}
              />
            );
          })}
        </View>
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
  grid: {
    gap: 12,
  },
});
