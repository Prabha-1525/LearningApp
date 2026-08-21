import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  ContinueReadingShelf,
  StoryCard,
  StoryCategoryPills,
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

type Nav = NativeStackNavigationProp<StoryStackParamList, 'StoryHome'>;

export function StoryHomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<StoryProgress>(readStoryProgress());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setProgress(readStoryProgress());
    }, []),
  );

  const handleSelectStory = (story: StoryItem) => {
    navigation.navigate('StoryPreview', {storyId: story.id});
  };

  const handleContinueStory = (story: StoryItem) => {
    navigation.navigate('StoryPlayer', {storyId: story.id});
  };

  const handleToggleFavorite = (storyId: string) => {
    const res = toggleFavoriteStory(storyId);
    setProgress(res.progress);
  };

  // Find in-progress story for the continue reading shelf
  const inProgressStory = React.useMemo(() => {
    if (!progress.lastReadStoryId) return null;
    const bookmark = progress.storyProgressMap[progress.lastReadStoryId];
    if (!bookmark || bookmark.completed) return null;
    return STORIES_DATA.find(s => s.id === progress.lastReadStoryId) ?? null;
  }, [progress]);

  // Filter stories based on selected category / favorites
  const filteredStories = React.useMemo(() => {
    if (selectedCategory === 'favorites') {
      return STORIES_DATA.filter(s => progress.favoriteStoryIds.includes(s.id));
    }
    if (selectedCategory !== null) {
      return STORIES_DATA.filter(s => s.categoryId === selectedCategory);
    }
    return STORIES_DATA;
  }, [progress.favoriteStoryIds, selectedCategory]);

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Story Time"
        subtitle="Which wonderful story would you like to hear today?"
        accentColor="#C4A05A"
        titleColor="#C4A05A"
      />

      {/* Category Pills Selector */}
      <StoryCategoryPills
        selectedCategory={selectedCategory}
        favoritesCount={progress.favoriteStoryIds.length}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Continue Reading Shelf */}
        {inProgressStory && progress.storyProgressMap[inProgressStory.id] && (
          <ContinueReadingShelf
            story={inProgressStory}
            bookmark={progress.storyProgressMap[inProgressStory.id]!}
            onContinue={handleContinueStory}
          />
        )}

        {/* Stories List */}
        <View style={styles.grid}>
          {filteredStories.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyTitle}>No Stories Found</Text>
              <Text style={styles.emptySubtitle}>
                Add stories to your favorites by tapping the heart icon!
              </Text>
            </View>
          ) : (
            filteredStories.map(story => {
              const bookmark = progress.storyProgressMap[story.id];
              const isFav = progress.favoriteStoryIds.includes(story.id);

              return (
                <StoryCard
                  key={story.id}
                  story={story}
                  bookmark={bookmark}
                  isFavorite={isFav}
                  onSelect={handleSelectStory}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })
          )}
        </View>
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
    paddingVertical: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
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
    maxWidth: 240,
  },
});
