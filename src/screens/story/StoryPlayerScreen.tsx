import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  StoryReadAlongBox,
  StorySceneStage,
} from '../../features/story/presentation/components';
import {STORIES_DATA} from '../../features/story/domain/catalog/storiesData';
import {storyAudio} from '../../features/story/domain/audio/storyAudioEngine';
import {
  readStoryProgress,
  saveStoryBookmark,
  toggleFavoriteStory,
  updateStoryAudioSettings,
} from '../../features/story/data/progress/storyProgress';
import type {StoryStackParamList} from '../../navigation/storyTypes';

type Nav = NativeStackNavigationProp<StoryStackParamList, 'StoryPlayer'>;
type Route = RouteProp<StoryStackParamList, 'StoryPlayer'>;

export function StoryPlayerScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {storyId, initialSceneIndex = 0} = route.params;

  const [progress, setProgress] = useState(readStoryProgress());
  const [sceneIndex, setSceneIndex] = useState(initialSceneIndex);
  const [isPlaying, setIsPlaying] = useState(false);

  const story = STORIES_DATA.find(s => s.id === storyId) ?? STORIES_DATA[0]!;
  const currentScene = story.scenes[sceneIndex] ?? story.scenes[0]!;
  const isFavorite = progress.favoriteStoryIds.includes(story.id);
  const isAutoPlay = progress.audioSettings.autoNarration;

  const playSceneAudio = useCallback((textToSpeak: string) => {
    setIsPlaying(true);
    storyAudio.speak(textToSpeak);
  }, []);

  useEffect(() => {
    // Auto-narration when scene loads
    if (isAutoPlay) {
      playSceneAudio(currentScene.narrationText);
    }
    // Save reading bookmark
    saveStoryBookmark(story.id, sceneIndex, story.scenes.length);
  }, [
    currentScene.narrationText,
    isAutoPlay,
    playSceneAudio,
    sceneIndex,
    story.id,
    story.scenes.length,
  ]);

  const handleToggleFavorite = () => {
    const res = toggleFavoriteStory(story.id);
    setProgress(res.progress);
  };

  const handleToggleAutoPlay = () => {
    const nextVal = !isAutoPlay;
    const updated = updateStoryAudioSettings({autoNarration: nextVal});
    setProgress(updated);
    if (nextVal) {
      playSceneAudio(currentScene.narrationText);
    } else {
      storyAudio.stop();
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (sceneIndex > 0) {
      storyAudio.playPageTurn();
      setSceneIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (sceneIndex < story.scenes.length - 1) {
      storyAudio.playPageTurn();
      setSceneIndex(prev => prev + 1);
    } else {
      // Reached the end! Go to completion screen (NO QUIZ)
      storyAudio.stop();
      navigation.navigate('StoryCompletion', {storyId: story.id});
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title={story.title}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        accentColor={story.accentColor}
        titleColor={story.accentColor}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Animated Scene Illustration Stage */}
        <StorySceneStage scene={currentScene} />

        {/* Read Along Text & Nav Controls */}
        <StoryReadAlongBox
          text={currentScene.text}
          narrationText={currentScene.narrationText}
          sceneIndex={sceneIndex}
          totalScenes={story.scenes.length}
          isAutoPlay={isAutoPlay}
          isPlaying={isPlaying}
          accentColor={story.accentColor}
          onToggleAutoPlay={handleToggleAutoPlay}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
});
