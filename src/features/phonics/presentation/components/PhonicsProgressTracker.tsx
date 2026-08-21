import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {PhonicsProgress} from '../../domain/entities/phonicsEntities';
import {getPhonicsOverallProgress} from '../../data/progress/phonicsProgress';

interface PhonicsProgressTrackerProps {
  readonly progress: PhonicsProgress;
}

export function PhonicsProgressTracker({
  progress,
}: PhonicsProgressTrackerProps) {
  const summary = getPhonicsOverallProgress(progress);

  const pillars = [
    {
      label: '🔤 Sounds',
      done: progress.completedSubModuleIds.includes('letter_sounds'),
    },
    {
      label: '🔗 Blending',
      done: progress.completedSubModuleIds.includes('slow_blending'),
    },
    {
      label: '📖 CVC Words',
      done: progress.completedSubModuleIds.includes('cvc_words'),
    },
    {
      label: '🔄 Families',
      done: progress.completedSubModuleIds.includes('word_families'),
    },
  ];

  return (
    <View style={styles.card}>
      {/* Top Stats */}
      <View style={styles.topRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>COMPLETED</Text>
          <Text style={styles.statVal}>
            {summary.completedLessons} / {summary.totalLessons}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STARS</Text>
          <Text style={styles.statValGold}>⭐ {summary.totalStars}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PROGRESS</Text>
          <Text style={styles.statVal}>{summary.percent}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, {width: `${summary.percent}%`}]} />
      </View>

      {/* 4 Skill Checkpoints */}
      <View style={styles.pillarsRow}>
        {pillars.map((pillar, idx) => (
          <View
            key={idx}
            style={[styles.pillarPill, pillar.done && styles.pillarPillDone]}>
            <Text
              style={[styles.pillarText, pillar.done && styles.pillarTextDone]}>
              {pillar.done ? '✓ ' : '○ '}
              {pillar.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  statBox: {
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
  },
  statValGold: {
    fontSize: 15,
    fontWeight: '900',
    color: '#D97706',
  },
  barBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  pillarsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 2,
  },
  pillarPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillarPillDone: {
    backgroundColor: '#D1FAE5',
  },
  pillarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  pillarTextDone: {
    color: '#065F46',
  },
});
