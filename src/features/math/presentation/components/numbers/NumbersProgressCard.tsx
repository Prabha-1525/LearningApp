import {StyleSheet, View} from 'react-native';

import {AppText, ProgressBar, useTheme} from '@shared/ui';

type Props = {
  readonly questionInBatch: number;
  readonly batchSize: number;
  readonly stars: number;
  readonly greatJobs: number;
  readonly score: number;
  readonly labels: {
    readonly question: string;
    readonly stars: string;
    readonly greatJobs: string;
    readonly score: string;
  };
};

/** Positive-only session progress — no failure counters. */
export function NumbersProgressCard({
  questionInBatch,
  batchSize,
  stars,
  greatJobs,
  score,
  labels,
}: Props) {
  const {radius, space} = useTheme();
  const displayQuestion = Math.min(questionInBatch + 1, batchSize);
  const progress = questionInBatch / batchSize;

  return (
    <View
      style={[
        styles.card,
        {borderRadius: radius.lg, padding: space.md, gap: space.sm},
      ]}>
      <View style={styles.row}>
        <Stat
          label={labels.question}
          value={`${displayQuestion} / ${batchSize}`}
        />
        <Stat label={labels.stars} value={`⭐ ${stars}`} tone="star" />
        <Stat
          label={labels.greatJobs}
          value={String(greatJobs)}
          tone="success"
        />
        <Stat label={labels.score} value={`${score}%`} />
      </View>
      <ProgressBar progress={progress} />
    </View>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'success' | 'star';
}) {
  const color =
    tone === 'success' ? '#3D9A5F' : tone === 'star' ? '#F4B400' : '#2D1B4E';
  return (
    <View style={styles.stat}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="title" style={{color}}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#4DB7E8',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  stat: {
    minWidth: '22%',
    alignItems: 'center',
    gap: 2,
  },
});
