import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DrawingCanvas,
  DrawingHeader,
} from '../../features/drawing/presentation/components';
import {CREATIVE_CHALLENGES} from '../../features/drawing/domain/catalog/drawingData';
import {recordDrawingLessonResult} from '../../features/drawing/data/progress/drawingProgress';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<
  DrawingStackParamList,
  'CreativeChallenge'
>;

export function CreativeChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentChallenge =
    CREATIVE_CHALLENGES[selectedIdx] ?? CREATIVE_CHALLENGES[0]!;

  const handleSaveSuccess = () => {
    recordDrawingLessonResult(
      'creative_challenge',
      `challenge_${currentChallenge.id}`,
      3,
      100,
      currentChallenge.title,
    );
  };

  return (
    <AppSafeAreaView>
      <DrawingHeader
        title="Creative Challenges"
        subtitle="Fun imagination prompts to inspire your art!"
        emoji="🏆"
        accentColor="#EA580C"
        showGalleryBtn={true}
        onGalleryPress={() => navigation.navigate('MyGallery')}
      />

      {/* Challenge Selector */}
      <View style={styles.pickerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickerScroll}>
          {CREATIVE_CHALLENGES.map((ch, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <Pressable
                key={ch.id}
                accessibilityRole="button"
                accessibilityLabel={ch.title}
                onPress={() => setSelectedIdx(idx)}
                style={[styles.chPill, isSelected && styles.chPillActive]}>
                <Text style={styles.chEmoji}>{ch.emoji}</Text>
                <Text
                  style={[
                    styles.chPillText,
                    isSelected && styles.chPillTextActive,
                  ]}>
                  {ch.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Challenge Prompt Card */}
        <View style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <Text style={styles.mainEmoji}>{currentChallenge.emoji}</Text>
            <View style={styles.promptTitleCol}>
              <Text style={styles.promptTitle}>{currentChallenge.title}</Text>
              <Text style={styles.promptDesc}>{currentChallenge.prompt}</Text>
            </View>
          </View>

          {/* Inspirational Tips */}
          <View style={styles.tipsBox}>
            <Text style={styles.tipsHeader}>💡 Drawing Tips:</Text>
            {currentChallenge.inspirationalTips.map((tip, tIdx) => (
              <Text key={tIdx} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>

        {/* Challenge Drawing Canvas */}
        <DrawingCanvas
          key={currentChallenge.id}
          initialTitle={currentChallenge.title}
          categoryType="challenge"
          onSaveSuccess={handleSaveSuccess}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  pickerWrapper: {
    paddingBottom: 6,
  },
  pickerScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  chPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  chPillActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  chEmoji: {
    fontSize: 18,
  },
  chPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  chPillTextActive: {
    color: '#C2410C',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFEDD5',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainEmoji: {
    fontSize: 44,
  },
  promptTitleCol: {
    flex: 1,
    gap: 2,
  },
  promptTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
  },
  promptDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 18,
  },
  tipsBox: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 12,
    gap: 4,
  },
  tipsHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  tipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350F',
    lineHeight: 16,
  },
});
