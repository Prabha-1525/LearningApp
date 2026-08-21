import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  AnimalCard,
  AnimalQuizEngine,
  UnderwaterOceanScene,
} from '../../features/animals/presentation/components';
import {
  ANIMAL_QUIZZES,
  SEA_ANIMALS_DATA,
} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'SeaAnimals'>;

export function SeaAnimalsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'ocean' | 'learn' | 'quiz'>('ocean');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentSeaAnimal =
    SEA_ANIMALS_DATA[selectedIdx] ?? SEA_ANIMALS_DATA[0]!;
  const quizQuestions = ANIMAL_QUIZZES.sea_animals ?? [];

  const handleNextAnimal = () => {
    if (selectedIdx < SEA_ANIMALS_DATA.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      setTab('quiz');
    }
  };

  const handleFinishScene = (stars: number) => {
    recordAnimalLessonResult(
      'sea_animals',
      'sea_ocean_scene',
      stars,
      SEA_ANIMALS_DATA.length,
      'Ocean Scene',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'sea_animals',
      title: 'Ocean Explorer Star 🌊',
      stars,
      score: SEA_ANIMALS_DATA.length,
      totalQuestions: SEA_ANIMALS_DATA.length,
      nextSubModuleId: 'amphibians_reptiles',
    });
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'sea_animals',
      'sea_animals_mastery',
      stars,
      score,
      currentSeaAnimal.name,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'sea_animals',
      title: 'Ocean Master Champion 🐬',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'amphibians_reptiles',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Sea Animals"
        subtitle="Dive into the ocean with dolphins, whales, and turtles!"
        emoji="🐠"
        accentColor="#06B6D4"
        titleColor="#06B6D4"
      />

      {/* Tabs Row */}
      <View style={styles.modeTabs}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Interactive ocean mode"
          onPress={() => setTab('ocean')}
          style={[styles.modeTab, tab === 'ocean' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              tab === 'ocean' && styles.modeTabTextActive,
            ]}>
            🌊 Ocean Scene
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Explore creatures mode"
          onPress={() => setTab('learn')}
          style={[styles.modeTab, tab === 'learn' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              tab === 'learn' && styles.modeTabTextActive,
            ]}>
            🐬 Creatures
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Sea quiz mode"
          onPress={() => setTab('quiz')}
          style={[styles.modeTab, tab === 'quiz' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              tab === 'quiz' && styles.modeTabTextActive,
            ]}>
            🎯 Sea Quiz
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {tab === 'ocean' ? (
          <UnderwaterOceanScene
            seaAnimals={SEA_ANIMALS_DATA}
            onComplete={handleFinishScene}
          />
        ) : tab === 'learn' ? (
          <>
            {/* Sea Creatures Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorScroll}>
              {SEA_ANIMALS_DATA.map((animal, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <Pressable
                    key={animal.id}
                    accessibilityRole="button"
                    accessibilityLabel={animal.name}
                    onPress={() => setSelectedIdx(idx)}
                    style={[
                      styles.seaPill,
                      {backgroundColor: isSelected ? animal.color : '#FFFFFF'},
                    ]}>
                    <Text style={styles.seaPillEmoji}>{animal.emoji}</Text>
                    <Text
                      style={[
                        styles.seaPillText,
                        {color: isSelected ? '#FFFFFF' : '#374151'},
                      ]}>
                      {animal.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <AnimalCard animal={currentSeaAnimal} onNext={handleNextAnimal} />
          </>
        ) : (
          <AnimalQuizEngine
            questions={quizQuestions}
            accentColor="#06B6D4"
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
    backgroundColor: '#ECFEFF',
    borderColor: '#06B6D4',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  modeTabTextActive: {
    color: '#0891B2',
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
  seaPill: {
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
  seaPillEmoji: {
    fontSize: 18,
  },
  seaPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
