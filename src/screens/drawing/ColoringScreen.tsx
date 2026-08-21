import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ColoringCanvas} from '../../features/drawing/presentation/components';
import {COLORING_PAGES} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'Coloring'>;

export function ColoringScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);

  const currentPage = COLORING_PAGES[selectedPageIdx] ?? COLORING_PAGES[0]!;

  const handleComplete = (pageId: string) => {
    recordDrawingLessonResult('coloring', `coloring_${pageId}`, 3, 100, pageId);
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Object Coloring"
        subtitle="Tap to color each region any way you like!"
        emoji="🖍️"
        accentColor="#EC4899"
        titleColor="#EC4899"
        rightElement={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="My Gallery"
            onPress={() => navigation.navigate('MyGallery')}
            style={styles.galleryBtn}>
            <Text style={styles.galleryBtnText}>🖼️</Text>
          </Pressable>
        }
      />

      {/* Coloring Pages Picker Scroll */}
      <View style={styles.pagesPickerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pagesPickerScroll}>
          {COLORING_PAGES.map((page, idx) => {
            const isSelected = idx === selectedPageIdx;
            return (
              <Pressable
                key={page.id}
                accessibilityRole="button"
                accessibilityLabel={page.title}
                onPress={() => setSelectedPageIdx(idx)}
                style={[styles.pagePill, isSelected && styles.pagePillActive]}>
                <Text style={styles.pageEmoji}>{page.emoji}</Text>
                <Text
                  style={[
                    styles.pagePillText,
                    isSelected && styles.pagePillTextActive,
                  ]}>
                  {page.title.replace('Color the ', '')}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ColoringCanvas page={currentPage} onComplete={handleComplete} />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  pagesPickerWrapper: {
    paddingBottom: 6,
  },
  pagesPickerScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  pagePill: {
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
  pagePillActive: {
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
  },
  pageEmoji: {
    fontSize: 18,
  },
  pagePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  pagePillTextActive: {
    color: '#BE185D',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
