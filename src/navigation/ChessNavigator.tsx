import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ChessHubScreen,
  ChessLessonScreen,
  ChessPracticeScreen,
  PlayWithCoachScreen,
} from '@screens/chess';
import type {ChessStackParamList} from './chessTypes';

const Stack = createNativeStackNavigator<ChessStackParamList>();

/**
 * Nested Chess feature navigator — mounted by ModuleHost when Chess is enabled.
 */
export function ChessNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Hub"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Hub" component={ChessHubScreen} />
      <Stack.Screen name="Lesson" component={ChessLessonScreen} />
      <Stack.Screen name="Practice" component={ChessPracticeScreen} />
      <Stack.Screen name="PlayWithCoach" component={PlayWithCoachScreen} />
    </Stack.Navigator>
  );
}
