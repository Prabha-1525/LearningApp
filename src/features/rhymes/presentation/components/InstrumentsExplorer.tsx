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
import {MUSIC_INSTRUMENTS} from '../../domain/catalog/musicData';
import {musicSynth} from '../../domain/audio/musicAudioEngine';
import type {Instrument} from '../../domain/entities/musicEntities';

interface InstrumentsExplorerProps {
  readonly onExploreInstrument?: (instrumentId: string) => void;
  readonly onComplete?: (stars: number) => void;
}

export function InstrumentsExplorer({
  onExploreInstrument,
  onComplete,
}: InstrumentsExplorerProps) {
  const {t} = useTranslation();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [exploredIds, setExploredIds] = useState<string[]>([
    MUSIC_INSTRUMENTS[0]?.id ?? 'piano',
  ]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const soundWaveAnim = useRef(new Animated.Value(1)).current;

  const current: Instrument =
    MUSIC_INSTRUMENTS[selectedIdx] ?? MUSIC_INSTRUMENTS[0]!;

  const triggerBounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceAnim]);

  const handlePlaySound = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setIsPlaying(true);
    triggerBounce();

    // Pulse sound wave
    Animated.sequence([
      Animated.timing(soundWaveAnim, {
        toValue: 1.25,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(soundWaveAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (current.id === 'drum') {
      musicSynth.playDrumBeat();
    } else {
      musicSynth.playInstrumentSequence(
        current.noteSequence,
        current.id === 'flute'
          ? 'triangle'
          : current.id === 'trumpet'
          ? 'sawtooth'
          : 'sine',
      );
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  }, [current, isPlaying, soundWaveAnim, triggerBounce]);

  const handleSelectInstrument = (idx: number) => {
    setSelectedIdx(idx);
    const inst = MUSIC_INSTRUMENTS[idx];
    if (inst && !exploredIds.includes(inst.id)) {
      const nextExplored = [...exploredIds, inst.id];
      setExploredIds(nextExplored);
      onExploreInstrument?.(inst.id);
      if (nextExplored.length >= MUSIC_INSTRUMENTS.length) {
        onComplete?.(3);
      }
    }
  };

  useEffect(() => {
    handlePlaySound();
  }, [selectedIdx, handlePlaySound]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Instrument Selector Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {MUSIC_INSTRUMENTS.map((inst, idx) => {
          const isSelected = idx === selectedIdx;
          const isExplored = exploredIds.includes(inst.id);

          return (
            <Pressable
              key={inst.id}
              accessibilityRole="button"
              onPress={() => handleSelectInstrument(idx)}
              style={[
                styles.pill,
                isSelected && {
                  backgroundColor: inst.accentColor,
                  borderColor: inst.accentColor,
                },
              ]}>
              <Text style={styles.pillEmoji}>{inst.emoji}</Text>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                {t(inst.nameKey, inst.id)}
              </Text>
              {isExplored && !isSelected && (
                <Text style={styles.exploredStar}>⭐</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Instrument Card */}
      <View style={[styles.mainCard, {borderColor: current.accentColor}]}>
        {/* Family Badge */}
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.familyBadge,
              {backgroundColor: `${current.accentColor}20`},
            ]}>
            <Text
              style={[styles.familyBadgeText, {color: current.accentColor}]}>
              Family: {t(current.familyKey, current.family.toUpperCase())}
            </Text>
          </View>
          <Text style={styles.progressCounter}>
            {exploredIds.length} of {MUSIC_INSTRUMENTS.length} Explored
          </Text>
        </View>

        {/* Big Animated Icon */}
        <View
          style={[
            styles.iconStage,
            {backgroundColor: `${current.accentColor}15`},
          ]}>
          <Animated.Text
            style={[styles.bigEmoji, {transform: [{scale: bounceAnim}]}]}>
            {current.emoji}
          </Animated.Text>
        </View>

        {/* Instrument Title */}
        <Text style={[styles.instrumentTitle, {color: current.accentColor}]}>
          {t(current.nameKey, current.id)}
        </Text>

        {/* Sound Description */}
        <View style={styles.soundDescBox}>
          <Text style={styles.soundDescIcon}>🎶</Text>
          <Text style={styles.soundDescText}>
            {t(current.soundDescriptionKey, '')}
          </Text>
        </View>

        {/* Play Sound Button */}
        <Animated.View style={{transform: [{scale: soundWaveAnim}]}}>
          <Pressable
            accessibilityRole="button"
            onPress={handlePlaySound}
            style={[
              styles.playBtn,
              {backgroundColor: current.accentColor},
              isPlaying && styles.playBtnActive,
            ]}>
            <Text style={styles.playBtnIcon}>{isPlaying ? '🔊 🎶' : '🔊'}</Text>
            <Text style={styles.playBtnText}>
              {isPlaying ? 'Playing Sound...' : 'Play Instrument Sound!'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Fun Educational Fact Box */}
        <View style={styles.factBox}>
          <Text style={styles.factTitle}>💡 Fun Musical Fact:</Text>
          <Text style={styles.factText}>{t(current.factKey, '')}</Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  pillEmoji: {
    fontSize: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  exploredStar: {
    fontSize: 10,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  familyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  familyBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  progressCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  iconStage: {
    height: 140,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: {
    fontSize: 72,
  },
  instrumentTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  soundDescBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  soundDescIcon: {
    fontSize: 20,
  },
  soundDescText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  playBtnActive: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  playBtnIcon: {
    fontSize: 20,
  },
  playBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  factBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  factTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400E',
  },
  factText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
});
