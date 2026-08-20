import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  DailyRoutineScreen,
  EmotionsScreen,
  HealthyHabitsScreen,
  HygieneScreen,
  LifeSkillsCompleteScreen,
  LifeSkillsHomeScreen,
  LifeSkillsQuizScreen,
  MannersScreen,
  SafetyScreen,
} from '@screens/lifeSkills';
import type {LifeSkillsStackParamList} from './lifeSkillsTypes';

const Stack = createNativeStackNavigator<LifeSkillsStackParamList>();

export function LifeSkillsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={LifeSkillsHomeScreen} />
      <Stack.Screen name="Hygiene" component={HygieneScreen} />
      <Stack.Screen name="Emotions" component={EmotionsScreen} />
      <Stack.Screen name="Manners" component={MannersScreen} />
      <Stack.Screen name="DailyRoutine" component={DailyRoutineScreen} />
      <Stack.Screen name="HealthyHabits" component={HealthyHabitsScreen} />
      <Stack.Screen name="Safety" component={SafetyScreen} />
      <Stack.Screen name="LifeSkillsQuiz" component={LifeSkillsQuizScreen} />
      <Stack.Screen
        name="LifeSkillsComplete"
        component={LifeSkillsCompleteScreen}
      />
    </Stack.Navigator>
  );
}
