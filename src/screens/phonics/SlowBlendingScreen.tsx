import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  PhonicsExerciseEngine,
  SoundBlendingStage,
} from '../../features/phonics/presentation/components';
import {
  CVC_WORDS_CATALOG,
  PHONICS_EXERCISES_MAP,
} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'SlowBlending'>;

export function SlowBlendingScreen() {
  const navigation = useNavigation<Nav>();
  const [wordIdx, setWordIdx] = useState(0);
  const [showExercise, setShowExercise] = useState(false);

  const sampleWords = CVC_WORDS_CATALOG.slice(0, 5);
  const currentWord = sampleWords[wordIdx] ?? sampleWords[0]!;
  const questions = PHONICS_EXERCISES_MAP.slow_blending ?? [];

  const handleNextWord = () => {
    if (wordIdx < sampleWords.length - 1) {
      setWordIdx(prev => prev + 1);
    } else {
      setShowExercise(true);
    }
  };

  const handleExerciseComplete = (
    scorePercent: number,
    starsEarned: number,
  ) => {
    const res = recordPhonicsLessonResult(
      'slow_blending',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'slow_blending',
      title: 'Blending Star',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title={showExercise ? 'Blending Check' : 'Slow Sound Blending'}
        subtitle={
          showExercise
            ? 'Solve the blending challenges!'
            : `Word ${wordIdx + 1} of ${sampleWords.length}`
        }
        accentColor="#06B6D4"
        titleColor="#06B6D4"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {showExercise ? (
          <PhonicsExerciseEngine
            questions={questions}
            accentColor="#06B6D4"
            onComplete={handleExerciseComplete}
          />
        ) : (
          <View style={styles.cardWrap}>
            <SoundBlendingStage cvcItem={currentWord} onNext={handleNextWord} />
          </View>
        )}
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
  cardWrap: {
    width: '100%',
  },
});
