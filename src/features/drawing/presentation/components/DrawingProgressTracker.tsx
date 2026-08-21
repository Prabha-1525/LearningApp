import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {readDrawingProgress} from '../../data/progress/drawingProgress';

export function DrawingProgressTracker() {
  const progress = readDrawingProgress();
  const colorsCount = progress.colorsLearned.length;
  const coloringCount = progress.objectsColored.length;
  const shapesCount =
    progress.shapesMastered.length + progress.guidedDrawingsCompleted.length;
  const challengesCount = progress.challengesCompleted.length;

  const colorsPercent = Math.min(100, Math.round((colorsCount / 11) * 100));
  const coloringPercent = Math.min(100, Math.round((coloringCount / 10) * 100));
  const drawingPercent = Math.min(100, Math.round((shapesCount / 10) * 100));
  const challengePercent = Math.min(
    100,
    Math.round((challengesCount / 5) * 100),
  );

  const sections = [
    {
      id: 'colors',
      title: '🎨 Colors & Mixing',
      percent: colorsPercent,
      color: '#EF4444',
    },
    {
      id: 'coloring',
      title: '🖍️ Coloring Pages',
      percent: coloringPercent,
      color: '#EC4899',
    },
    {
      id: 'drawing',
      title: '✏️ Shapes & Drawing',
      percent: drawingPercent,
      color: '#6366F1',
    },
    {
      id: 'challenges',
      title: '🏆 Creative Challenges',
      percent: challengePercent,
      color: '#F59E0B',
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📊 My Creative Journey</Text>

      <View style={styles.barsContainer}>
        {sections.map(sec => (
          <View key={sec.id} style={styles.barGroup}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>{sec.title}</Text>
              <Text style={styles.barPercent}>{sec.percent}%</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {width: `${sec.percent}%`, backgroundColor: sec.color},
                ]}
              />
            </View>
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
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  barsContainer: {
    gap: 10,
  },
  barGroup: {
    gap: 4,
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  barPercent: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  track: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
