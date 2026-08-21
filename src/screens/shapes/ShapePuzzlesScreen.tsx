import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  ShapeMemoryGame,
  ShapePuzzleBoard,
} from '../../features/shapes/presentation/components';
import {
  SHAPE_MEMORY_CARDS,
  SHAPE_PUZZLES,
} from '../../features/shapes/domain/catalog/shapesData';
import {recordShapeLessonResult} from '../../features/shapes/data/progress/shapesProgress';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'ShapePuzzles'>;

export function ShapePuzzlesScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'puzzles' | 'memory'>('puzzles');

  const handleCompletePuzzles = (score: number, stars: number) => {
    recordShapeLessonResult(
      'puzzles',
      'shape_puzzles_reasoning',
      stars,
      score,
      'Visual Puzzles',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'puzzles',
      title: 'Shape Puzzle Star',
      stars,
      score,
      totalQuestions: SHAPE_PUZZLES.length,
      nextSubModuleId: 'challenge',
    });
  };

  const handleFinishMemory = (stars: number) => {
    recordShapeLessonResult(
      'puzzles',
      'shape_memory_game',
      stars,
      SHAPE_MEMORY_CARDS.length / 2,
      'Memory Game',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'puzzles',
      title: 'Shape Memory Master',
      stars,
      score: SHAPE_MEMORY_CARDS.length / 2,
      totalQuestions: SHAPE_MEMORY_CARDS.length / 2,
      nextSubModuleId: 'challenge',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Shape Puzzles"
        subtitle="Solve shape puzzles and memory challenges!"
        emoji="🧠"
        accentColor="#D946EF"
        titleColor="#D946EF"
      />

      {/* Tab Switcher */}
      <View style={styles.tabsRow}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Visual Puzzles"
          onPress={() => setTab('puzzles')}
          style={[styles.tabBtn, tab === 'puzzles' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              tab === 'puzzles' && styles.tabBtnTextActive,
            ]}>
            🧩 Visual Puzzles
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Shape Memory Game"
          onPress={() => setTab('memory')}
          style={[styles.tabBtn, tab === 'memory' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              tab === 'memory' && styles.tabBtnTextActive,
            ]}>
            🃏 Memory Match
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {tab === 'puzzles' ? (
          <ShapePuzzleBoard
            items={SHAPE_PUZZLES}
            onComplete={handleCompletePuzzles}
          />
        ) : (
          <ShapeMemoryGame
            cardDeck={SHAPE_MEMORY_CARDS}
            onFinish={handleFinishMemory}
          />
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FDF4FF',
    borderColor: '#D946EF',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#C026D3',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
});
