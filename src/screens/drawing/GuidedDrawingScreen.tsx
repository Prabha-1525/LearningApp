import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DrawingHeader,
  GuidedDrawingStepper,
} from '../../features/drawing/presentation/components';
import {GUIDED_DRAWING_LESSONS} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'GuidedDrawing'>;

export function GuidedDrawingScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentLesson =
    GUIDED_DRAWING_LESSONS[selectedIdx] ?? GUIDED_DRAWING_LESSONS[0]!;

  const handleCompleteLesson = () => {
    recordDrawingLessonResult(
      'guided_drawing',
      `guided_${currentLesson.id}`,
      3,
      100,
      currentLesson.title,
    );
  };

  return (
    <AppSafeAreaView>
      <DrawingHeader
        title="Guided Drawing"
        subtitle="Follow along step-by-step to draw fun pictures!"
        emoji="🧑‍🎨"
        accentColor="#6366F1"
        showGalleryBtn={true}
        onGalleryPress={() => navigation.navigate('MyGallery')}
      />

      {/* Lesson Selector */}
      <View style={styles.pickerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickerScroll}>
          {GUIDED_DRAWING_LESSONS.map((lesson, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={lesson.title}
                onPress={() => setSelectedIdx(idx)}
                style={[
                  styles.lessonPill,
                  isSelected && styles.lessonPillActive,
                ]}>
                <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
                <Text
                  style={[
                    styles.lessonPillText,
                    isSelected && styles.lessonPillTextActive,
                  ]}>
                  {lesson.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <GuidedDrawingStepper
          key={currentLesson.id}
          lesson={currentLesson}
          onCompleteLesson={handleCompleteLesson}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  pickerWrapper: {
    paddingBottom: 6,
  },
  pickerScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  lessonPill: {
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
  lessonPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  lessonEmoji: {
    fontSize: 18,
  },
  lessonPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  lessonPillTextActive: {
    color: '#4338CA',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
