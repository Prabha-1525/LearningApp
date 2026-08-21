import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {readDrawingProgress} from '../../data/progress/drawingProgress';

interface DrawingHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly showGalleryBtn?: boolean;
  readonly onGalleryPress?: () => void;
}

export function DrawingHeader({
  title,
  subtitle,
  emoji = '🎨',
  accentColor = '#EC4899',
  showGalleryBtn = false,
  onGalleryPress,
}: DrawingHeaderProps) {
  const navigation = useNavigation();
  const progress = readDrawingProgress();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <View style={styles.titleCenter}>
          <View style={styles.titleBadge}>
            <Text style={styles.titleEmoji}>{emoji}</Text>
            <Text style={[styles.titleText, {color: accentColor}]}>
              {title}
            </Text>
          </View>
          {subtitle ? (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          ) : null}
        </View>

        <View style={styles.rightGroup}>
          {showGalleryBtn && onGalleryPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Art Gallery"
              onPress={onGalleryPress}
              style={styles.galleryBtn}>
              <Text style={styles.galleryEmoji}>🖼️</Text>
            </Pressable>
          ) : (
            <View style={styles.starsPill}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starCount}>{progress.totalStars}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleEmoji: {
    fontSize: 22,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  starIcon: {
    fontSize: 14,
  },
  starCount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  galleryBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryEmoji: {
    fontSize: 20,
  },
});
