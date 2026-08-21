import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {GalleryArtwork} from '../../domain/entities/drawingEntities';

interface GalleryArtworkCardProps {
  readonly artwork: GalleryArtwork;
  readonly onToggleFavorite: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

export function GalleryArtworkCard({
  artwork,
  onToggleFavorite,
  onDelete,
}: GalleryArtworkCardProps) {
  const formattedDate = new Date(artwork.createdAt).toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
    },
  );

  return (
    <View style={styles.card}>
      {/* Thumbnail / Category Badge */}
      <View style={styles.thumbnailBox}>
        <Text style={styles.thumbnailEmoji}>{artwork.emojiThumbnail}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {artwork.type === 'coloring'
              ? 'Coloring 🖍️'
              : artwork.type === 'guided_drawing'
              ? 'Guided 🧑‍🎨'
              : artwork.type === 'challenge'
              ? 'Challenge 🏆'
              : 'Free Art 🖼️'}
          </Text>
        </View>
      </View>

      {/* Info Column */}
      <View style={styles.infoCol}>
        <Text style={styles.title} numberOfLines={1}>
          {artwork.title}
        </Text>
        <Text style={styles.dateText}>Created {formattedDate}</Text>
      </View>

      {/* Action Icons */}
      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={artwork.isFavorite ? 'Unfavorite' : 'Favorite'}
          onPress={() => onToggleFavorite(artwork.id)}
          style={styles.actionBtn}>
          <Text style={styles.heartIcon}>
            {artwork.isFavorite ? '❤️' : '🤍'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete artwork"
          onPress={() => onDelete(artwork.id)}
          style={styles.actionBtn}>
          <Text style={styles.trashIcon}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  thumbnailEmoji: {
    fontSize: 30,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4B5563',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 16,
  },
  trashIcon: {
    fontSize: 14,
  },
});
