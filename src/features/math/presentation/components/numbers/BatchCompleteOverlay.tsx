import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

import {AppText, PrimaryButton, animationPresets, useTheme} from '@shared/ui';

type Props = {
  readonly visible: boolean;
  readonly stars: number;
  readonly greatJobs: number;
  readonly labels: {
    readonly title: string;
    readonly subtitle: string;
    readonly starsLabel: string;
    readonly keepGoing: string;
  };
  readonly onContinue: () => void;
};

/** Celebration overlay when a practice batch is complete. */
export function BatchCompleteOverlay({
  visible,
  stars,
  greatJobs,
  labels,
  onContinue,
}: Props) {
  const {radius, space} = useTheme();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      scale.value = 0.8;
      opacity.value = 0;
      return;
    }
    opacity.value = withTiming(1, {duration: 280});
    scale.value = withSpring(1, animationPresets.spring);
  }, [opacity, scale, visible]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.backdrop}>
      <Animated.View
        style={[
          styles.card,
          {
            borderRadius: radius.lg,
            padding: space.lg,
            gap: space.md,
          },
          anim,
        ]}>
        <AppText style={styles.trophy}>🏆</AppText>
        <AppText variant="headline" tone="ink" style={styles.center}>
          {labels.title}
        </AppText>
        <AppText variant="body" tone="muted" style={styles.center}>
          {labels.subtitle}
        </AppText>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <AppText style={styles.statEmoji}>⭐</AppText>
            <AppText variant="title" tone="ink">
              {stars}
            </AppText>
            <AppText variant="caption" tone="muted">
              {labels.starsLabel}
            </AppText>
          </View>
          <View style={styles.statBox}>
            <AppText style={styles.statEmoji}>🌟</AppText>
            <AppText variant="title" tone="ink">
              {greatJobs}
            </AppText>
            <AppText variant="caption" tone="muted">
              Great Jobs
            </AppText>
          </View>
        </View>
        <View style={styles.confetti}>
          {['🎉', '✨', '🎈', '💫', '🌟'].map((e, i) => (
            <AppText key={i} style={styles.confettiPiece}>
              {e}
            </AppText>
          ))}
        </View>
        <PrimaryButton label={labels.keepGoing} onPress={onContinue} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(45, 27, 78, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFF8E7',
    borderWidth: 4,
    borderColor: '#F4B400',
    alignItems: 'center',
  },
  trophy: {fontSize: 64},
  center: {textAlign: 'center'},
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minWidth: 110,
    borderWidth: 2,
    borderColor: '#4DB7E8',
  },
  statEmoji: {fontSize: 28},
  confetti: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  confettiPiece: {fontSize: 28},
});
