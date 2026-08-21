import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {ShapesProgress} from '../../domain/entities/shapeEntities';

interface ShapesProgressTrackerProps {
  readonly progress: ShapesProgress;
}

export function ShapesProgressTracker({progress}: ShapesProgressTrackerProps) {
  const pillars = [
    {
      title: 'Shape Learning',
      emoji: '🔍',
      color: '#3B82F6',
      done: progress.shapesLearned.length,
      total: 11,
    },
    {
      title: 'Match & Sort',
      emoji: '📦',
      color: '#EC4899',
      done: progress.matchingDone.length + progress.sortingDone.length,
      total: 6,
    },
    {
      title: 'Properties',
      emoji: '📐',
      color: '#10B981',
      done: progress.propertiesKnown.length,
      total: 5,
    },
    {
      title: 'Puzzles & Patterns',
      emoji: '🧠',
      color: '#F59E0B',
      done: progress.patternsSolved.length + progress.puzzlesSolved.length,
      total: 6,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Your Shape Learning Journey</Text>
      <View style={styles.grid}>
        {pillars.map(p => {
          const ratio = Math.min(1, p.done / p.total);
          const percent = Math.round(ratio * 100);

          return (
            <View key={p.title} style={styles.pillarCard}>
              <View style={styles.pillarHeader}>
                <Text style={styles.pillarEmoji}>{p.emoji}</Text>
                <Text style={styles.pillarTitle}>{p.title}</Text>
              </View>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {backgroundColor: p.color, width: `${percent}%`},
                  ]}
                />
              </View>
              <Text style={styles.statText}>
                {p.done} / {p.total} ({percent}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pillarCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillarEmoji: {
    fontSize: 16,
  },
  pillarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
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
    borderRadius: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'right',
  },
});
