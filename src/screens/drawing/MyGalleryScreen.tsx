import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {GalleryArtworkCard} from '../../features/drawing/presentation/components';
import {
  deleteGalleryArtwork,
  readGalleryArtworks,
  toggleFavoriteArtwork,
} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';
import type {GalleryArtwork} from '../../features/drawing/domain/entities/drawingEntities';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'MyGallery'>;

export function MyGalleryScreen() {
  const navigation = useNavigation<Nav>();
  const [artworks, setArtworks] = useState<readonly GalleryArtwork[]>(() =>
    readGalleryArtworks(),
  );
  const [filter, setFilter] = useState<
    'all' | 'favorites' | 'coloring' | 'drawing'
  >('all');

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteArtwork(id);
    setArtworks(readGalleryArtworks());
  };

  const handleDelete = (id: string) => {
    deleteGalleryArtwork(id);
    setArtworks(readGalleryArtworks());
  };

  const filteredArtworks = artworks.filter(art => {
    if (filter === 'favorites') return art.isFavorite;
    if (filter === 'coloring') return art.type === 'coloring';
    if (filter === 'drawing') return art.type !== 'coloring';
    return true;
  });

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="My Art Gallery"
        subtitle="Your saved drawings and colorful creations!"
        emoji="🖼️"
        accentColor="#EC4899"
        titleColor="#EC4899"
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="All artworks"
          onPress={() => setFilter('all')}
          style={[
            styles.filterPill,
            filter === 'all' && styles.filterPillActive,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}>
            All ({artworks.length})
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Favorite artworks"
          onPress={() => setFilter('favorites')}
          style={[
            styles.filterPill,
            filter === 'favorites' && styles.filterPillActive,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'favorites' && styles.filterTextActive,
            ]}>
            ❤️ Favorites
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Coloring artworks"
          onPress={() => setFilter('coloring')}
          style={[
            styles.filterPill,
            filter === 'coloring' && styles.filterPillActive,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'coloring' && styles.filterTextActive,
            ]}>
            🖍️ Coloring
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Free drawings"
          onPress={() => setFilter('drawing')}
          style={[
            styles.filterPill,
            filter === 'drawing' && styles.filterPillActive,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'drawing' && styles.filterTextActive,
            ]}>
            ✏️ Drawings
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {filteredArtworks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎨</Text>
            <Text style={styles.emptyTitle}>No Artworks Yet</Text>
            <Text style={styles.emptyDesc}>
              Draw a picture or color an object and tap "💾 Save" to keep it
              here!
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start Free Drawing"
              onPress={() => navigation.navigate('FreeDrawing')}
              style={styles.createBtn}>
              <Text style={styles.createBtnText}>Start Drawing Now ✏️</Text>
            </Pressable>
          </View>
        ) : (
          filteredArtworks.map(art => (
            <GalleryArtworkCard
              key={art.id}
              artwork={art}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#BE185D',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 8,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 32,
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  emptyDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  createBtn: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 6,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
