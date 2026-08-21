import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ColorMatchingGame} from '../../features/drawing/presentation/components';
import {COLOR_MATCHING_ITEMS} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'ColorMatch'>;

export function ColorMatchScreen() {
  const navigation = useNavigation<Nav>();

  const handleFinish = (score: number, stars: number) => {
    recordDrawingLessonResult(
      'color_match',
      'color_matching_mastery',
      stars,
      score,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'color_match',
      title: 'Color Match Superstar',
      stars,
      score,
      totalQuestions: COLOR_MATCHING_ITEMS.length,
      nextSubModuleId: 'color_mix',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Color Matching"
        subtitle="Match familiar objects with their colors!"
        emoji="🌈"
        accentColor="#3B82F6"
        titleColor="#3B82F6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ColorMatchingGame
          items={COLOR_MATCHING_ITEMS}
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
  },
});
