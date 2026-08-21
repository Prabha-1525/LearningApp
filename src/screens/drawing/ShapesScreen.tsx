import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DrawingCanvas,
  DrawingHeader,
  DrawingQuizEngine,
  ShapeGuideCard,
} from '../../features/drawing/presentation/components';
import {
  SHAPES_DATA,
  SUBMODULE_QUIZZES,
} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'Shapes'>;

export function ShapesScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedShapeIdx, setSelectedShapeIdx] = useState(0);
  const [tab, setTab] = useState<'learn' | 'draw' | 'quiz'>('learn');

  const currentShape = SHAPES_DATA[selectedShapeIdx] ?? SHAPES_DATA[0]!;
  const quizQuestions = SUBMODULE_QUIZZES.shapes ?? [];

  const handleStartDrawing = () => {
    setTab('draw');
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordDrawingLessonResult(
      'shapes',
      'shapes_mastery_quiz',
      stars,
      score,
      currentShape.name,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'shapes',
      title: 'Shape Artist Graduate',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'draw_objects',
    });
  };

  return (
    <AppSafeAreaView>
      <DrawingHeader
        title="Basic Shapes"
        subtitle="Learn, trace, and draw 6 basic shapes!"
        emoji="🔷"
        accentColor="#F59E0B"
      />

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Learn Shapes"
          onPress={() => setTab('learn')}
          style={[styles.tabBtn, tab === 'learn' && styles.tabBtnActive]}>
          <Text
            style={[styles.tabText, tab === 'learn' && styles.tabTextActive]}>
            🔷 Learn
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Draw Shapes"
          onPress={() => setTab('draw')}
          style={[styles.tabBtn, tab === 'draw' && styles.tabBtnActive]}>
          <Text
            style={[styles.tabText, tab === 'draw' && styles.tabTextActive]}>
            ✏️ Draw
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Shapes Quiz"
          onPress={() => setTab('quiz')}
          style={[styles.tabBtn, tab === 'quiz' && styles.tabBtnActive]}>
          <Text
            style={[styles.tabText, tab === 'quiz' && styles.tabTextActive]}>
            ⭐ Quiz
          </Text>
        </Pressable>
      </View>

      {/* Shapes Picker Scroller */}
      {tab !== 'quiz' && (
        <View style={styles.pickerWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pickerScroll}>
            {SHAPES_DATA.map((shape, idx) => {
              const isSelected = idx === selectedShapeIdx;
              return (
                <Pressable
                  key={shape.id}
                  accessibilityRole="button"
                  accessibilityLabel={shape.name}
                  onPress={() => setSelectedShapeIdx(idx)}
                  style={[
                    styles.shapePill,
                    isSelected && [
                      styles.shapePillSelected,
                      {borderColor: shape.color},
                    ],
                  ]}>
                  <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
                  <Text
                    style={[
                      styles.shapePillText,
                      isSelected && [
                        styles.shapePillTextSelected,
                        {color: shape.color},
                      ],
                    ]}>
                    {shape.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {tab === 'learn' ? (
          <ShapeGuideCard
            shape={currentShape}
            onStartDrawing={handleStartDrawing}
          />
        ) : tab === 'draw' ? (
          <View style={styles.drawWrap}>
            <View style={styles.shapeTargetHeader}>
              <Text style={styles.drawPrompt}>
                Draw a {currentShape.emoji} {currentShape.name}:
              </Text>
            </View>
            <DrawingCanvas
              initialTitle={`My ${currentShape.name}`}
              categoryType="free_drawing"
            />
          </View>
        ) : (
          <DrawingQuizEngine
            questions={quizQuestions}
            accentColor="#F59E0B"
            onFinish={handleFinishQuiz}
          />
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  tabBtnActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#B45309',
  },
  pickerWrapper: {
    paddingBottom: 6,
  },
  pickerScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  shapePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  shapePillSelected: {
    backgroundColor: '#FFFBEB',
  },
  shapeEmoji: {
    fontSize: 18,
  },
  shapePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  shapePillTextSelected: {
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  drawWrap: {
    gap: 10,
    alignItems: 'center',
  },
  shapeTargetHeader: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  drawPrompt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
});
