import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  TimeHomeScreen,
  ClockLessonScreen,
  DayPartsLessonScreen,
  DaysLessonScreen,
  MonthsLessonScreen,
  SeasonsLessonScreen,
  CalendarLessonScreen,
  TimeQuizScreen,
  TimeCompleteScreen,
} from '@screens/time';

import type {TimeStackParamList} from './timeTypes';

const Stack = createNativeStackNavigator<TimeStackParamList>();

export function TimeNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#F0F9FF'},
      }}>
      <Stack.Screen name="Home" component={TimeHomeScreen} />
      <Stack.Screen name="ClockLesson" component={ClockLessonScreen} />
      <Stack.Screen name="DayPartsLesson" component={DayPartsLessonScreen} />
      <Stack.Screen name="DaysLesson" component={DaysLessonScreen} />
      <Stack.Screen name="MonthsLesson" component={MonthsLessonScreen} />
      <Stack.Screen name="SeasonsLesson" component={SeasonsLessonScreen} />
      <Stack.Screen name="CalendarLesson" component={CalendarLessonScreen} />
      <Stack.Screen name="TimeQuiz" component={TimeQuizScreen} />
      <Stack.Screen name="TimeComplete" component={TimeCompleteScreen} />
    </Stack.Navigator>
  );
}
