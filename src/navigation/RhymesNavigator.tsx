import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  GuessSoundScreen,
  InstrumentsScreen,
  MelodyPianoScreen,
  MusicCompleteScreen,
  MusicHomeScreen,
  MusicPatternsScreen,
  MusicQuizScreen,
  RhythmGameScreen,
} from '@screens/rhymes';
import type {RhymesStackParamList} from './rhymesTypes';

const Stack = createNativeStackNavigator<RhymesStackParamList>();

export function RhymesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={MusicHomeScreen} />
      <Stack.Screen name="Instruments" component={InstrumentsScreen} />
      <Stack.Screen name="RhythmGame" component={RhythmGameScreen} />
      <Stack.Screen name="GuessSound" component={GuessSoundScreen} />
      <Stack.Screen name="MusicPatterns" component={MusicPatternsScreen} />
      <Stack.Screen name="MelodyPiano" component={MelodyPianoScreen} />
      <Stack.Screen name="MusicQuiz" component={MusicQuizScreen} />
      <Stack.Screen name="MusicComplete" component={MusicCompleteScreen} />
    </Stack.Navigator>
  );
}
