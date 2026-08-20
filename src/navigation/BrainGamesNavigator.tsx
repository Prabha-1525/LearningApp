import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  BrainGamesHomeScreen,
  FindDifferenceScreen,
  GameCompleteScreen,
  MatchingPairsScreen,
  MemoryMatchScreen,
  NumberSequenceScreen,
  OddOneOutScreen,
  PatternCompleterScreen,
  SortItScreen,
} from '@screens/brainGames';

import type {BrainGamesStackParamList} from './brainGamesTypes';

const Stack = createNativeStackNavigator<BrainGamesStackParamList>();

export function BrainGamesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#F1F5FF'},
      }}>
      <Stack.Screen name="Home" component={BrainGamesHomeScreen} />
      <Stack.Screen name="MemoryMatch" component={MemoryMatchScreen} />
      <Stack.Screen name="MatchingPairs" component={MatchingPairsScreen} />
      <Stack.Screen
        name="PatternCompleter"
        component={PatternCompleterScreen}
      />
      <Stack.Screen name="OddOneOut" component={OddOneOutScreen} />
      <Stack.Screen name="NumberSequence" component={NumberSequenceScreen} />
      <Stack.Screen name="SortIt" component={SortItScreen} />
      <Stack.Screen name="FindDifference" component={FindDifferenceScreen} />
      <Stack.Screen name="GameComplete" component={GameCompleteScreen} />
    </Stack.Navigator>
  );
}
