import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {TracingCanvas} from '../../features/drawing/presentation/components';
import {TRACING_PATHS} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'Trace'>;

export function TraceScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedPathIdx, setSelectedPathIdx] = useState(0);

  const currentPath = TRACING_PATHS[selectedPathIdx] ?? TRACING_PATHS[0]!;

  const handleFinishPath = () => {
    recordDrawingLessonResult(
      'trace',
      `trace_${currentPath.id}`,
      3,
      100,
      currentPath.id,
    );
  };

  const handleNextPath = () => {
    if (selectedPathIdx < TRACING_PATHS.length - 1) {
      setSelectedPathIdx(prev => prev + 1);
    } else {
      navigation.navigate('LessonComplete', {
        subModuleId: 'trace',
        title: 'Master Line Tracer',
        stars: 3,
        score: TRACING_PATHS.length,
        totalQuestions: TRACING_PATHS.length,
        nextSubModuleId: 'shapes',
      });
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Trace & Draw"
        subtitle="Follow the dotted paths with your finger!"
        emoji="✏️"
        accentColor="#10B981"
        titleColor="#10B981"
      />

      {/* Path Selector */}
      <View style={styles.pickerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickerScroll}>
          {TRACING_PATHS.map((p, idx) => {
            const isSelected = idx === selectedPathIdx;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityLabel={p.title}
                onPress={() => setSelectedPathIdx(idx)}
                style={[styles.pathPill, isSelected && styles.pathPillActive]}>
                <Text style={styles.pathEmoji}>{p.emoji}</Text>
                <Text
                  style={[
                    styles.pathPillText,
                    isSelected && styles.pathPillTextActive,
                  ]}>
                  {p.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <TracingCanvas
          key={currentPath.id}
          pathItem={currentPath}
          onFinishPath={handleFinishPath}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next tracing path"
          onPress={handleNextPath}
          style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {selectedPathIdx === TRACING_PATHS.length - 1
              ? 'Complete Tracing Practice ⭐'
              : 'Next Tracing Path ➔'}
          </Text>
        </Pressable>
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
  pathPill: {
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
  pathPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  pathEmoji: {
    fontSize: 18,
  },
  pathPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  pathPillTextActive: {
    color: '#047857',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  nextBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
