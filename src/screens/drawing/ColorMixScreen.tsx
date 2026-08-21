import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ColorMixingBoard,
  DrawingHeader,
  DrawingQuizEngine,
} from '../../features/drawing/presentation/components';
import {
  COLOR_MIXING_RECIPES,
  SUBMODULE_QUIZZES,
} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'ColorMix'>;

export function ColorMixScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'lab' | 'quiz'>('lab');

  const quizQuestions = SUBMODULE_QUIZZES.color_mix ?? [];

  const handleFinishLab = () => {
    recordDrawingLessonResult('color_mix', 'color_mixing_lab', 3, 100);
    setTab('quiz');
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordDrawingLessonResult('color_mix', 'color_mixing_quiz', stars, score);
    navigation.navigate('LessonComplete', {
      subModuleId: 'color_mix',
      title: 'Master Color Chemist',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'coloring',
    });
  };

  return (
    <AppSafeAreaView>
      <DrawingHeader
        title="Color Mixing"
        subtitle="Discover the magic of blending colors!"
        emoji="🧪"
        accentColor="#8B5CF6"
      />

      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mixing Lab"
          onPress={() => setTab('lab')}
          style={[styles.tabBtn, tab === 'lab' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'lab' && styles.tabTextActive]}>
            🧪 Mixing Lab
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mixing Quiz"
          onPress={() => setTab('quiz')}
          style={[styles.tabBtn, tab === 'quiz' && styles.tabBtnActive]}>
          <Text
            style={[styles.tabText, tab === 'quiz' && styles.tabTextActive]}>
            ⭐ Magic Mix Quiz
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {tab === 'lab' ? (
          <ColorMixingBoard
            recipes={COLOR_MIXING_RECIPES}
            onCompleteAll={handleFinishLab}
          />
        ) : (
          <DrawingQuizEngine
            questions={quizQuestions}
            accentColor="#8B5CF6"
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
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#6D28D9',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
