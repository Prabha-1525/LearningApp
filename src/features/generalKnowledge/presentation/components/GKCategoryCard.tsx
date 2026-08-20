import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {
  GKCategory,
  LessonProgressState,
} from '../../domain/entities/gkEntities';

interface GKCategoryCardProps {
  readonly category: GKCategory;
  readonly lessonsProgress: Record<string, LessonProgressState>;
  readonly onPress: () => void;
}

export function GKCategoryCard({
  category,
  lessonsProgress,
  onPress,
}: GKCategoryCardProps) {
  const {t} = useTranslation();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const totalLessons = category.lessons.length;
  const completedLessons = category.lessons.filter(
    l => lessonsProgress[l.id]?.completed,
  ).length;
  const categoryStars = category.lessons.reduce(
    (acc, l) => acc + (lessonsProgress[l.id]?.stars || 0),
    0,
  );
  const isComplete = completedLessons === totalLessons && totalLessons > 0;

  return (
    <Animated.View style={[{transform: [{scale}]}, styles.container]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(category.titleKey, category.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.card,
          {
            borderColor: category.accentColor,
            borderLeftColor: category.accentColor,
          },
        ]}>
        {/* Left icon circle */}
        <View
          style={[
            styles.iconCircle,
            {backgroundColor: `${category.accentColor}1A`},
          ]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.infoWrap}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {t(category.titleKey, category.id)}
            </Text>
            {isComplete && <Text style={styles.completeCheck}>✅</Text>}
          </View>
          <Text style={styles.sub} numberOfLines={2}>
            {t(category.subtitleKey, '')}
          </Text>

          {/* Progress Row */}
          <View style={styles.progressRow}>
            <View style={styles.starsBadge}>
              <Text style={styles.starEmoji}>⭐</Text>
              <Text style={styles.starsCount}>{categoryStars}</Text>
            </View>
            <View style={styles.lessonsBadge}>
              <Text style={styles.lessonsText}>
                {completedLessons}/{totalLessons} Lessons
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.arrow, {color: category.accentColor}]}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderLeftWidth: 6,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  infoWrap: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    flex: 1,
  },
  completeCheck: {
    fontSize: 16,
    marginLeft: 6,
  },
  sub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  starsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  starEmoji: {
    fontSize: 12,
  },
  starsCount: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  lessonsBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  lessonsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  arrow: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 4,
  },
});
