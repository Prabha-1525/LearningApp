import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated from 'react-native-reanimated';

import {
  AppText,
  MascotSpot,
  PrimaryButton,
  ProgressBar,
  RewardBadge,
  useFadeIn,
  usePulse,
  useTheme,
} from '@shared/ui';

import type {CelebrationEvent} from '../domain/entities/RewardGrant';

export type CelebrationOverlayProps = {
  readonly event: CelebrationEvent | null;
  readonly onDone: () => void;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
};

/**
 * Shell celebration host — driven by gamification pendingCelebrations queue.
 */
export function CelebrationOverlay({
  event,
  onDone,
  reduceMotion = false,
  testID,
}: CelebrationOverlayProps) {
  const {t} = useTranslation();
  const {theme, radius, space} = useTheme();
  const visible = event != null;
  const fade = useFadeIn(visible, reduceMotion);
  const pulse = usePulse(visible && event?.animation === 'pulse', reduceMotion);

  useEffect(() => {
    if (event == null) {
      return;
    }
    const timer = setTimeout(onDone, reduceMotion ? 800 : 2200);
    return () => clearTimeout(timer);
  }, [event, onDone, reduceMotion]);

  if (event == null) {
    return null;
  }

  return (
    <Animated.View
      testID={testID ?? 'celebration-overlay'}
      pointerEvents="box-none"
      style={[styles.overlay, fade, {backgroundColor: theme.colors.overlay}]}>
      <Animated.View
        style={[
          styles.card,
          pulse,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: radius.lg,
            padding: space.lg,
            borderColor: theme.colors.reward,
            gap: space.sm,
          },
        ]}>
        {event.animation === 'confetti' || event.animation === 'burst' ? (
          <MascotSpot mood="cheer" size={88} />
        ) : (
          <MascotSpot mood="happy" size={72} />
        )}
        <AppText variant="title" tone="ink" style={styles.center}>
          {t(event.titleKey)}
        </AppText>
        <View style={styles.row}>
          {event.starsEarned > 0 ? (
            <RewardBadge
              count={event.starsEarned}
              label={t('gamification.currency.stars')}
            />
          ) : null}
          {event.coinsEarned > 0 ? (
            <RewardBadge
              count={event.coinsEarned}
              label={t('gamification.currency.coins')}
              active={false}
            />
          ) : null}
        </View>
        {event.levelReached ? (
          <AppText variant="headline" tone="primary">
            Level {event.levelReached}
          </AppText>
        ) : null}
        {event.xpEarned > 0 ? (
          <ProgressBar progress={1} label={`+${event.xpEarned} XP`} />
        ) : null}
        <PrimaryButton label={t('gamification.yay')} onPress={onDone} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 50,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 2,
  },
  center: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
