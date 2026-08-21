import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {DrawingCanvas} from '../../features/drawing/presentation/components';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'FreeDrawing'>;

export function FreeDrawingScreen() {
  const navigation = useNavigation<Nav>();

  const handleSaveSuccess = () => {
    recordDrawingLessonResult('free_drawing', `free_${Date.now()}`, 3, 100);
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Free Drawing"
        subtitle="Draw anything you can imagine!"
        emoji="🖼️"
        accentColor="#0EA5E9"
        titleColor="#0EA5E9"
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <DrawingCanvas
          initialTitle="My Free Drawing"
          categoryType="free_drawing"
          onSaveSuccess={handleSaveSuccess}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
