import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {AnimalCard} from '../../features/animals/presentation/components';
import {AMPHIBIANS_REPTILES_DATA} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<
  AnimalsStackParamList,
  'AmphibiansReptiles'
>;

export function AmphibiansReptilesScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentItem =
    AMPHIBIANS_REPTILES_DATA[selectedIdx] ?? AMPHIBIANS_REPTILES_DATA[0]!;

  const handleNext = () => {
    if (selectedIdx < AMPHIBIANS_REPTILES_DATA.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      recordAnimalLessonResult(
        'amphibians_reptiles',
        'amphibians_reptiles_mastery',
        3,
        AMPHIBIANS_REPTILES_DATA.length,
        'Amphibians & Reptiles',
      );
      navigation.navigate('LessonComplete', {
        subModuleId: 'amphibians_reptiles',
        title: 'Reptile & Amphibian Star 🐸',
        stars: 3,
        score: AMPHIBIANS_REPTILES_DATA.length,
        totalQuestions: AMPHIBIANS_REPTILES_DATA.length,
        nextSubModuleId: 'insects',
      });
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Amphibians & Reptiles"
        subtitle="Learn about frogs, turtles, lizards, and crocodiles!"
        emoji="🐸"
        accentColor="#84CC16"
        titleColor="#84CC16"
      />

      {/* Item Carousel Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorScroll}>
        {AMPHIBIANS_REPTILES_DATA.map((animal, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <Pressable
              key={animal.id}
              accessibilityRole="button"
              accessibilityLabel={animal.name}
              onPress={() => setSelectedIdx(idx)}
              style={[
                styles.itemPill,
                {backgroundColor: isSelected ? animal.color : '#FFFFFF'},
              ]}>
              <Text style={styles.itemPillEmoji}>{animal.emoji}</Text>
              <Text
                style={[
                  styles.itemPillText,
                  {color: isSelected ? '#FFFFFF' : '#374151'},
                ]}>
                {animal.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalCard animal={currentItem} onNext={handleNext} />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  selectorScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemPill: {
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
  itemPillEmoji: {
    fontSize: 18,
  },
  itemPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
});
