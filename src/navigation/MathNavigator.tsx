import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {MathHubScreen, MathLessonRouter} from '@screens/math';
import type {MathStackParamList} from './mathTypes';

const Stack = createNativeStackNavigator<MathStackParamList>();

export function MathNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Hub"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Hub" component={MathHubScreen} />
      <Stack.Screen name="Lesson" component={MathLessonRouter} />
    </Stack.Navigator>
  );
}
