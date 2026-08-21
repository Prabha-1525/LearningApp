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
  LAND_ANIMALS,
} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'LandAnimals'>;

export function LandAnimalsScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentAnimal = LAND_ANIMALS[selectedIdx] ?? LAND_ANIMALS[0]!;
  const quizQuestions = ANIMAL_QUIZZES.land_animals ?? [];

  const handleNextAnimal = () => {
    if (selectedIdx < LAND_ANIMALS.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      setMode('quiz');
    }
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'land_animals',
      'land_animals_mastery',
      stars,
      score,
      currentAnimal.name,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'land_animals',
      title: 'Land Animals Master',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'animal_sounds',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Land Animals"
        subtitle="Explore lions, elephants, rabbits, and more!"
        emoji="🐶"
        accentColor="#10B981"
        titleColor="#10B981"
      />

      {/* Mode Switcher */}
      <View style={styles.modeTabs}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Land animals explorer mode"
          onPress={() => setMode('learn')}
          style={[styles.modeTab, mode === 'learn' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'learn' && styles.modeTabTextActive,
            ]}>
            🐶 Land Animals ({LAND_ANIMALS.length})
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Land animal quiz mode"
          onPress={() => setMode('quiz')}
          style={[styles.modeTab, mode === 'quiz' && styles.modeTabActive]}>
          <Text
            style={[
              styles.modeTabText,
              mode === 'quiz' && styles.modeTabTextActive,
            ]}>
            🎯 Land Animal Quiz
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {mode === 'learn' ? (
          <>
            {/* Animal Horizontal Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorScroll}>
              {LAND_ANIMALS.map((animal, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <Pressable
                    key={animal.id}
                    accessibilityRole="button"
                    accessibilityLabel={animal.name}
                    onPress={() => setSelectedIdx(idx)}
                    style={[
                      styles.animalPill,
                      {backgroundColor: isSelected ? animal.color : '#FFFFFF'},
                    ]}>
                    <Text style={styles.animalPillEmoji}>{animal.emoji}</Text>
                    <Text
                      style={[
                        styles.animalPillText,
                        {color: isSelected ? '#FFFFFF' : '#374151'},
                      ]}>
                      {animal.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <AnimalCard animal={currentAnimal} onNext={handleNextAnimal} />
          </>
        ) : (
          <AnimalQuizEngine
            questions={quizQuestions}
            accentColor="#10B981"
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
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  modeTabTextActive: {
    color: '#059669',
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
  animalPill: {
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
  animalPillEmoji: {
    fontSize: 18,
  },
  animalPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
