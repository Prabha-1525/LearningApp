import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MELODY_SONGS} from '../../domain/catalog/musicData';
import {PIANO_SCALE, musicSynth} from '../../domain/audio/musicAudioEngine';
import type {MelodyNote, MelodySong} from '../../domain/entities/musicEntities';

interface MelodyPianoGameProps {
  readonly onCompleteSong?: () => void;
}

export function MelodyPianoGame({onCompleteSong}: MelodyPianoGameProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'free' | 'songs'>('free');
  const [selectedSongIdx, setSelectedSongIdx] = useState<number>(0);
  const [currentSongStep, setCurrentSongStep] = useState<number>(0);
  const [activeKeyNote, setActiveKeyNote] = useState<string | null>(null);
  const [isSongFinished, setIsSongFinished] = useState<boolean>(false);

  const song: MelodySong = MELODY_SONGS[selectedSongIdx] ?? MELODY_SONGS[0]!;

  const handleKeyPress = useCallback(
    (noteObj: MelodyNote) => {
      setActiveKeyNote(noteObj.note);
      musicSynth.playTone(noteObj.freq, 350);

      setTimeout(() => {
        setActiveKeyNote(null);
      }, 250);

      if (activeTab === 'songs' && !isSongFinished) {
        const targetNote = song.notes[currentSongStep]?.note;
        if (noteObj.note === targetNote) {
          const nextStep = currentSongStep + 1;
          if (nextStep >= song.notes.length) {
            setIsSongFinished(true);
            onCompleteSong?.();
          } else {
            setCurrentSongStep(nextStep);
          }
        }
      }
    },
    [activeTab, currentSongStep, isSongFinished, onCompleteSong, song.notes],
  );

  const handleSelectSong = (idx: number) => {
    setSelectedSongIdx(idx);
    setCurrentSongStep(0);
    setIsSongFinished(false);
  };

  const currentTargetNote =
    activeTab === 'songs' && !isSongFinished
      ? song.notes[currentSongStep]?.note
      : null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Mode Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="tab"
          onPress={() => {
            setActiveTab('free');
            setIsSongFinished(false);
          }}
          style={[styles.tabBtn, activeTab === 'free' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'free' && styles.tabBtnTextActive,
            ]}>
            🎹 {t('rhymes.piano.tabFree', 'Free Play Piano')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          onPress={() => {
            setActiveTab('songs');
            setCurrentSongStep(0);
            setIsSongFinished(false);
          }}
          style={[styles.tabBtn, activeTab === 'songs' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'songs' && styles.tabBtnTextActive,
            ]}>
            🎵 {t('rhymes.piano.tabSongs', 'Guided Songs')}
          </Text>
        </Pressable>
      </View>

      {/* Guided Song Selector */}
      {activeTab === 'songs' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.songStrip}>
          {MELODY_SONGS.map((s, idx) => {
            const isSelected = idx === selectedSongIdx;
            return (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                onPress={() => handleSelectSong(idx)}
                style={[
                  styles.songPill,
                  isSelected && styles.songPillSelected,
                ]}>
                <Text style={styles.songPillEmoji}>{s.emoji}</Text>
                <Text
                  style={[
                    styles.songPillText,
                    isSelected && styles.songPillTextSelected,
                  ]}>
                  {t(s.titleKey, s.id)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Song Progress Header Banner */}
      {activeTab === 'songs' && (
        <View style={styles.songBanner}>
          <Text style={styles.songTitle}>
            {song.emoji} {t(song.titleKey, '')}
          </Text>
          <Text style={styles.songHint}>
            {isSongFinished
              ? '🎉 Song Complete! You played the full nursery melody!'
              : `Tap the glowing key: ${currentTargetNote}`}
          </Text>
        </View>
      )}

      {/* 8-Key Rainbow Piano Keyboard */}
      <View style={styles.pianoCard}>
        <View style={styles.keyboardContainer}>
          {PIANO_SCALE.map(noteObj => {
            const isPressed = activeKeyNote === noteObj.note;
            const isTarget = currentTargetNote === noteObj.note;

            return (
              <Pressable
                key={noteObj.note}
                accessibilityRole="button"
                accessibilityLabel={`Piano key ${noteObj.solfege}`}
                onPress={() => handleKeyPress(noteObj)}
                style={[
                  styles.pianoKey,
                  {backgroundColor: noteObj.keyColor},
                  isPressed && styles.pianoKeyPressed,
                  isTarget && styles.pianoKeyTargetGlow,
                ]}>
                {isTarget && <Text style={styles.targetDot}>⭐</Text>}
                <Text style={styles.keySolfege}>{noteObj.solfege}</Text>
                <Text style={styles.keyNoteName}>{noteObj.note}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Completion Banner */}
      {isSongFinished && (
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>🌟 🎶 👏</Text>
          <Text style={styles.successTitle}>
            Bravo! You performed {t(song.titleKey, '')}!
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setCurrentSongStep(0);
              setIsSongFinished(false);
            }}
            style={styles.replayBtn}>
            <Text style={styles.replayBtnText}>Play Song Again 🔄</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#F59E0B',
  },
  songStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  songPill: {
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
  songPillSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  songPillEmoji: {
    fontSize: 18,
  },
  songPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  songPillTextSelected: {
    color: '#FFFFFF',
  },
  songBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#92400E',
  },
  songHint: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  pianoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  keyboardContainer: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    justifyContent: 'center',
  },
  pianoKey: {
    flex: 1,
    height: 170,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pianoKeyPressed: {
    transform: [{scale: 0.95}],
    opacity: 0.8,
  },
  pianoKeyTargetGlow: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{scale: 1.05}],
  },
  targetDot: {
    position: 'absolute',
    top: 10,
    fontSize: 14,
  },
  keySolfege: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  keyNoteName: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  successCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 8,
  },
  successEmoji: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
  },
  replayBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  replayBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
