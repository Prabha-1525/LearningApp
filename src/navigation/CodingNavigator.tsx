import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  CodingChallengeScreen,
  CodingCompleteScreen,
  CodingHomeScreen,
  ConditionalsLessonScreen,
  DebuggingLessonScreen,
  InstructionsLessonScreen,
  RepetitionLessonScreen,
  RobotGridScreen,
  SequencingLessonScreen,
} from '@screens/coding';
import type {CodingStackParamList} from './codingTypes';

const Stack = createNativeStackNavigator<CodingStackParamList>();

export function CodingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={CodingHomeScreen} />
      <Stack.Screen name="RobotGrid" component={RobotGridScreen} />
      <Stack.Screen
        name="InstructionsLesson"
        component={InstructionsLessonScreen}
      />
      <Stack.Screen
        name="SequencingLesson"
        component={SequencingLessonScreen}
      />
      <Stack.Screen
        name="RepetitionLesson"
        component={RepetitionLessonScreen}
      />
      <Stack.Screen
        name="ConditionalsLesson"
        component={ConditionalsLessonScreen}
      />
      <Stack.Screen name="DebuggingLesson" component={DebuggingLessonScreen} />
      <Stack.Screen name="CodingChallenge" component={CodingChallengeScreen} />
      <Stack.Screen name="CodingComplete" component={CodingCompleteScreen} />
    </Stack.Navigator>
  );
}
