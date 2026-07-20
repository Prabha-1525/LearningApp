import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  BadgesScreen,
  HomeScreen,
  ModuleHostScreen,
  ParentDashboardScreen,
  ProfileScreen,
  RewardsScreen,
  SettingsScreen,
} from '@screens/tabs';
import type {MainStackParamList, MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

function TabLabel({
  label,
  color,
}: {
  readonly label: string;
  readonly color: string;
}) {
  return (
    <Text style={{fontSize: 11, fontWeight: '700', color, marginBottom: 2}}>
      {label}
    </Text>
  );
}

function TabIcon({
  symbol,
  color,
}: {
  readonly symbol: string;
  readonly color: string;
}) {
  return <Text style={{fontSize: 18, color, marginTop: 4}}>{symbol}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#9AA6B2',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8EEF4',
          height: 64,
          paddingTop: 4,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: ({color}) => <TabLabel label="Home" color={color} />,
          tabBarIcon: ({color}) => <TabIcon symbol="⌂" color={color} />,
        }}
      />
      <Tab.Screen
        name="Badges"
        component={BadgesScreen}
        options={{
          tabBarLabel: ({color}) => <TabLabel label="Badges" color={color} />,
          tabBarIcon: ({color}) => <TabIcon symbol="🏅" color={color} />,
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarLabel: ({color}) => <TabLabel label="Rewards" color={color} />,
          tabBarIcon: ({color}) => <TabIcon symbol="🎁" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({color}) => <TabLabel label="Profile" color={color} />,
          tabBarIcon: ({color}) => <TabIcon symbol="☺" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProgressOverview" component={ParentDashboardScreen} />
      <Stack.Screen name="ModuleHost" component={ModuleHostScreen} />
    </Stack.Navigator>
  );
}
