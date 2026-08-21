import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  PhonicsExerciseEngine,
  PhonicsHeader,
} from '../../features/phonics/presentation/components';
import {PHONICS_EXERCISES_MAP} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'PhonicsChallenge'>;

export function PhonicsChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const questions = PHONICS_EXERCISES_MAP.phonics_challenge ?? [];

  const handleComplete = (scorePercent: number, starsEarned: number) => {
    const res = recordPhonicsLessonResult(
      'phonics_challenge',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'phonics_challenge',
      title: 'Grand Phonics Champion',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <PhonicsHeader
        title="Phonics Challenge"
        subtitle="The ultimate test of sounds, blending, and reading!"
        accentColor="#D97706"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PhonicsExerciseEngine
          questions={questions}
          accentColor="#D97706"
          onComplete={handleComplete}
        />
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
});
