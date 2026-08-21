import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {
  StoryBookmark,
  StoryItem,
} from '../../domain/entities/storyEntities';
import {storyAudio} from '../../domain/audio/storyAudioEngine';

interface StoryCardProps {
  readonly story: StoryItem;
  readonly bookmark?: StoryBookmark;
  readonly isFavorite: boolean;
  readonly onSelect: (story: StoryItem) => void;
  readonly onToggleFavorite: (storyId: string) => void;
}

export function StoryCard({
  story,
  bookmark,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: StoryCardProps) {
  const isCompleted = bookmark?.completed ?? false;
  const currentScene = bookmark?.currentSceneIndex ?? 0;
  const totalScenes = story.scenes.length;
  const hasStarted = currentScene > 0 && !isCompleted;

  const handlePress = () => {
    storyAudio.playTone(520, 60);
    onSelect(story);
  };

  const handleFav = () => {
    storyAudio.playTone(600, 50);
    onToggleFavorite(story.id);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Story: ${story.title}`}
      onPress={handlePress}
      style={[
        styles.card,
        {backgroundColor: story.coverBgColor, borderColor: story.accentColor},
      ]}>
      {/* Top Row: Level & Favorite */}
      <View style={styles.topRow}>
        <View style={[styles.levelPill, {backgroundColor: story.accentColor}]}>
          <Text style={styles.levelText}>Level {story.level}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add favorite'}
          onPress={handleFav}
          style={styles.favBtn}>
          <Text style={styles.favText}>{isFavorite ? '❤️' : '🤍'}</Text>
        </Pressable>
      </View>

      {/* Large Cover Center */}
      <View style={styles.coverWrap}>
        <Text style={styles.coverEmoji}>{story.coverEmoji}</Text>
      </View>

      {/* Story Metadata */}
      <View style={styles.infoWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {story.title}
          </Text>
          {isCompleted && <Text style={styles.checkIcon}>✅</Text>}
        </View>

        <Text style={styles.desc} numberOfLines={2}>
          {story.description}
        </Text>

        {/* Duration & Scenes Pill */}
        <View style={styles.statsRow}>
          <Text style={styles.statPill}>⏱️ {story.durationMinutes} min</Text>
          <Text style={styles.statPill}>📄 {totalScenes} scenes</Text>
          <Text style={styles.statPill}>⭐ 3 stars</Text>
        </View>

        {/* In-progress bar if partially read */}
        {hasStarted && (
          <View style={styles.progressWrap}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: story.accentColor,
                    width: `${Math.round(
                      ((currentScene + 1) / totalScenes) * 100,
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Scene {currentScene + 1} of {totalScenes}
            </Text>
          </View>
        )}

        {/* Read Button */}
        <View style={[styles.readBtn, {backgroundColor: story.accentColor}]}>
          <Text style={styles.readBtnText}>
            {hasStarted
              ? 'Continue Story ➔'
              : isCompleted
              ? 'Read Again 🔄'
              : 'Read Story ➔'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 26,
    borderWidth: 3,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  favBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favText: {
    fontSize: 16,
  },
  coverWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  coverEmoji: {
    fontSize: 64,
  },
  infoWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
  },
  checkIcon: {
    fontSize: 16,
  },
  desc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  statPill: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  progressWrap: {
    gap: 4,
    marginTop: 2,
  },
  progressBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  readBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  readBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
