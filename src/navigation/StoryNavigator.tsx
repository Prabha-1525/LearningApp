import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {StoryStackParamList} from './storyTypes';
import {
  FavoriteStoriesScreen,
  StoryCompletionScreen,
  StoryHomeScreen,
  StoryPlayerScreen,
  StoryPreviewScreen,
} from '../screens/story';

const Stack = createNativeStackNavigator<StoryStackParamList>();

export function StoryNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="StoryHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="StoryHome" component={StoryHomeScreen} />
      <Stack.Screen name="StoryPreview" component={StoryPreviewScreen} />
      <Stack.Screen name="StoryPlayer" component={StoryPlayerScreen} />
      <Stack.Screen name="StoryCompletion" component={StoryCompletionScreen} />
      <Stack.Screen name="FavoriteStories" component={FavoriteStoriesScreen} />
    </Stack.Navigator>
  );
}
