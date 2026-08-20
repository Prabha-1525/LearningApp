import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {HYGIENE_HABITS} from '../../domain/catalog/lifeSkillsData';
import type {HygieneHabit} from '../../domain/entities/lifeSkillsEntities';

interface HygieneLessonProps {
  readonly onHabitMastered?: (habitId: string) => void;
  readonly onComplete?: (stars: number) => void;
}

export function HygieneLesson({
  onHabitMastered,
  onComplete,
}: HygieneLessonProps) {
  const {t} = useTranslation();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [completedHabitIds, setCompletedHabitIds] = useState<string[]>([
    HYGIENE_HABITS[0]?.id ?? 'brush-teeth',
  ]);

  const bounceAnim = useRef(new Animated.Value(1)).current;

  const current: HygieneHabit =
    HYGIENE_HABITS[selectedIdx] ?? HYGIENE_HABITS[0]!;

  const triggerBounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.25,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceAnim]);

  const handleSelectHabit = (idx: number) => {
    setSelectedIdx(idx);
    triggerBounce();
    const habit = HYGIENE_HABITS[idx];
    if (habit && !completedHabitIds.includes(habit.id)) {
      const next = [...completedHabitIds, habit.id];
      setCompletedHabitIds(next);
      onHabitMastered?.(habit.id);
      if (next.length >= HYGIENE_HABITS.length) {
        onComplete?.(3);
      }
    }
  };

  const isCurrentChecked = completedHabitIds.includes(current.id);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {HYGIENE_HABITS.map((habit, idx) => {
          const isSelected = idx === selectedIdx;
          const isDone = completedHabitIds.includes(habit.id);

          return (
            <Pressable
              key={habit.id}
              accessibilityRole="button"
              onPress={() => handleSelectHabit(idx)}
              style={[
                styles.pill,
                isSelected && {
                  backgroundColor: habit.sparkleColor,
                  borderColor: habit.sparkleColor,
                },
              ]}>
              <Text style={styles.pillEmoji}>{habit.emoji}</Text>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                {t(habit.titleKey, habit.id)}
              </Text>
              {isDone && <Text style={styles.checkPill}>✅</Text>}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Habit Card */}
      <View style={[styles.card, {borderColor: current.sparkleColor}]}>
        <View style={styles.cardHeader}>
          <Text style={styles.habitBadge}>
            🧼 Habit {selectedIdx + 1} of {HYGIENE_HABITS.length}
          </Text>
          <Text style={styles.starsCount}>
            {completedHabitIds.length}/{HYGIENE_HABITS.length} Mastered
          </Text>
        </View>

        {/* Big Emoji Stage */}
        <View
          style={[
            styles.emojiStage,
            {backgroundColor: `${current.sparkleColor}20`},
          ]}>
          <Animated.Text
            style={[styles.bigEmoji, {transform: [{scale: bounceAnim}]}]}>
            {current.emoji}
          </Animated.Text>
        </View>

        <Text style={styles.title}>{t(current.titleKey, current.id)}</Text>

        <Text style={styles.desc}>{t(current.descKey, '')}</Text>

        {/* Pro Tip Box */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Healthy Habit Tip:</Text>
          <Text style={styles.tipText}>{t(current.tipKey, '')}</Text>
        </View>

        {/* Practice Button */}
        <Pressable
          accessibilityRole="button"
          onPress={() => handleSelectHabit(selectedIdx)}
          style={[
            styles.actionBtn,
            {backgroundColor: current.sparkleColor},
            isCurrentChecked && styles.actionBtnDone,
          ]}>
          <Text style={styles.actionBtnIcon}>
            {isCurrentChecked ? '✨ ✅' : '🌟'}
          </Text>
          <Text style={styles.actionBtnText}>
            {isCurrentChecked
              ? 'I Practice This Good Habit!'
              : 'Tap to Mark as Practiced!'}
          </Text>
        </Pressable>

        {/* Completion Milestone */}
        {completedHabitIds.length >= HYGIENE_HABITS.length && (
          <View style={styles.milestoneBanner}>
            <Text style={styles.milestoneEmoji}>🌟 🧼 ✨</Text>
            <Text style={styles.milestoneText}>
              Amazing! You know all 6 daily cleanliness and hygiene habits!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  strip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  pillEmoji: {
    fontSize: 18,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  checkPill: {
    fontSize: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitBadge: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0EA5E9',
  },
  starsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  emojiStage: {
    height: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: {
    fontSize: 68,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    gap: 4,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0369A1',
  },
  tipText: {
    fontSize: 13,
    color: '#0C4A6E',
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnDone: {
    opacity: 0.95,
  },
  actionBtnIcon: {
    fontSize: 18,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  milestoneBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    gap: 6,
  },
  milestoneEmoji: {
    fontSize: 28,
  },
  milestoneText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065F46',
    textAlign: 'center',
  },
});
