import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  CapitalsScreen,
  ContinentsScreen,
  CountryDetailsScreen,
  CountryListScreen,
  FlagLearningScreen,
  GeographyQuizScreen,
  LandmarksScreen,
  WorldExplorerHomeScreen,
} from '@screens/worldExplorer';

import type {WorldExplorerStackParamList} from './worldExplorerTypes';

const Stack = createNativeStackNavigator<WorldExplorerStackParamList>();

export function WorldExplorerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#F8FAFC'},
      }}>
      <Stack.Screen name="Home" component={WorldExplorerHomeScreen} />
      <Stack.Screen name="CountryList" component={CountryListScreen} />
      <Stack.Screen name="CountryDetails" component={CountryDetailsScreen} />
      <Stack.Screen name="FlagLearning" component={FlagLearningScreen} />
      <Stack.Screen name="Continents" component={ContinentsScreen} />
      <Stack.Screen name="Capitals" component={CapitalsScreen} />
      <Stack.Screen name="Landmarks" component={LandmarksScreen} />
      <Stack.Screen name="Quiz" component={GeographyQuizScreen} />
    </Stack.Navigator>
  );
}
