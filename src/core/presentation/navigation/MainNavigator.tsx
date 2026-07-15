import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeScreen} from '../screens/HomeScreen';
import {ModuleHostScreen} from '../screens/ModuleHostScreen';
import {ParentDashboardScreen} from '../screens/ParentDashboardScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import type {MainStackParamList} from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProgressOverview" component={ParentDashboardScreen} />
      <Stack.Screen name="ModuleHost" component={ModuleHostScreen} />
    </Stack.Navigator>
  );
}
