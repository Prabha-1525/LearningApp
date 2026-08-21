import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DrawingCanvas,
  DrawingHeader,
} from '../../features/drawing/presentation/components';
import {SIMPLE_OBJECT_DRAWING_DATA} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'ObjectDrawing'>;

export function ObjectDrawingScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentObj =
    SIMPLE_OBJECT_DRAWING_DATA[selectedIdx] ?? SIMPLE_OBJECT_DRAWING_DATA[0]!;

  const handleSaveSuccess = () => {
    recordDrawingLessonResult(
      'draw_objects',
      `obj_${currentObj.id}`,
      3,
      100,
      currentObj.title,
    );
  };

  return (
    <AppSafeAreaView>
      <DrawingHeader
        title="Draw Simple Objects"
        subtitle="Combine shapes to draw real world items!"
        emoji="🐾"
        accentColor="#14B8A6"
        showGalleryBtn={true}
        onGalleryPress={() => navigation.navigate('MyGallery')}
      />

      {/* Object Selector Scroller */}
      <View style={styles.pickerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickerScroll}>
          {SIMPLE_OBJECT_DRAWING_DATA.map((obj, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <Pressable
                key={obj.id}
                accessibilityRole="button"
                accessibilityLabel={obj.title}
                onPress={() => setSelectedIdx(idx)}
                style={[styles.objPill, isSelected && styles.objPillActive]}>
                <Text style={styles.objEmoji}>{obj.emoji}</Text>
                <Text
                  style={[
                    styles.objPillText,
                    isSelected && styles.objPillTextActive,
                  ]}>
                  {obj.title.replace('How to Draw a ', '')}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Instruction Card */}
        <View style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <Text style={styles.objMainEmoji}>{currentObj.emoji}</Text>
            <View style={styles.guideTitleCol}>
              <Text style={styles.guideTitle}>{currentObj.title}</Text>
              <Text style={styles.baseShapeText}>
                Base Shapes: {currentObj.baseShape}
              </Text>
            </View>
          </View>

          <View style={styles.stepsBox}>
            {currentObj.instructions.map((step, sIdx) => (
              <View key={sIdx} style={styles.stepRow}>
                <View style={styles.stepNumCircle}>
                  <Text style={styles.stepNumText}>{sIdx + 1}</Text>
                </View>
                <Text style={styles.stepDesc}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interactive Drawing Canvas */}
        <DrawingCanvas
          initialTitle={`My ${currentObj.title.replace('How to Draw a ', '')}`}
          categoryType="free_drawing"
          onSaveSuccess={handleSaveSuccess}
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
  objPill: {
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
  objPillActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#14B8A6',
  },
  objEmoji: {
    fontSize: 18,
  },
  objPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  objPillTextActive: {
    color: '#0F766E',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CCFBF1',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  objMainEmoji: {
    fontSize: 44,
  },
  guideTitleCol: {
    flex: 1,
    gap: 2,
  },
  guideTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
  },
  baseShapeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  stepsBox: {
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
  },
});
