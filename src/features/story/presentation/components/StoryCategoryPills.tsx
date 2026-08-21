import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {STORY_CATEGORIES} from '../../domain/catalog/storiesData';
import {storyAudio} from '../../domain/audio/storyAudioEngine';

interface StoryCategoryPillsProps {
  readonly selectedCategory: string | null;
  readonly favoritesCount: number;
  readonly onSelectCategory: (categoryId: string | null) => void;
}

export function StoryCategoryPills({
  selectedCategory,
  favoritesCount,
  onSelectCategory,
}: StoryCategoryPillsProps) {
  const handlePress = (id: string | null) => {
    storyAudio.playTone(480, 50);
    onSelectCategory(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* All Stories Filter */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="All stories"
        onPress={() => handlePress(null)}
        style={[styles.pill, selectedCategory === null && styles.pillActive]}>
        <Text style={styles.pillEmoji}>📖</Text>
        <Text
          style={[
            styles.pillText,
            selectedCategory === null && styles.pillTextActive,
          ]}>
          All Stories
        </Text>
      </Pressable>

      {/* Favorites Filter */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Favorites filter"
        onPress={() => handlePress('favorites')}
        style={[
          styles.pill,
          selectedCategory === 'favorites' && styles.favPillActive,
        ]}>
        <Text style={styles.pillEmoji}>❤️</Text>
        <Text
          style={[
            styles.pillText,
            selectedCategory === 'favorites' && styles.pillTextActive,
          ]}>
          Favorites ({favoritesCount})
        </Text>
      </Pressable>

      {/* Category Pills */}
      {STORY_CATEGORIES.map(cat => {
        const isSelected = selectedCategory === cat.id;

        return (
          <Pressable
            key={cat.id}
            accessibilityRole="button"
            accessibilityLabel={cat.id}
            onPress={() => handlePress(cat.id)}
            style={[
              styles.pill,
              isSelected && {
                backgroundColor: cat.color,
                borderColor: cat.color,
              },
            ]}>
            <Text style={styles.pillEmoji}>{cat.emoji}</Text>
            <Text
              style={[styles.pillText, isSelected && styles.pillTextActive]}>
              {cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  pillActive: {
    backgroundColor: '#C4A05A',
    borderColor: '#C4A05A',
  },
  favPillActive: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  pillEmoji: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
