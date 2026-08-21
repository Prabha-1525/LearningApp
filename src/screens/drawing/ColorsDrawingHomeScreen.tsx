import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DrawingHeader,
  DrawingProgressTracker,
  DrawingSubModuleCard,
} from '../../features/drawing/presentation/components';
import {DRAWING_SUB_MODULES} from '../../features/drawing/domain/catalog/drawingData';
import {
  isDrawingSubModuleUnlocked,
  readDrawingProgress,
} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';
import type {DrawingSubModuleId} from '../../features/drawing/domain/entities/drawingEntities';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'Home'>;

export function ColorsDrawingHomeScreen() {
  const navigation = useNavigation<Nav>();
  const progress = readDrawingProgress();

  const handleOpenSubModule = (subId: DrawingSubModuleId) => {
    switch (subId) {
      case 'colors':
        navigation.navigate('Colors');
        break;
      case 'color_match':
        navigation.navigate('ColorMatch');
        break;
      case 'color_mix':
        navigation.navigate('ColorMix');
        break;
      case 'coloring':
        navigation.navigate('Coloring');
        break;
      case 'trace':
        navigation.navigate('Trace');
        break;
      case 'shapes':
        navigation.navigate('Shapes');
        break;
      case 'draw_objects':
        navigation.navigate('ObjectDrawing');
        break;
      case 'guided_drawing':
        navigation.navigate('GuidedDrawing');
        break;
      case 'free_drawing':
        navigation.navigate('FreeDrawing');
        break;
      case 'creative_challenge':
        navigation.navigate('CreativeChallenge');
        break;
      default:
        break;
    }
  };

  return (
    <AppSafeAreaView>
      <DrawingHeader
        title="Colors & Drawing"
        subtitle="Let's create something beautiful!"
        emoji="🎨"
        accentColor="#EC4899"
        showGalleryBtn={true}
        onGalleryPress={() => navigation.navigate('MyGallery')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Progress Tracker Card */}
        <DrawingProgressTracker />

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎯 Step-by-Step Learning Path</Text>
          <Text style={styles.sectionSub}>
            Colors ➔ Mixing ➔ Coloring ➔ Tracing ➔ Drawing
          </Text>
        </View>

        {/* 10 Sub-Module Cards */}
        {DRAWING_SUB_MODULES.map(config => {
          const isUnlocked = isDrawingSubModuleUnlocked(config.id, progress);
          const isCompleted = progress.completedSubModules.includes(config.id);

          return (
            <DrawingSubModuleCard
              key={config.id}
              config={config}
              isUnlocked={isUnlocked}
              starsEarned={isCompleted ? 3 : 0}
              isCompleted={isCompleted}
              onPress={() => handleOpenSubModule(config.id)}
            />
          );
        })}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionHeader: {
    marginTop: 6,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
