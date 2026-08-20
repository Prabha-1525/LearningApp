import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {HEALTHY_HABITS_LIST} from '../../domain/catalog/lifeSkillsData';

interface HealthyHabitsGameProps {
  readonly onComplete?: (stars: number) => void;
}

export function HealthyHabitsGame({onComplete}: HealthyHabitsGameProps) {
  const {t} = useTranslation();
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([
    HEALTHY_HABITS_LIST[0]?.id ?? 'hh-1',
  ]);

  const handleToggleHabit = (id: string) => {
    let next: string[];
    if (selectedHabitIds.includes(id)) {
      next = selectedHabitIds.filter(h => h !== id);
    } else {
      next = [...selectedHabitIds, id];
    }
    setSelectedHabitIds(next);

    if (next.length >= HEALTHY_HABITS_LIST.length) {
      onComplete?.(3);
    }
  };

  const energyLevel = Math.round(
    (selectedHabitIds.length / HEALTHY_HABITS_LIST.length) * 100,
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Energy Meter Banner */}
      <View style={styles.energyCard}>
        <View style={styles.energyHeader}>
          <Text style={styles.energyTitle}>⚡ Daily Super-Energy Meter</Text>
          <Text style={styles.energyPercent}>{energyLevel}% Full!</Text>
        </View>
        <View style={styles.meterTrack}>
          <View
            style={[styles.meterFill, {width: `${Math.max(8, energyLevel)}%`}]}
          />
        </View>
        <Text style={styles.energySub}>
          Tap each healthy choice below to charge up your body & mind!
        </Text>
      </View>

      {/* Habits Grid */}
      <View style={styles.grid}>
        {HEALTHY_HABITS_LIST.map(habit => {
          const isSelected = selectedHabitIds.includes(habit.id);

          return (
            <Pressable
              key={habit.id}
              accessibilityRole="button"
              onPress={() => handleToggleHabit(habit.id)}
              style={[
                styles.card,
                {borderColor: habit.color},
                isSelected && styles.cardSelected,
              ]}>
              <View
                style={[
                  styles.iconWrap,
                  {backgroundColor: `${habit.color}20`},
                ]}>
                <Text style={styles.emoji}>{habit.emoji}</Text>
              </View>

              <Text style={styles.title}>{t(habit.titleKey, habit.id)}</Text>
              <Text style={styles.desc}>{t(habit.descKey, '')}</Text>

              <View
                style={[
                  styles.checkBadge,
                  isSelected && styles.checkBadgeDone,
                ]}>
                <Text
                  style={[
                    styles.checkBadgeText,
                    isSelected && styles.checkBadgeTextDone,
                  ]}>
                  {isSelected ? '✨ Active Habit' : '+ Add Habit'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Full Energy Celebration */}
      {selectedHabitIds.length >= HEALTHY_HABITS_LIST.length && (
        <View style={styles.celebrationCard}>
          <Text style={styles.celebrationEmoji}>🍎 🏃 💧 🌙 ⭐</Text>
          <Text style={styles.celebrationTitle}>
            100% Supercharged! You built a full basket of healthy habits!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  energyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  energyTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#065F46',
  },
  energyPercent: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  meterTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  energySub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: '#F0FDF4',
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  desc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
  },
  checkBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  checkBadgeDone: {
    backgroundColor: '#10B981',
  },
  checkBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  checkBadgeTextDone: {
    color: '#FFFFFF',
  },
  celebrationCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    gap: 6,
  },
  celebrationEmoji: {
    fontSize: 32,
  },
  celebrationTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065F46',
    textAlign: 'center',
  },
});
