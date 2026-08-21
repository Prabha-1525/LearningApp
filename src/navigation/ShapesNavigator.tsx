import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ShapesStackParamList} from './shapesTypes';
import {
  LearnShapesScreen,
  ShapeChallengeScreen,
  ShapeCompareScreen,
  ShapeCountScreen,
  ShapeLessonCompleteScreen,
  ShapeMatchingScreen,
  ShapePatternsScreen,
  ShapePropertiesScreen,
  ShapePuzzlesScreen,
  ShapeRecognitionScreen,
  ShapesAroundUsScreen,
  ShapesHomeScreen,
  ShapeSortingScreen,
} from '../screens/shapes';

const Stack = createNativeStackNavigator<ShapesStackParamList>();

export function ShapesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ShapesHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="ShapesHome" component={ShapesHomeScreen} />
      <Stack.Screen name="LearnShapes" component={LearnShapesScreen} />
      <Stack.Screen
        name="ShapeRecognition"
        component={ShapeRecognitionScreen}
      />
      <Stack.Screen name="ShapeMatching" component={ShapeMatchingScreen} />
      <Stack.Screen name="ShapeProperties" component={ShapePropertiesScreen} />
      <Stack.Screen name="ShapeSorting" component={ShapeSortingScreen} />
      <Stack.Screen name="ShapeCompare" component={ShapeCompareScreen} />
      <Stack.Screen name="ShapesAroundUs" component={ShapesAroundUsScreen} />
      <Stack.Screen name="ShapeCount" component={ShapeCountScreen} />
      <Stack.Screen name="ShapePatterns" component={ShapePatternsScreen} />
      <Stack.Screen name="ShapePuzzles" component={ShapePuzzlesScreen} />
      <Stack.Screen name="ShapeChallenge" component={ShapeChallengeScreen} />
      <Stack.Screen
        name="LessonComplete"
        component={ShapeLessonCompleteScreen}
      />
    </Stack.Navigator>
  );
}
