import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {PhonicsExerciseEngine} from '../../features/phonics/presentation/components';
import {PHONICS_EXERCISES_MAP} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'SoundRecognition'>;

export function SoundRecognitionScreen() {
  const navigation = useNavigation<Nav>();
  const questions = PHONICS_EXERCISES_MAP.sound_recognition ?? [];

  const handleComplete = (scorePercent: number, starsEarned: number) => {
    const res = recordPhonicsLessonResult(
      'sound_recognition',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'sound_recognition',
      title: 'Sound Detective',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Sound Recognition"
        subtitle="Listen carefully and find the matching letter!"
        accentColor="#10B981"
        titleColor="#10B981"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PhonicsExerciseEngine
          questions={questions}
          accentColor="#10B981"
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
