import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ColorMatchScreen,
  ColorMixScreen,
  ColoringScreen,
  ColorsDrawingHomeScreen,
  CreativeChallengeScreen,
  DrawingLessonCompleteScreen,
  FreeDrawingScreen,
  GuidedDrawingScreen,
  LearnColorsScreen,
  MyGalleryScreen,
  ObjectDrawingScreen,
  ShapesScreen,
  TraceScreen,
} from '@screens/drawing';
import type {DrawingStackParamList} from './drawingTypes';

const Stack = createNativeStackNavigator<DrawingStackParamList>();

export function DrawingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={ColorsDrawingHomeScreen} />
      <Stack.Screen name="Colors" component={LearnColorsScreen} />
      <Stack.Screen name="ColorMatch" component={ColorMatchScreen} />
      <Stack.Screen name="ColorMix" component={ColorMixScreen} />
      <Stack.Screen name="Coloring" component={ColoringScreen} />
      <Stack.Screen name="Trace" component={TraceScreen} />
      <Stack.Screen name="Shapes" component={ShapesScreen} />
      <Stack.Screen name="ObjectDrawing" component={ObjectDrawingScreen} />
      <Stack.Screen name="GuidedDrawing" component={GuidedDrawingScreen} />
      <Stack.Screen name="FreeDrawing" component={FreeDrawingScreen} />
      <Stack.Screen
        name="CreativeChallenge"
        component={CreativeChallengeScreen}
      />
      <Stack.Screen name="MyGallery" component={MyGalleryScreen} />
      <Stack.Screen
        name="LessonComplete"
        component={DrawingLessonCompleteScreen}
      />
    </Stack.Navigator>
  );
}
