import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ModuleHostScreen,
  ParentDashboardScreen,
  SettingsScreen,
} from '@screens/tabs';
import {MainTabNavigator} from './MainTabNavigator';
import type {MainStackParamList} from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Tabs" component={MainTabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProgressOverview" component={ParentDashboardScreen} />
      <Stack.Screen name="ModuleHost" component={ModuleHostScreen} />
    </Stack.Navigator>
  );
}
