import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {
  GKLesson,
  LessonProgressState,
} from '../../domain/entities/gkEntities';

interface GKLessonCardProps {
  readonly lesson: GKLesson;
  readonly isUnlocked: boolean;
  readonly progress?: LessonProgressState;
  readonly onPress: () => void;
}

export function GKLessonCard({
  lesson,
  isUnlocked,
  progress,
  onPress,
}: GKLessonCardProps) {
  const {t} = useTranslation();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isUnlocked) return;
    Animated.spring(scale, {
      toValue: 0.95,
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

  const starsEarned = progress?.stars ?? 0;
  const isCompleted = progress?.completed ?? false;

  return (
    <Animated.View style={[{transform: [{scale}]}, styles.container]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t(lesson.titleKey, lesson.id)} ${
          isUnlocked ? 'Unlocked' : 'Locked'
        }`}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={isUnlocked ? onPress : undefined}
        style={[
          styles.card,
          isUnlocked
            ? [styles.unlockedCard, {borderColor: lesson.accentColor}]
            : styles.lockedCard,
        ]}>
        {/* Order badge */}
        <View
          style={[
            styles.orderBadge,
            isUnlocked
              ? {backgroundColor: lesson.accentColor}
              : styles.orderBadgeLocked,
          ]}>
          <Text style={styles.orderText}>{lesson.orderIndex}</Text>
        </View>

        {/* Emoji Avatar */}
        <View
          style={[
            styles.emojiBox,
            isUnlocked
              ? {backgroundColor: `${lesson.accentColor}1A`}
              : styles.emojiBoxLocked,
          ]}>
          <Text style={[styles.emoji, !isUnlocked && styles.lockedEmoji]}>
            {isUnlocked ? lesson.emoji : '🔒'}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoWrap}>
          <Text
            style={[styles.title, !isUnlocked && styles.lockedText]}
            numberOfLines={1}>
            {t(lesson.titleKey, lesson.id)}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {isUnlocked
              ? t(lesson.subtitleKey, '')
              : t(
                  'generalKnowledge.lockedHint',
                  'Complete previous lesson to unlock',
                )}
          </Text>

          {/* Stars */}
          {isUnlocked && (
            <View style={styles.starsRow}>
              {[1, 2, 3].map(s => (
                <Text
                  key={s}
                  style={[
                    styles.star,
                    s <= starsEarned ? styles.starFilled : styles.starEmpty,
                  ]}>
                  ⭐
                </Text>
              ))}
              {isCompleted && (
                <Text style={styles.completedTag}>
                  {t('generalKnowledge.passedTag', 'Passed ✅')}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Action Icon */}
        <View style={styles.actionWrap}>
          {isUnlocked ? (
            <View
              style={[
                styles.playBtn,
                {backgroundColor: `${lesson.accentColor}20`},
              ]}>
              <Text style={[styles.playIcon, {color: lesson.accentColor}]}>
                ▶
              </Text>
            </View>
          ) : (
            <View style={styles.lockIconBox}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 2,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  unlockedCard: {
    backgroundColor: '#FFFFFF',
  },
  lockedCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.85,
  },
  orderBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeLocked: {
    backgroundColor: '#9CA3AF',
  },
  orderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  emojiBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBoxLocked: {
    backgroundColor: '#F3F4F6',
  },
  emoji: {
    fontSize: 26,
  },
  lockedEmoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  infoWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
  },
  lockedText: {
    color: '#6B7280',
  },
  sub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  star: {
    fontSize: 13,
  },
  starFilled: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.25,
  },
  completedTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    marginLeft: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  actionWrap: {
    marginLeft: 4,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 2,
  },
  lockIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
});
