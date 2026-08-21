import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  ColorCard,
  DrawingQuizEngine,
} from '../../features/drawing/presentation/components';
import {
  COLORS_DATA,
  SUBMODULE_QUIZZES,
} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'Colors'>;

export function LearnColorsScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentColor = COLORS_DATA[selectedIdx] ?? COLORS_DATA[0]!;
  const quizQuestions = SUBMODULE_QUIZZES.colors ?? [];

  const handleFinishQuiz = (score: number, stars: number) => {
    recordDrawingLessonResult(
      'colors',
      'learn_colors_intro',
      stars,
      score,
      currentColor.name,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'colors',
      title: 'Color Explorer Master',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'color_match',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Learn Colors"
        subtitle="Explore basic and blend colors!"
        emoji="🎨"
        accentColor="#EF4444"
        titleColor="#EF4444"
      />

      {/* Mode Switcher */}
      <View style={styles.modeRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Learn mode"
          onPress={() => setMode('learn')}
          style={[styles.modeBtn, mode === 'learn' && styles.modeBtnActive]}>
          <Text
            style={[
              styles.modeBtnText,
              mode === 'learn' && styles.modeBtnTextActive,
            ]}>
            🎨 Explore Colors
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quiz mode"
          onPress={() => setMode('quiz')}
          style={[styles.modeBtn, mode === 'quiz' && styles.modeBtnActive]}>
          <Text
            style={[
              styles.modeBtnText,
              mode === 'quiz' && styles.modeBtnTextActive,
            ]}>
            ⭐ Mini Quiz
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {mode === 'learn' ? (
          <>
            {/* Color Swatch Scroller */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorPillsScroll}>
              {COLORS_DATA.map((color, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <Pressable
                    key={color.id}
                    accessibilityRole="button"
                    accessibilityLabel={color.name}
                    onPress={() => setSelectedIdx(idx)}
                    style={[
                      styles.colorPill,
                      isSelected && {
                        borderColor: color.hex,
                        backgroundColor: color.lightHex,
                      },
                    ]}>
                    <View
                      style={[styles.pillDot, {backgroundColor: color.hex}]}
                    />
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && [
                          styles.pillTextSelected,
                          {color: color.darkHex},
                        ],
                      ]}>
                      {color.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Main Interactive Card */}
            <ColorCard color={currentColor} />

            {/* Quiz Transition CTA */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Test color skills"
              onPress={() => setMode('quiz')}
              style={styles.quizCtaBtn}>
              <Text style={styles.quizCtaText}>Test My Color Skills ⭐</Text>
            </Pressable>
          </>
        ) : (
          <DrawingQuizEngine
            questions={quizQuestions}
            accentColor="#EF4444"
            onFinish={handleFinishQuiz}
          />
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  modeBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  modeBtnTextActive: {
    color: '#B91C1C',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  colorPillsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  colorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pillDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  pillTextSelected: {
    fontWeight: '900',
  },
  quizCtaBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  quizCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
