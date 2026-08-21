import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  AnimalCard,
  AnimalQuizEngine,
} from '../../features/animals/presentation/components';
import {
  ANIMAL_QUIZZES,
  BIRDS_DATA,
} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'Birds'>;

export function BirdsScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentBird = BIRDS_DATA[selectedIdx] ?? BIRDS_DATA[0]!;
  const quizQuestions = ANIMAL_QUIZZES.birds ?? [];

  const handleNextBird = () => {
    if (selectedIdx < BIRDS_DATA.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      setMode('quiz');
    }
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'birds',
      'birds_mastery',
      stars,
      score,
      currentBird.name,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'birds',
      title: 'Bird Watcher Star 🪶',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'sea_animals',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Birds"
        subtitle="Explore peacocks, parrots, penguins, and flamingos!"
        emoji="🐦"
        accentColor="#0EA5E9"
        titleColor="#0EA5E9"
      />

      {/* Mode Switcher */}
      <View style={styles.modeTabs}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Birds explorer mode"
          onPress={() => setMode('learn')}
          style={[styles.modeTab, mode === 'learn' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'learn' && styles.modeTabTextActive,
            ]}>
            🐦 Birds ({BIRDS_DATA.length})
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Bird quiz mode"
          onPress={() => setMode('quiz')}
          style={[styles.modeTab, mode === 'quiz' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'quiz' && styles.modeTabTextActive,
            ]}>
            🎯 Bird Quiz
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {mode === 'learn' ? (
          <>
            {/* Birds Selector Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorScroll}>
              {BIRDS_DATA.map((bird, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <Pressable
                    key={bird.id}
                    accessibilityRole="button"
                    accessibilityLabel={bird.name}
                    onPress={() => setSelectedIdx(idx)}
                    style={[
                      styles.birdPill,
                      {backgroundColor: isSelected ? bird.color : '#FFFFFF'},
                    ]}>
                    <Text style={styles.birdPillEmoji}>{bird.emoji}</Text>
                    <Text
                      style={[
                        styles.birdPillText,
                        {color: isSelected ? '#FFFFFF' : '#374151'},
                      ]}>
                      {bird.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <AnimalCard animal={currentBird} onNext={handleNextBird} />
          </>
        ) : (
          <AnimalQuizEngine
            questions={quizQuestions}
            accentColor="#0EA5E9"
            onFinish={handleFinishQuiz}
          />
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  modeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0EA5E9',
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  modeTabTextActive: {
    color: '#0284C7',
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  selectorScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  birdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  birdPillEmoji: {
    fontSize: 18,
  },
  birdPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
