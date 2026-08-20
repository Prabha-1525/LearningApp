import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  GUESS_SOUND_QUESTIONS,
  MUSIC_INSTRUMENTS,
} from '../../domain/catalog/musicData';
import {musicSynth} from '../../domain/audio/musicAudioEngine';
import type {
  GuessSoundQuestion,
  Instrument,
} from '../../domain/entities/musicEntities';

interface GuessSoundGameProps {
  readonly onCorrectGuess?: () => void;
  readonly onComplete?: (stars: number) => void;
}

export function GuessSoundGame({
  onCorrectGuess,
  onComplete,
}: GuessSoundGameProps) {
  const {t} = useTranslation();
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const question: GuessSoundQuestion =
    GUESS_SOUND_QUESTIONS[questionIdx] ?? GUESS_SOUND_QUESTIONS[0]!;

  const targetInst: Instrument | undefined = MUSIC_INSTRUMENTS.find(
    i => i.id === question.targetInstrumentId,
  );

  const handlePlayMysterySound = useCallback(() => {
    if (!targetInst || isPlaying) {
      return;
    }
    setIsPlaying(true);
    if (targetInst.id === 'drum') {
      musicSynth.playDrumBeat();
    } else {
      musicSynth.playInstrumentSequence(
        targetInst.noteSequence,
        targetInst.id === 'flute'
          ? 'triangle'
          : targetInst.id === 'trumpet'
          ? 'sawtooth'
          : 'sine',
      );
    }
    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  }, [isPlaying, targetInst]);

  useEffect(() => {
    handlePlayMysterySound();
  }, [questionIdx, handlePlayMysterySound]);

  const handleSelectOption = (instId: string) => {
    if (selectedOptionId !== null) {
      return;
    }
    setSelectedOptionId(instId);
    const isCorrect = instId === question.targetInstrumentId;

    if (isCorrect) {
      setIsAnswered(true);
      onCorrectGuess?.();
      if (questionIdx + 1 >= GUESS_SOUND_QUESTIONS.length) {
        onComplete?.(3);
      }
    } else {
      setIsAnswered(false);
    }
  };

  const handleNext = () => {
    setQuestionIdx(i => (i + 1) % GUESS_SOUND_QUESTIONS.length);
    setSelectedOptionId(null);
    setIsAnswered(null);
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
        {GUESS_SOUND_QUESTIONS.map((_, idx) => {
          const isSelected = idx === questionIdx;
          return (
            <Pressable
              key={`q-${idx}`}
              accessibilityRole="button"
              onPress={() => {
                setQuestionIdx(idx);
                setSelectedOptionId(null);
                setIsAnswered(null);
              }}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                👂 Sound {idx + 1}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.promptTitle}>
          {t('rhymes.guess.header', 'Listen to the mystery sound!')}
        </Text>
        <Text style={styles.promptSub}>
          {t('rhymes.guess.sub', 'What instrument is making this sound?')}
        </Text>

        {/* Mystery Speaker Stage */}
        <Pressable
          accessibilityRole="button"
          onPress={handlePlayMysterySound}
          style={[styles.speakerBox, isPlaying && styles.speakerBoxPlaying]}>
          <Text style={styles.speakerEmoji}>{isPlaying ? '🔊 🎶' : '🔊'}</Text>
          <Text style={styles.speakerLabel}>
            {isPlaying ? 'Playing Sound...' : 'Tap to Hear Sound Again!'}
          </Text>
        </Pressable>

        {/* 3 Visual Choices */}
        <View style={styles.optionsGrid}>
          {question.options.map(optId => {
            const inst = MUSIC_INSTRUMENTS.find(i => i.id === optId);
            if (!inst) {
              return null;
            }

            const isSelected = selectedOptionId === optId;
            let cardStyle = styles.optCard;
            if (isSelected && isAnswered === true) {
              cardStyle = styles.optCardCorrect;
            } else if (isSelected && isAnswered === false) {
              cardStyle = styles.optCardWrong;
            }

            return (
              <Pressable
                key={optId}
                accessibilityRole="button"
                onPress={() => handleSelectOption(optId)}
                style={cardStyle}>
                <Text style={styles.optEmoji}>{inst.emoji}</Text>
                <Text style={styles.optName}>{t(inst.nameKey, inst.id)}</Text>
                {isSelected && isAnswered === true && (
                  <Text style={styles.badge}>✅ Correct!</Text>
                )}
                {isSelected && isAnswered === false && (
                  <Text style={styles.badge}>❌ Try Again</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Feedback Banner */}
        {isAnswered === true && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>
              🎉 BINGO! You recognized the {targetInst?.emoji}{' '}
              {t(targetInst?.nameKey ?? '', '')}!
            </Text>
            {questionIdx + 1 < GUESS_SOUND_QUESTIONS.length && (
              <Pressable
                accessibilityRole="button"
                onPress={handleNext}
                style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next Sound ❯</Text>
              </Pressable>
            )}
          </View>
        )}

        {isAnswered === false && (
          <View style={styles.wrongBanner}>
            <Text style={styles.wrongText}>
              ❌ Listen closely to the pitch and tone! Tap the speaker to hear
              it again.
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
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
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
  promptTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  promptSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  speakerBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D8B4FE',
    gap: 6,
  },
  speakerBoxPlaying: {
    backgroundColor: '#F3E8FF',
    transform: [{scale: 1.03}],
  },
  speakerEmoji: {
    fontSize: 48,
  },
  speakerLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7E22CE',
  },
  optionsGrid: {
    gap: 10,
  },
  optCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    gap: 12,
  },
  optCardCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optCardWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optEmoji: {
    fontSize: 28,
  },
  optName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
  },
  badge: {
    fontSize: 12,
    fontWeight: '900',
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
    backgroundColor: '#8B5CF6',
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
