import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  AnimalCard,
  AnimalsHeader,
} from '../../features/animals/presentation/components';
import {INSECTS_DATA} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'Insects'>;

export function InsectsScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentItem = INSECTS_DATA[selectedIdx] ?? INSECTS_DATA[0]!;

  const handleNext = () => {
    if (selectedIdx < INSECTS_DATA.length - 1) {
      setSelectedIdx(prev => prev + 1);
    } else {
      recordAnimalLessonResult(
        'insects',
        'insects_mastery',
        3,
        INSECTS_DATA.length,
        'Insects',
      );
      navigation.navigate('LessonComplete', {
        subModuleId: 'insects',
        title: 'Insect Explorer Star 🦋',
        stars: 3,
        score: INSECTS_DATA.length,
        totalQuestions: INSECTS_DATA.length,
        nextSubModuleId: 'animal_babies',
      });
    }
  };

  return (
    <AppSafeAreaView>
      <AnimalsHeader
        title="Small Animals & Insects"
        subtitle="Discover butterflies, honey bees, ladybugs, and busy ants!"
        emoji="🐛"
        accentColor="#F97316"
      />

      {/* Item Carousel Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorScroll}>
        {INSECTS_DATA.map((insect, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <Pressable
              key={insect.id}
              accessibilityRole="button"
              accessibilityLabel={insect.name}
              onPress={() => setSelectedIdx(idx)}
              style={[
                styles.itemPill,
                {backgroundColor: isSelected ? insect.color : '#FFFFFF'},
              ]}>
              <Text style={styles.itemPillEmoji}>{insect.emoji}</Text>
              <Text
                style={[
                  styles.itemPillText,
                  {color: isSelected ? '#FFFFFF' : '#374151'},
                ]}>
                {insect.name}
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
