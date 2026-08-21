import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ShapeCard,
  ShapeQuizEngine,
  ShapesHeader,
} from '../../features/shapes/presentation/components';
import {
  SHAPES_DATA,
  SUBMODULE_QUIZZES,
} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'LearnShapes'>;

export function LearnShapesScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentShape = SHAPES_DATA[selectedIdx] ?? SHAPES_DATA[0]!;
  const quizQuestions = SUBMODULE_QUIZZES.learn_shapes ?? [];

  const handleNextShape = () => {
    if (selectedIdx < SHAPES_DATA.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      setMode('quiz');
    }
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordShapeLessonResult(
      'learn_shapes',
      'learn_shapes_intro',
      stars,
      score,
      currentShape.name,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'learn_shapes',
      title: 'Shape Explorer Master',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'recognition',
    });
  };

  return (
    <AppSafeAreaView>
      <ShapesHeader
        title="Learn Shapes"
        subtitle="Explore shapes, sides, and corners!"
        emoji="🔍"
        accentColor="#3B82F6"
      />

      {/* Mode Switcher */}
      <View style={styles.modeTabs}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Explore shapes mode"
          onPress={() => setMode('learn')}
          style={[styles.modeTab, mode === 'learn' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'learn' && styles.modeTabTextActive,
            ]}>
            🔍 Explore Shapes
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Shape quiz mode"
          onPress={() => setMode('quiz')}
          style={[styles.modeTab, mode === 'quiz' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'quiz' && styles.modeTabTextActive,
            ]}>
            🎯 Shape Quiz
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {mode === 'learn' ? (
          <>
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

            <ShapeCard shape={currentShape} onNext={handleNextShape} />
          </>
        ) : (
          <ShapeQuizEngine
            questions={quizQuestions}
            accentColor="#3B82F6"
            onFinish={handleFinishQuiz}
          />
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  modeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  modeTabTextActive: {
    color: '#2563EB',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  selectorScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
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
});
