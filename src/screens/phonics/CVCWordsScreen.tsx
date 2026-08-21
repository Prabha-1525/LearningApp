import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  PhonicsExerciseEngine,
  PhonicsHeader,
  SoundBlendingStage,
} from '../../features/phonics/presentation/components';
import {
  CVC_WORDS_CATALOG,
  PHONICS_EXERCISES_MAP,
} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'CVCWords'>;

export function CVCWordsScreen() {
  const navigation = useNavigation<Nav>();
  const [wordIdx, setWordIdx] = useState(5);
  const [showExercise, setShowExercise] = useState(false);

  const sampleWords = CVC_WORDS_CATALOG.slice(5, 10);
  const currentWord = sampleWords[wordIdx - 5] ?? sampleWords[0]!;
  const questions = PHONICS_EXERCISES_MAP.cvc_words ?? [];

  const handleNextWord = () => {
    if (wordIdx - 5 < sampleWords.length - 1) {
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
      'cvc_words',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'cvc_words',
      title: 'Little Reader',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <PhonicsHeader
        title={showExercise ? 'CVC Word Quiz' : 'CVC Words'}
        subtitle={
          showExercise
            ? 'Match the CVC words to the pictures!'
            : `Word ${wordIdx - 4} of ${sampleWords.length}`
        }
        accentColor="#10B981"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {showExercise ? (
          <PhonicsExerciseEngine
            questions={questions}
            accentColor="#10B981"
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
