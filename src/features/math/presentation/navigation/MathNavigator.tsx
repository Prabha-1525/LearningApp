import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {MathHubScreen} from '../screens/MathHubScreen';
import {MathLessonRouter} from '../screens/MathLessonRouter';
import type {MathStackParamList} from './types';

const Stack = createNativeStackNavigator<MathStackParamList>();

export function MathNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Hub"
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Hub" component={MathHubScreen} />
      <Stack.Screen name="Lesson" component={MathLessonRouter} />
    </Stack.Navigator>
  );
}
