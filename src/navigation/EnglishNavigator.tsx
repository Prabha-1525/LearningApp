import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  EnglishAlphabetScreen,
  EnglishBlendingScreen,
  EnglishCVCWordsScreen,
  EnglishHomeScreen,
  EnglishLessonCompleteScreen,
  EnglishLetterMatchScreen,
  EnglishLetterObjectsScreen,
  EnglishPhonicsScreen,
  EnglishReadingChallengeScreen,
  EnglishReadingScreen,
  EnglishSightWordsScreen,
  EnglishSoundsScreen,
  EnglishStoryScreen,
  EnglishTongueTwisterScreen,
  EnglishWordBuilderScreen,
} from '@screens/english';
import type {EnglishStackParamList} from './englishTypes';

const Stack = createNativeStackNavigator<EnglishStackParamList>();

export function EnglishNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={EnglishHomeScreen} />
      <Stack.Screen name="Alphabet" component={EnglishAlphabetScreen} />
      <Stack.Screen name="CapitalSmall" component={EnglishLetterMatchScreen} />
      <Stack.Screen name="LetterSounds" component={EnglishSoundsScreen} />
      <Stack.Screen
        name="LetterObjects"
        component={EnglishLetterObjectsScreen}
      />
      <Stack.Screen name="Phonics" component={EnglishPhonicsScreen} />
      <Stack.Screen name="SoundBlending" component={EnglishBlendingScreen} />
      <Stack.Screen name="WordBuilding" component={EnglishWordBuilderScreen} />
      <Stack.Screen name="CVCWords" component={EnglishCVCWordsScreen} />
      <Stack.Screen name="SightWords" component={EnglishSightWordsScreen} />
      <Stack.Screen
        name="TongueTwisters"
        component={EnglishTongueTwisterScreen}
      />
      <Stack.Screen name="SentenceReading" component={EnglishReadingScreen} />
      <Stack.Screen name="ShortStories" component={EnglishStoryScreen} />
      <Stack.Screen
        name="ReadingChallenge"
        component={EnglishReadingChallengeScreen}
      />
      <Stack.Screen
        name="LessonComplete"
        component={EnglishLessonCompleteScreen}
      />
    </Stack.Navigator>
  );
}
