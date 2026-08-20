import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MUSIC_PATTERN_PUZZLES} from '../../domain/catalog/musicData';
import {musicSynth} from '../../domain/audio/musicAudioEngine';
import type {MusicPatternPuzzle} from '../../domain/entities/musicEntities';

interface MusicPatternsGameProps {
  readonly onComplete?: (stars: number) => void;
}

export function MusicPatternsGame({onComplete}: MusicPatternsGameProps) {
  const {t} = useTranslation();
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const puzzle: MusicPatternPuzzle =
    MUSIC_PATTERN_PUZZLES[puzzleIdx] ?? MUSIC_PATTERN_PUZZLES[0]!;

  const handleSelectOption = (optId: string, isRight: boolean) => {
    setSelectedOptionId(optId);
    if (isRight) {
      setIsCorrect(true);
      musicSynth.playTone(523.25, 300); // C5 victory chime
      onComplete?.(3);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextPuzzle = () => {
    setPuzzleIdx(i => (i + 1) % MUSIC_PATTERN_PUZZLES.length);
    setSelectedOptionId(null);
    setIsCorrect(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {MUSIC_PATTERN_PUZZLES.map((_, idx) => {
          const isSelected = idx === puzzleIdx;
          return (
            <Pressable
              key={`pat-${idx}`}
              accessibilityRole="button"
              onPress={() => {
                setPuzzleIdx(idx);
                setSelectedOptionId(null);
                setIsCorrect(null);
              }}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                🎶 Pattern {idx + 1}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {t('rhymes.patterns.instruction', 'Complete the musical pattern:')}
        </Text>

        {/* The Sequence Track */}
        <View style={styles.sequenceTrack}>
          {puzzle.sequence.map((emoji, idx) => {
            const isMystery = emoji === '❓';
            return (
              <View
                key={`item-${idx}`}
                style={[
                  styles.sequenceSlot,
                  isMystery && styles.sequenceSlotMystery,
                ]}>
                <Text style={styles.sequenceEmoji}>{emoji}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.choiceLabel}>
          👇 Which instrument comes next in the sequence?
        </Text>

        {/* Choices */}
        <View style={styles.optionsRow}>
          {puzzle.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = styles.optBtn;
            if (isSelected && isCorrect === true) {
              btnStyle = styles.optBtnCorrect;
            } else if (isSelected && isCorrect === false) {
              btnStyle = styles.optBtnWrong;
            }

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                onPress={() => handleSelectOption(opt.id, opt.isCorrect)}
                style={btnStyle}>
                <Text style={styles.optEmoji}>{opt.emoji}</Text>
                <Text style={styles.optLabel}>{t(opt.nameKey, opt.id)}</Text>
                {isSelected && isCorrect === true && (
                  <Text style={styles.badge}>✅</Text>
                )}
                {isSelected && isCorrect === false && (
                  <Text style={styles.badge}>❌</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Feedback Banner */}
        {isCorrect === true && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>
              🎉 Outstanding! You found the musical repeating pattern! 🌟
            </Text>
            {puzzleIdx + 1 < MUSIC_PATTERN_PUZZLES.length && (
              <Pressable
                accessibilityRole="button"
                onPress={handleNextPuzzle}
                style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next Pattern ❯</Text>
              </Pressable>
            )}
          </View>
        )}

        {isCorrect === false && (
          <View style={styles.wrongBanner}>
            <Text style={styles.wrongText}>
              ❌ Look at the order of the instruments from left to right again!
            </Text>
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
  pillSelected: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  sequenceTrack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  sequenceSlot: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  sequenceSlotMystery: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  sequenceEmoji: {
    fontSize: 26,
  },
  choiceLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  optBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optEmoji: {
    fontSize: 32,
  },
  optLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E293B',
  },
  badge: {
    fontSize: 12,
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
  successText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  wrongBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  wrongText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
  },
});
