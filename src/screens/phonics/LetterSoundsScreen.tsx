import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  LetterSoundCard,
  PhonicsExerciseEngine,
} from '../../features/phonics/presentation/components';
import {
  PHONICS_EXERCISES_MAP,
  PHONICS_LETTERS,
} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'LetterSounds'>;

export function LetterSoundsScreen() {
  const navigation = useNavigation<Nav>();
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const [showExercise, setShowExercise] = useState(false);

  const currentLetter =
    PHONICS_LETTERS[currentLetterIdx] ?? PHONICS_LETTERS[0]!;
  const questions = PHONICS_EXERCISES_MAP.letter_sounds ?? [];

  const handleNextLetter = () => {
    if (currentLetterIdx < 5) {
      setCurrentLetterIdx(prev => prev + 1);
    } else {
      setShowExercise(true);
    }
  };

  const handleExerciseComplete = (
    scorePercent: number,
    starsEarned: number,
  ) => {
    const res = recordPhonicsLessonResult(
      'letter_sounds',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'letter_sounds',
      title: 'Letter Sounds Champion',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title={showExercise ? 'Sound Check' : 'Letter Sounds'}
        subtitle={
          showExercise
            ? 'Test what you have learned!'
            : `Letter ${currentLetterIdx + 1} of 6`
        }
        accentColor="#3B82F6"
        titleColor="#3B82F6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {showExercise ? (
          <PhonicsExerciseEngine
            questions={questions}
            accentColor="#3B82F6"
            onComplete={handleExerciseComplete}
          />
        ) : (
          <View style={styles.cardWrap}>
            <LetterSoundCard
              letterItem={currentLetter}
              onNext={handleNextLetter}
            />
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
