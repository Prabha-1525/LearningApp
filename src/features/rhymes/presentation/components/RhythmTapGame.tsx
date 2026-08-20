import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RHYTHM_LEVELS} from '../../domain/catalog/musicData';
import {musicSynth} from '../../domain/audio/musicAudioEngine';
import type {RhythmLevel} from '../../domain/entities/musicEntities';

interface RhythmTapGameProps {
  readonly onLevelComplete?: (levelNumber: number, stars: number) => void;
}

export function RhythmTapGame({onLevelComplete}: RhythmTapGameProps) {
  const {t} = useTranslation();
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [activeBeatIdx, setActiveBeatIdx] = useState<number>(-1);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const drumBounceAnim = useRef(new Animated.Value(1)).current;
  const pulseRingAnim = useRef(new Animated.Value(1)).current;

  const currentLevel: RhythmLevel =
    RHYTHM_LEVELS[levelIdx] ?? RHYTHM_LEVELS[0]!;

  const triggerDrumBounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(drumBounceAnim, {
        toValue: 1.25,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(drumBounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [drumBounceAnim]);

  // Play demo rhythm sequence
  const handlePlayDemo = useCallback(() => {
    if (isPlayingDemo) {
      return;
    }
    setIsPlayingDemo(true);
    setUserTaps([]);
    setIsSuccess(null);
    setActiveBeatIdx(-1);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= currentLevel.beats.length) {
        clearInterval(interval);
        setIsPlayingDemo(false);
        setActiveBeatIdx(-1);
        return;
      }

      const beat = currentLevel.beats[idx];
      setActiveBeatIdx(idx);

      if (beat?.type === 'hit') {
        musicSynth.playDrumBeat();
        triggerDrumBounce();
      }

      idx += 1;
    }, currentLevel.beats[0]?.durationMs ?? 500);
  }, [currentLevel, isPlayingDemo, triggerDrumBounce]);

  useEffect(() => {
    handlePlayDemo();
  }, [levelIdx, handlePlayDemo]);

  // User taps the drum
  const handleUserTap = () => {
    if (isPlayingDemo || isSuccess === true) {
      return;
    }
    musicSynth.playDrumBeat();
    triggerDrumBounce();

    // Pulse animation
    Animated.sequence([
      Animated.timing(pulseRingAnim, {
        toValue: 1.2,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(pulseRingAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const expectedHits = currentLevel.beats.filter(
      b => b.type === 'hit',
    ).length;
    const nextTaps = [...userTaps, Date.now()];
    setUserTaps(nextTaps);

    // If user tapped all required hits
    if (nextTaps.length === expectedHits) {
      setIsSuccess(true);
      onLevelComplete?.(currentLevel.levelNumber, 3);
    }
  };

  const handleNextLevel = () => {
    setLevelIdx(i => (i + 1) % RHYTHM_LEVELS.length);
    setUserTaps([]);
    setIsSuccess(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Level Selector Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {RHYTHM_LEVELS.map((lvl, idx) => {
          const isSelected = idx === levelIdx;
          return (
            <Pressable
              key={lvl.id}
              accessibilityRole="button"
              onPress={() => {
                setLevelIdx(idx);
                setUserTaps([]);
                setIsSuccess(null);
              }}
              style={[
                styles.pill,
                isSelected && {
                  backgroundColor: lvl.accentColor,
                  borderColor: lvl.accentColor,
                },
              ]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                🥁 Beat {lvl.levelNumber}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Rhythm Stage */}
      <View style={[styles.mainCard, {borderColor: currentLevel.accentColor}]}>
        <View style={styles.cardHeader}>
          <Text style={styles.levelTitle}>
            Level {currentLevel.levelNumber}: {t(currentLevel.titleKey, '')}
          </Text>
          <View
            style={[
              styles.diffBadge,
              currentLevel.difficulty === 'easy'
                ? styles.diffEasy
                : currentLevel.difficulty === 'medium'
                ? styles.diffMed
                : styles.diffHard,
            ]}>
            <Text style={styles.diffBadgeText}>
              {currentLevel.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Visual Beat Ball Track */}
        <View style={styles.trackBox}>
          <Text style={styles.trackLabel}>
            {isPlayingDemo
              ? '🎧 Listen to the rhythm pattern:'
              : '👉 Your turn to tap the drum below!'}
          </Text>
          <View style={styles.beatsRow}>
            {currentLevel.beats.map((beat, idx) => {
              const isActive = activeBeatIdx === idx;
              const isHit = beat.type === 'hit';

              return (
                <View
                  key={beat.id}
                  style={[
                    styles.beatBall,
                    isHit ? styles.beatBallHit : styles.beatBallRest,
                    isActive && styles.beatBallActive,
                  ]}>
                  <Text style={styles.beatEmoji}>{beat.soundEmoji}</Text>
                  <Text style={styles.beatLabel}>{beat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tap Drum Stage */}
        <View style={styles.drumSection}>
          <Animated.View
            style={[
              styles.drumOuterRing,
              {transform: [{scale: pulseRingAnim}]},
            ]}>
            <Pressable
              accessibilityRole="button"
              disabled={isPlayingDemo}
              onPress={handleUserTap}
              style={styles.drumBtn}>
              <Animated.Text
                style={[
                  styles.drumEmoji,
                  {transform: [{scale: drumBounceAnim}]},
                ]}>
                🥁
              </Animated.Text>
              <Text style={styles.drumBtnLabel}>
                {isPlayingDemo ? 'Listening...' : 'TAP THE BEAT!'}
              </Text>
            </Pressable>
          </Animated.View>

          <Text style={styles.tapCounterText}>
            Taps: {userTaps.length} /{' '}
            {currentLevel.beats.filter(b => b.type === 'hit').length}
          </Text>
        </View>

        {/* Demo Button */}
        <Pressable
          accessibilityRole="button"
          disabled={isPlayingDemo}
          onPress={handlePlayDemo}
          style={styles.demoBtn}>
          <Text style={styles.demoBtnText}>
            {isPlayingDemo ? '🎶 Playing Demo...' : '🔁 Hear Rhythm Again'}
          </Text>
        </Pressable>

        {/* Success / Next Level Banner */}
        {isSuccess === true && (
          <View style={styles.successBanner}>
            <Text style={styles.successTitle}>
              🎉 INCREDIBLE RHYTHM! You kept the beat perfectly! ⭐
            </Text>
            {levelIdx + 1 < RHYTHM_LEVELS.length && (
              <Pressable
                accessibilityRole="button"
                onPress={handleNextLevel}
                style={styles.nextLevelBtn}>
                <Text style={styles.nextLevelBtnText}>
                  Next Beat Level {levelIdx + 2} ❯
                </Text>
              </Pressable>
            )}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diffEasy: {
    backgroundColor: '#DCFCE7',
  },
  diffMed: {
    backgroundColor: '#FEF3C7',
  },
  diffHard: {
    backgroundColor: '#FEE2E2',
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E293B',
  },
  trackBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  trackLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  beatsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  beatBall: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  beatBallHit: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  beatBallRest: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  beatBallActive: {
    backgroundColor: '#FEF08A',
    borderColor: '#EAB308',
    transform: [{scale: 1.15}],
  },
  beatEmoji: {
    fontSize: 22,
  },
  beatLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1E293B',
  },
  drumSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  drumOuterRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drumBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    shadowColor: '#EF4444',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  drumEmoji: {
    fontSize: 44,
  },
  drumBtnLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  tapCounterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  demoBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
  },
  successTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
  },
  nextLevelBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  nextLevelBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
