import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  BadgesScreen,
  HomeScreen,
  ProfileScreen,
  RewardsScreen,
} from '@screens/tabs';
import type {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

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

const renderHomeLabel = ({color}: {readonly color: string}) => (
  <TabLabel label="Home" color={color} />
);
const renderHomeIcon = ({color}: {readonly color: string}) => (
  <TabIcon symbol="⌂" color={color} />
);

const renderRewardsLabel = ({color}: {readonly color: string}) => (
  <TabLabel label="Rewards" color={color} />
);
const renderRewardsIcon = ({color}: {readonly color: string}) => (
  <TabIcon symbol="🎁" color={color} />
);

const renderBadgesLabel = ({color}: {readonly color: string}) => (
  <TabLabel label="Badges" color={color} />
);
const renderBadgesIcon = ({color}: {readonly color: string}) => (
  <TabIcon symbol="🏅" color={color} />
);

const renderProfileLabel = ({color}: {readonly color: string}) => (
  <TabLabel label="Profile" color={color} />
);
const renderProfileIcon = ({color}: {readonly color: string}) => (
  <TabIcon symbol="☺" color={color} />
);

export function MainTabNavigator() {
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
          tabBarLabel: renderHomeLabel,
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarLabel: renderRewardsLabel,
          tabBarIcon: renderRewardsIcon,
        }}
      />
      <Tab.Screen
        name="Badges"
        component={BadgesScreen}
        options={{
          tabBarLabel: renderBadgesLabel,
          tabBarIcon: renderBadgesIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: renderProfileLabel,
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}
