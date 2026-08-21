import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {PhonicsExerciseEngine} from '../../features/phonics/presentation/components';
import {PHONICS_EXERCISES_MAP} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'EndingSounds'>;

export function EndingSoundsScreen() {
  const navigation = useNavigation<Nav>();
  const questions = PHONICS_EXERCISES_MAP.ending_sounds ?? [];

  const handleComplete = (scorePercent: number, starsEarned: number) => {
    const res = recordPhonicsLessonResult(
      'ending_sounds',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'ending_sounds',
      title: 'Ending Sound Detective',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Ending Sounds"
        subtitle="What sound do you hear at the very end of the word?"
        accentColor="#EC4899"
        titleColor="#EC4899"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PhonicsExerciseEngine
          questions={questions}
          accentColor="#EC4899"
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
