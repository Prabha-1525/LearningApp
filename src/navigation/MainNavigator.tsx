import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  HomeScreen,
  ModuleHostScreen,
  ParentDashboardScreen,
  ProfileScreen,
  SettingsScreen,
} from '@screens/tabs';
import type {MainStackParamList} from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProgressOverview" component={ParentDashboardScreen} />
      <Stack.Screen name="ModuleHost" component={ModuleHostScreen} />
    </Stack.Navigator>
  );
}
