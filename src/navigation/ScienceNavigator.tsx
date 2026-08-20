import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ScienceHomeScreen,
  PlantsLessonScreen,
  HumanBodyLessonScreen,
  AnimalsLessonScreen,
  SpaceLessonScreen,
  WeatherLessonScreen,
  WaterEarthLessonScreen,
  ExperimentsScreen,
  ScienceQuizScreen,
  ScienceCompleteScreen,
} from '@screens/science';

import type {ScienceStackParamList} from './scienceTypes';

const Stack = createNativeStackNavigator<ScienceStackParamList>();

export function ScienceNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#F0FDF4'},
      }}>
      <Stack.Screen name="Home" component={ScienceHomeScreen} />
      <Stack.Screen name="PlantsLesson" component={PlantsLessonScreen} />
      <Stack.Screen name="HumanBodyLesson" component={HumanBodyLessonScreen} />
      <Stack.Screen name="AnimalsLesson" component={AnimalsLessonScreen} />
      <Stack.Screen name="SpaceLesson" component={SpaceLessonScreen} />
      <Stack.Screen name="WeatherLesson" component={WeatherLessonScreen} />
      <Stack.Screen
        name="WaterEarthLesson"
        component={WaterEarthLessonScreen}
      />
      <Stack.Screen name="Experiments" component={ExperimentsScreen} />
      <Stack.Screen name="ScienceQuiz" component={ScienceQuizScreen} />
      <Stack.Screen name="ScienceComplete" component={ScienceCompleteScreen} />
    </Stack.Navigator>
  );
}
