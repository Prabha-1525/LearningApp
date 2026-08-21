import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {
  StoryBookmark,
  StoryItem,
} from '../../domain/entities/storyEntities';
import {storyAudio} from '../../domain/audio/storyAudioEngine';

interface ContinueReadingShelfProps {
  readonly story: StoryItem;
  readonly bookmark: StoryBookmark;
  readonly onContinue: (story: StoryItem) => void;
}

export function ContinueReadingShelf({
  story,
  bookmark,
  onContinue,
}: ContinueReadingShelfProps) {
  const currentScene = bookmark.currentSceneIndex;
  const totalScenes = story.scenes.length;
  const percent = Math.round(((currentScene + 1) / totalScenes) * 100);

  const handlePress = () => {
    storyAudio.playTone(520, 60);
    onContinue(story);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Continue reading ${story.title}`}
      onPress={handlePress}
      style={[
        styles.container,
        {backgroundColor: story.coverBgColor, borderColor: story.accentColor},
      ]}>
      <View style={styles.contentRow}>
        <View style={[styles.emojiBox, {backgroundColor: story.accentColor}]}>
          <Text style={styles.emojiText}>{story.coverEmoji}</Text>
        </View>

        <View style={styles.textColumn}>
          <Text style={styles.shelfTag}>▶️ CONTINUE READING</Text>
          <Text style={styles.title} numberOfLines={1}>
            {story.title}
          </Text>
          <Text style={styles.subtitle}>
            Scene {currentScene + 1} of {totalScenes} ({percent}%)
          </Text>

          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {backgroundColor: story.accentColor, width: `${percent}%`},
              ]}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 2.5,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emojiBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 32,
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  shelfTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
