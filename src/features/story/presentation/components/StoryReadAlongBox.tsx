import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {storyAudio} from '../../domain/audio/storyAudioEngine';

interface StoryReadAlongBoxProps {
  readonly text: string;
  readonly narrationText: string;
  readonly sceneIndex: number;
  readonly totalScenes: number;
  readonly isAutoPlay: boolean;
  readonly isPlaying: boolean;
  readonly accentColor?: string;
  readonly onToggleAutoPlay: () => void;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export function StoryReadAlongBox({
  text,
  narrationText,
  sceneIndex,
  totalScenes,
  isAutoPlay,
  isPlaying,
  accentColor = '#C4A05A',
  onToggleAutoPlay,
  onPrevious,
  onNext,
}: StoryReadAlongBoxProps) {
  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === totalScenes - 1;

  const handleReplay = () => {
    storyAudio.speak(narrationText);
  };

  return (
    <View style={styles.container}>
      {/* Progress & Auto-narration Header */}
      <View style={styles.topRow}>
        <View style={styles.sceneIndicator}>
          <Text style={styles.sceneText}>
            Scene {sceneIndex + 1} of {totalScenes}
          </Text>
          <View style={styles.dotsRow}>
            {Array.from({length: totalScenes}).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === sceneIndex && {
                    backgroundColor: accentColor,
                    width: 22,
                  },
                  idx < sceneIndex && styles.dotCompleted,
                ]}
              />
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Auto narration ${isAutoPlay ? 'on' : 'off'}`}
          onPress={onToggleAutoPlay}
          style={[
            styles.autoPlayBtn,
            isAutoPlay && {backgroundColor: accentColor},
          ]}>
          <Text
            style={[
              styles.autoPlayText,
              isAutoPlay && styles.autoPlayTextActive,
            ]}>
            {isAutoPlay ? '🔊 Auto On' : '🔈 Auto Off'}
          </Text>
        </Pressable>
      </View>

      {/* Main Story Reading Card */}
      <View style={styles.textCard}>
        <Text style={styles.storyText}>{text}</Text>

        {/* Audio Replay Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Replay narration"
          onPress={handleReplay}
          style={styles.replayPill}>
          <Text style={styles.replayIcon}>{isPlaying ? '⏸️' : '🔊'}</Text>
          <Text style={styles.replayText}>Listen Again</Text>
        </Pressable>
      </View>

      {/* Navigation Controls Row */}
      <View style={styles.navRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous scene"
          disabled={isFirst}
          onPress={onPrevious}
          style={[styles.prevBtn, isFirst && styles.btnDisabled]}>
          <Text style={[styles.prevBtnText, isFirst && styles.textDisabled]}>
            ‹ Previous
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Complete story' : 'Next scene'}
          onPress={onNext}
          style={[styles.nextBtn, {backgroundColor: accentColor}]}>
          <Text style={styles.nextBtnText}>
            {isLast ? 'Complete Story 🎉' : 'Next Scene ➔'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sceneIndicator: {
    gap: 4,
  },
  sceneText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  autoPlayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  autoPlayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  autoPlayTextActive: {
    color: '#FFFFFF',
  },
  textCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 18,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  storyText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 28,
  },
  replayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  replayIcon: {
    fontSize: 14,
  },
  replayText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  prevBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  nextBtn: {
    flex: 1.6,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
