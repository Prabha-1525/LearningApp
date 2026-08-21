import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  StoryCard,
  StoryHeader,
} from '../../features/story/presentation/components';
import {STORIES_DATA} from '../../features/story/domain/catalog/storiesData';
import {
  readStoryProgress,
  toggleFavoriteStory,
} from '../../features/story/data/progress/storyProgress';
import type {
  StoryItem,
  StoryProgress,
} from '../../features/story/domain/entities/storyEntities';
import type {StoryStackParamList} from '../../navigation/storyTypes';

type Nav = NativeStackNavigationProp<StoryStackParamList, 'FavoriteStories'>;

export function FavoriteStoriesScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<StoryProgress>(readStoryProgress());

  useFocusEffect(
    useCallback(() => {
      setProgress(readStoryProgress());
    }, []),
  );

  const handleSelectStory = (story: StoryItem) => {
    navigation.navigate('StoryPreview', {storyId: story.id});
  };

  const handleToggleFavorite = (storyId: string) => {
    const res = toggleFavoriteStory(storyId);
    setProgress(res.progress);
  };

  const favoriteStories = React.useMemo(() => {
    return STORIES_DATA.filter(s => progress.favoriteStoryIds.includes(s.id));
  }, [progress.favoriteStoryIds]);

  return (
    <AppSafeAreaView>
      <StoryHeader
        title="Favorite Stories"
        subtitle="Your personal collection of beloved stories"
        accentColor="#EC4899"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {favoriteStories.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>❤️</Text>
            <Text style={styles.emptyTitle}>No Favorite Stories Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any story to save it here for quick reading!
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {favoriteStories.map(story => {
              const bookmark = progress.storyProgressMap[story.id];

              return (
                <StoryCard
                  key={story.id}
                  story={story}
                  bookmark={bookmark}
                  isFavorite={true}
                  onSelect={handleSelectStory}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },
  grid: {
    gap: 14,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 52,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
  },
});
