import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapePropertiesViewer,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {SHAPES_DATA} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapeProperties'>;

export function ShapePropertiesScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentShape = SHAPES_DATA[selectedIdx] ?? SHAPES_DATA[0]!;

  const handleNextShape = () => {
    if (selectedIdx < SHAPES_DATA.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      recordShapeLessonResult(
        'properties',
        'properties_mastery',
        3,
        100,
        'Sides & Corners',
      );
      navigation.navigate('LessonComplete', {
        subModuleId: 'properties',
        title: 'Sides & Corners Master',
        stars: 3,
        score: SHAPES_DATA.length,
        totalQuestions: SHAPES_DATA.length,
        nextSubModuleId: 'sorting',
      });
    }
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Sides & Corners"
        subtitle="Count the sides and corners of each shape!"
        emoji="📐"
        accentColor="#10B981"
      />

      {/* Shape Selector Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorScroll}>
        {SHAPES_DATA.map((shape, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <Pressable
              key={shape.id}
              accessibilityRole="button"
              accessibilityLabel={shape.name}
              onPress={() => setSelectedIdx(idx)}
              style={[
                styles.shapePill,
                {backgroundColor: isSelected ? shape.color : '#FFFFFF'},
              ]}>
              <Text style={styles.shapePillEmoji}>{shape.emoji}</Text>
              <Text
                style={[
                  styles.shapePillText,
                  {color: isSelected ? '#FFFFFF' : '#374151'},
                ]}>
                {shape.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ShapePropertiesViewer shape={currentShape} onNext={handleNextShape} />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  selectorScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  shapePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  shapePillEmoji: {
    fontSize: 18,
  },
  shapePillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
});
