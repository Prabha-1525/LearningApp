import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {AnimalSoundBoard} from '../../features/animals/presentation/components';
import {ANIMAL_SOUND_ITEMS} from '../../features/animals/domain/catalog/animalsData';
import {recordAnimalLessonResult} from '../../features/animals/data/progress/animalsProgress';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'AnimalSounds'>;

export function AnimalSoundsScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (score: number, stars: number) => {
    recordAnimalLessonResult(
      'animal_sounds',
      'sounds_guessing',
      stars,
      score,
      'Animal Sounds',
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'animal_sounds',
      title: 'Animal Sound Detective',
      stars,
      score,
      totalQuestions: ANIMAL_SOUND_ITEMS.length,
      nextSubModuleId: 'habitats',
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Animal Sounds"
        subtitle="Listen to the animal sounds and guess who is calling!"
        emoji="🔊"
        accentColor="#3B82F6"
        titleColor="#3B82F6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AnimalSoundBoard
          items={ANIMAL_SOUND_ITEMS}
          onComplete={handleComplete}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
});
