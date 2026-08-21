import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DrawingCanvas,
  DrawingHeader,
} from '../../features/drawing/presentation/components';
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
      <DrawingHeader
        title="Free Drawing"
        subtitle="Draw anything you can imagine!"
        emoji="🖼️"
        accentColor="#0EA5E9"
        showGalleryBtn={true}
        onGalleryPress={() => navigation.navigate('MyGallery')}
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
