import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {PhonicsExerciseEngine} from '../../features/phonics/presentation/components';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'HearChooseWord'>;

const HEAR_CHOOSE_QUESTIONS = [
  {
    id: 'hc_1',
    prompt: 'Listen: "Cat". Which word did you hear?',
    audioPrompt: 'Cat',
    options: ['CAT', 'BAT', 'DOG'],
    correctOption: 'CAT',
    explanation: 'You heard CAT! 🐱',
  },
  {
    id: 'hc_2',
    prompt: 'Listen: "Sun". Which word did you hear?',
    audioPrompt: 'Sun',
    options: ['SIT', 'SUN', 'RUN'],
    correctOption: 'SUN',
    explanation: 'You heard SUN! ☀️',
  },
  {
    id: 'hc_3',
    prompt: 'Listen: "Dog". Which word did you hear?',
    audioPrompt: 'Dog',
    options: ['LOG', 'PIG', 'DOG'],
    correctOption: 'DOG',
    explanation: 'You heard DOG! 🐶',
  },
  {
    id: 'hc_4',
    prompt: 'Listen: "Pen". Which word did you hear?',
    audioPrompt: 'Pen',
    options: ['PEN', 'PAN', 'PIN'],
    correctOption: 'PEN',
    explanation: 'You heard PEN! 🖊️',
  },
  {
    id: 'hc_5',
    prompt: 'Listen: "Cup". Which word did you hear?',
    audioPrompt: 'Cup',
    options: ['CAP', 'CUP', 'CAN'],
    correctOption: 'CUP',
    explanation: 'You heard CUP! 🥛',
  },
];

export function HearChooseWordScreen() {
  const navigation = useNavigation<Nav>();

  const handleComplete = (scorePercent: number, starsEarned: number) => {
    const res = recordPhonicsLessonResult(
      'hear_choose_word',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'hear_choose_word',
      title: 'Listening Master',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Hear & Choose Word"
        subtitle="Listen to the word and tap the matching spelling!"
        accentColor="#14B8A6"
        titleColor="#14B8A6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PhonicsExerciseEngine
          questions={HEAR_CHOOSE_QUESTIONS}
          accentColor="#14B8A6"
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
