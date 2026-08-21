import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {StoryHeader} from '../../features/story/presentation/components';
import {STORIES_DATA} from '../../features/story/domain/catalog/storiesData';
import {
  readStoryProgress,
  saveStoryBookmark,
  toggleFavoriteStory,
} from '../../features/story/data/progress/storyProgress';
import type {StoryStackParamList} from '../../navigation/storyTypes';

type Nav = NativeStackNavigationProp<StoryStackParamList, 'StoryPreview'>;
type Route = RouteProp<StoryStackParamList, 'StoryPreview'>;

export function StoryPreviewScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {storyId} = route.params;

  const [progress, setProgress] = useState(readStoryProgress());
  const story = STORIES_DATA.find(s => s.id === storyId) ?? STORIES_DATA[0]!;
  const bookmark = progress.storyProgressMap[story.id];
  const isFavorite = progress.favoriteStoryIds.includes(story.id);

  const hasStarted =
    (bookmark?.currentSceneIndex ?? 0) > 0 && !bookmark?.completed;

  const handleToggleFavorite = () => {
    const res = toggleFavoriteStory(story.id);
    setProgress(res.progress);
  };

  const handleStartStory = (startFromBeginning = false) => {
    if (startFromBeginning) {
      saveStoryBookmark(story.id, 0, story.scenes.length);
    }
    navigation.navigate('StoryPlayer', {
      storyId: story.id,
      initialSceneIndex: startFromBeginning
        ? 0
        : bookmark?.currentSceneIndex ?? 0,
    });
  };

  return (
    <AppSafeAreaView>
      <StoryHeader
        title="Story Preview"
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        accentColor={story.accentColor}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Cover Presentation Box */}
        <View
          style={[
            styles.coverCard,
            {
              backgroundColor: story.coverBgColor,
              borderColor: story.accentColor,
            },
          ]}>
          <Text style={styles.coverEmoji}>{story.coverEmoji}</Text>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.description}>{story.description}</Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>Level {story.level}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{story.durationMinutes} min</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Scenes</Text>
              <Text style={styles.statValue}>{story.scenes.length}</Text>
            </View>
          </View>
        </View>

        {/* Meet the Characters */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎭 Meet the Characters</Text>
          <View style={styles.characterList}>
            {story.characters.map(char => (
              <View key={char.id} style={styles.characterItem}>
                <View style={styles.charEmojiBox}>
                  <Text style={styles.charEmoji}>{char.emoji}</Text>
                </View>
                <View style={styles.charTextWrap}>
                  <Text style={styles.charName}>{char.name}</Text>
                  {char.roleDescription && (
                    <Text style={styles.charRole}>{char.roleDescription}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Moral of the Story */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💡 Positive Value</Text>
          <Text style={styles.moralText}>"{story.moralLesson}"</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start story"
            onPress={() => handleStartStory(false)}
            style={[styles.primaryBtn, {backgroundColor: story.accentColor}]}>
            <Text style={styles.primaryBtnText}>
              {hasStarted ? 'Continue Story ➔' : 'Start Story ▶️'}
            </Text>
          </Pressable>

          {hasStarted && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start story from beginning"
              onPress={() => handleStartStory(true)}
              style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>
                Start From Beginning 🔄
              </Text>
            </Pressable>
          )}
        </View>
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
  coverCard: {
    width: '100%',
    borderRadius: 26,
    borderWidth: 3,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  coverEmoji: {
    fontSize: 72,
    marginVertical: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  characterList: {
    gap: 8,
  },
  characterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  charEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  charEmoji: {
    fontSize: 26,
  },
  charTextWrap: {
    flex: 1,
    gap: 2,
  },
  charName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
  },
  charRole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  moralText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  secondaryBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
});
