import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  GKCategoryCompleteScreen,
  GKCategoryScreen,
  GKFinalQuizScreen,
  GKHomeScreen,
  GKLessonScreen,
} from '@screens/generalKnowledge';
import type {GeneralKnowledgeStackParamList} from './generalKnowledgeTypes';

const Stack = createNativeStackNavigator<GeneralKnowledgeStackParamList>();

export function GeneralKnowledgeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={GKHomeScreen} />
      <Stack.Screen name="Category" component={GKCategoryScreen} />
      <Stack.Screen name="Lesson" component={GKLessonScreen} />
      <Stack.Screen name="FinalChallenge" component={GKFinalQuizScreen} />
      <Stack.Screen
        name="CategoryComplete"
        component={GKCategoryCompleteScreen}
      />
    </Stack.Navigator>
  );
}
