import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {PhonicsExerciseEngine} from '../../features/phonics/presentation/components';
import {PHONICS_EXERCISES_MAP} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'PictureToWord'>;

export function PictureToWordScreen() {
  const navigation = useNavigation<Nav>();
  const questions = PHONICS_EXERCISES_MAP.cvc_words ?? [];

  const handleComplete = (scorePercent: number, starsEarned: number) => {
    const res = recordPhonicsLessonResult(
      'picture_to_word',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'picture_to_word',
      title: 'Picture Reader',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Picture to Word"
        subtitle="Look at the image and choose the correct phonics word!"
        accentColor="#84CC16"
        titleColor="#84CC16"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PhonicsExerciseEngine
          questions={questions}
          accentColor="#84CC16"
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
