import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {PhonicsStackParamList} from './phonicsTypes';
import {
  BeginningSoundsScreen,
  CVCWordsScreen,
  EndingSoundsScreen,
  HearChooseWordScreen,
  LetterMatchingScreen,
  LetterSoundsScreen,
  PhonicsChallengeScreen,
  PhonicsGamesScreen,
  PhonicsHomeScreen,
  PhonicsLessonCompleteScreen,
  PictureToWordScreen,
  ReadSentencesScreen,
  ReadWordsScreen,
  SlowBlendingScreen,
  SoundRecognitionScreen,
  WordBuilderScreen,
  WordFamiliesScreen,
  WordTransformScreen,
} from '../screens/phonics';

const Stack = createNativeStackNavigator<PhonicsStackParamList>();

export function PhonicsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="PhonicsHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="PhonicsHome" component={PhonicsHomeScreen} />
      <Stack.Screen name="LetterSounds" component={LetterSoundsScreen} />
      <Stack.Screen
        name="SoundRecognition"
        component={SoundRecognitionScreen}
      />
      <Stack.Screen name="LetterMatching" component={LetterMatchingScreen} />
      <Stack.Screen name="BeginningSounds" component={BeginningSoundsScreen} />
      <Stack.Screen name="EndingSounds" component={EndingSoundsScreen} />
      <Stack.Screen name="SlowBlending" component={SlowBlendingScreen} />
      <Stack.Screen name="CVCWords" component={CVCWordsScreen} />
      <Stack.Screen name="WordBuilder" component={WordBuilderScreen} />
      <Stack.Screen name="WordFamilies" component={WordFamiliesScreen} />
      <Stack.Screen name="WordTransform" component={WordTransformScreen} />
      <Stack.Screen name="HearChooseWord" component={HearChooseWordScreen} />
      <Stack.Screen name="PictureToWord" component={PictureToWordScreen} />
      <Stack.Screen name="ReadWords" component={ReadWordsScreen} />
      <Stack.Screen name="ReadSentences" component={ReadSentencesScreen} />
      <Stack.Screen name="PhonicsGames" component={PhonicsGamesScreen} />
      <Stack.Screen
        name="PhonicsChallenge"
        component={PhonicsChallengeScreen}
      />
      <Stack.Screen
        name="PhonicsLessonComplete"
        component={PhonicsLessonCompleteScreen}
      />
    </Stack.Navigator>
  );
}
