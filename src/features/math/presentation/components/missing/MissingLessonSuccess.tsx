import {Image, StyleSheet, Text, View} from 'react-native';

import {leoCelebrate} from '@assets';
import {PrimaryButton, SecondaryButton} from '@shared/ui';

type MissingLessonSuccessProps = {
  readonly lessonTitle: string;
  readonly correctCount: number;
  readonly totalSteps: number;
  /** Performance stars for this run (1–3). */
  readonly performanceStars: number;
  /** Best stars stored for the lesson. */
  readonly bestStars: number;
  readonly deltaStars: number;
  readonly newBadgeLabels?: readonly string[];
  readonly labels: {
    readonly title: string;
    readonly subtitle: string;
    readonly starsLabel: string;
    readonly bestLabel: string;
    readonly badgeUnlocked: string;
    readonly continue: string;
    readonly nextLesson: string;
    readonly backToHub: string;
  };
  readonly onNextLesson?: () => void;
  readonly onContinue: () => void;
};

/** Full-screen congratulations when a Missing Number lesson is done. */
export function MissingLessonSuccess({
  lessonTitle,
  correctCount,
  totalSteps,
  performanceStars,
  bestStars,
  deltaStars,
  newBadgeLabels = [],
  labels,
  onNextLesson,
  onContinue,
}: MissingLessonSuccessProps) {
  const starRow = '⭐'.repeat(Math.max(1, Math.min(3, performanceStars)));

  return (
    <View style={styles.backdrop} testID="missing-lesson-success">
      <View style={styles.card}>
        <Text style={styles.confetti}>🎉 ✨ 🎈</Text>
        <Image source={leoCelebrate} style={styles.leo} resizeMode="contain" />
        <Text style={styles.title}>{labels.title}</Text>
        <Text style={styles.subtitle}>{labels.subtitle}</Text>
        <Text style={styles.lessonName}>{lessonTitle}</Text>

        <Text style={styles.starBurst}>{starRow}</Text>
        <Text style={styles.starsCaption}>
          {labels.starsLabel}: {performanceStars}
          {deltaStars > 0 ? ` (+${deltaStars})` : ''}
        </Text>
        <Text style={styles.bestCaption}>
          {labels.bestLabel}: {'⭐'.repeat(Math.max(0, bestStars))}
        </Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>
              {correctCount}/{totalSteps}
            </Text>
          </View>
        </View>

        {newBadgeLabels.length > 0 ? (
          <View style={styles.badgeBox}>
            <Text style={styles.badgeTitle}>{labels.badgeUnlocked}</Text>
            {newBadgeLabels.map(label => (
              <Text key={label} style={styles.badgeItem}>
                🏅 {label}
              </Text>
            ))}
          </View>
        ) : null}

        <PrimaryButton label={labels.continue} onPress={onContinue} />
        {onNextLesson ? (
          <SecondaryButton label={labels.nextLesson} onPress={onNextLesson} />
        ) : null}
        <SecondaryButton label={labels.backToHub} onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 64, 175, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFF8E7',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#F4B400',
    padding: 22,
    alignItems: 'center',
    gap: 8,
  },
  confetti: {fontSize: 28},
  leo: {
    width: 140,
    height: 160,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2A4A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B6B74',
    textAlign: 'center',
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  starBurst: {
    fontSize: 36,
    letterSpacing: 4,
    marginTop: 4,
  },
  starsCaption: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
  },
  bestCaption: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7A88',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  stat: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
    minWidth: 96,
  },
  statEmoji: {fontSize: 22},
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  badgeBox: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#86EFAC',
    padding: 12,
    gap: 4,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  badgeItem: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2A4A',
  },
});
