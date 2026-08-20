import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {EnglishProgress} from '../../domain/entities/englishEntities';
import {getEnglishOverallProgress} from '../../data/progress/englishProgress';

interface ReadingProgressTrackerProps {
  readonly progress: EnglishProgress;
}

export function ReadingProgressTracker({
  progress,
}: ReadingProgressTrackerProps) {
  const {t} = useTranslation();
  const summary = getEnglishOverallProgress(progress);

  const stages = [
    {id: 'alphabet', label: '🔤 Alphabet', done: summary.alphabetDone},
    {id: 'sounds', label: '🔊 Sounds', done: summary.soundsDone},
    {id: 'phonics', label: '🧩 Phonics', done: summary.phonicsDone},
    {id: 'cvc', label: '📖 CVC Words', done: summary.cvcDone},
    {id: 'sentences', label: '📚 Sentences', done: summary.sentencesDone},
    {id: 'stories', label: '🏆 Stories', done: summary.storiesDone},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>
            {t('english.readingJourney', '📖 Reading Journey')}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'english.journeySubtitle',
              'Letters ➔ Sounds ➔ Blending ➔ Reading',
            )}
          </Text>
        </View>
        <View style={styles.percentPill}>
          <Text style={styles.percentText}>{summary.percent}%</Text>
        </View>
      </View>

      {/* Main Progress Bar */}
      <View style={styles.barBg}>
        <View
          style={[styles.barFill, {width: `${Math.max(6, summary.percent)}%`}]}
        />
      </View>

      {/* Stage Badges Grid */}
      <View style={styles.stagesGrid}>
        {stages.map(st => (
          <View
            key={st.id}
            style={[styles.stageBadge, st.done && styles.stageBadgeDone]}>
            <Text style={styles.stageLabel}>{st.label}</Text>
            <Text style={styles.stageStatus}>{st.done ? '✅' : '🔒'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  percentPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  percentText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563EB',
  },
  barBg: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 5,
  },
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stageBadgeDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  stageLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  stageStatus: {
    fontSize: 11,
  },
});
