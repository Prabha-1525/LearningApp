import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {STORIES_DATA} from '../../features/story/domain/catalog/storiesData';
import {storyAudio} from '../../features/story/domain/audio/storyAudioEngine';
import {markStoryCompleted} from '../../features/story/data/progress/storyProgress';
import type {StoryStackParamList} from '../../navigation/storyTypes';

type Nav = NativeStackNavigationProp<StoryStackParamList, 'StoryCompletion'>;
type Route = RouteProp<StoryStackParamList, 'StoryCompletion'>;

export function StoryCompletionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {storyId} = route.params;

  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const story = STORIES_DATA.find(s => s.id === storyId) ?? STORIES_DATA[0]!;

  useEffect(() => {
    // Record completion in MMKV
    markStoryCompleted(story.id, 3);

    // Audio celebration
    storyAudio.playCelebrationFanfare();
    storyAudio.speak(
      `Congratulations! You finished the story: ${story.title}! You earned three stars!`,
    );

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, story.id, story.title]);

  const handleReadAgain = () => {
    navigation.navigate('StoryPlayer', {
      storyId: story.id,
      initialSceneIndex: 0,
    });
  };

  const handleGoHome = () => {
    navigation.navigate('StoryHome');
  };

  // Find next story
  const currentIndex = STORIES_DATA.findIndex(s => s.id === story.id);
  const nextStory = STORIES_DATA[(currentIndex + 1) % STORIES_DATA.length];

  const handleNextStory = () => {
    if (nextStory) {
      navigation.navigate('StoryPreview', {storyId: nextStory.id});
    } else {
      handleGoHome();
    }
  };

  return (
    <AppSafeAreaView>
      <View style={styles.container}>
        <Animated.View style={[styles.card, {transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.celebrationEmoji}>🎉 📖 🏆</Text>
          <Text style={styles.title}>Story Complete!</Text>
          <Text style={styles.subTitle}>{story.title}</Text>

          {/* Stars Row */}
          <View style={styles.starsRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.star}>⭐</Text>
          </View>

          {/* Moral Box */}
          <View style={styles.moralCard}>
            <Text style={styles.moralTitle}>💡 Positive Value</Text>
            <Text style={styles.moralText}>"{story.moralLesson}"</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsCol}>
            {nextStory && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next story"
                onPress={handleNextStory}
                style={[styles.nextBtn, {backgroundColor: story.accentColor}]}>
                <Text style={styles.nextBtnText}>Next Story ➔</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Read again"
              onPress={handleReadAgain}
              style={styles.againBtn}>
              <Text style={styles.againBtnText}>Read Again 🔄</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Story Time"
              onPress={handleGoHome}
              style={styles.homeBtn}>
              <Text style={styles.homeBtnText}>Back to Stories 📖</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F59E0B',
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  celebrationEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  star: {
    fontSize: 38,
  },
  moralCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 14,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  moralTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  moralText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  nextBtn: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  againBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  againBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  homeBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '800',
  },
});
