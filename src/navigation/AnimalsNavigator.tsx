import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AnimalsStackParamList} from './animalsTypes';
import {
  AmphibiansReptilesScreen,
  AnimalBabiesScreen,
  AnimalChallengeScreen,
  AnimalClassificationScreen,
  AnimalCountScreen,
  AnimalDietsScreen,
  AnimalHabitatsScreen,
  AnimalLessonCompleteScreen,
  AnimalMatchingScreen,
  AnimalPatternsScreen,
  AnimalPuzzlesScreen,
  AnimalsHomeScreen,
  AnimalSoundsScreen,
  BirdsScreen,
  InsectsScreen,
  LandAnimalsScreen,
  MeetAnimalsScreen,
  SeaAnimalsScreen,
} from '../screens/animals';

const Stack = createNativeStackNavigator<AnimalsStackParamList>();

export function AnimalsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AnimalsHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="AnimalsHome" component={AnimalsHomeScreen} />
      <Stack.Screen name="MeetAnimals" component={MeetAnimalsScreen} />
      <Stack.Screen name="LandAnimals" component={LandAnimalsScreen} />
      <Stack.Screen name="AnimalSounds" component={AnimalSoundsScreen} />
      <Stack.Screen name="AnimalHabitats" component={AnimalHabitatsScreen} />
      <Stack.Screen name="AnimalDiets" component={AnimalDietsScreen} />
      <Stack.Screen name="Birds" component={BirdsScreen} />
      <Stack.Screen name="SeaAnimals" component={SeaAnimalsScreen} />
      <Stack.Screen
        name="AmphibiansReptiles"
        component={AmphibiansReptilesScreen}
      />
      <Stack.Screen name="Insects" component={InsectsScreen} />
      <Stack.Screen name="AnimalBabies" component={AnimalBabiesScreen} />
      <Stack.Screen name="AnimalMatching" component={AnimalMatchingScreen} />
      <Stack.Screen
        name="AnimalClassification"
        component={AnimalClassificationScreen}
      />
      <Stack.Screen name="AnimalCount" component={AnimalCountScreen} />
      <Stack.Screen name="AnimalPatterns" component={AnimalPatternsScreen} />
      <Stack.Screen name="AnimalPuzzles" component={AnimalPuzzlesScreen} />
      <Stack.Screen name="AnimalChallenge" component={AnimalChallengeScreen} />
      <Stack.Screen
        name="LessonComplete"
        component={AnimalLessonCompleteScreen}
      />
    </Stack.Navigator>
  );
}
