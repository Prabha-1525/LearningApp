import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {
  PhonicsExerciseEngine,
  WordFamilyCard,
} from '../../features/phonics/presentation/components';
import {
  PHONICS_EXERCISES_MAP,
  WORD_FAMILIES_CATALOG,
} from '../../features/phonics/domain/catalog/phonicsData';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'WordFamilies'>;

export function WordFamiliesScreen() {
  const navigation = useNavigation<Nav>();
  const [familyIdx, setFamilyIdx] = useState(0);
  const [showExercise, setShowExercise] = useState(false);

  const sampleFamilies = WORD_FAMILIES_CATALOG.slice(0, 3);
  const currentFamily = sampleFamilies[familyIdx] ?? sampleFamilies[0]!;
  const questions = PHONICS_EXERCISES_MAP.word_families ?? [];

  const handleNextFamily = () => {
    if (familyIdx < sampleFamilies.length - 1) {
      setFamilyIdx(prev => prev + 1);
    } else {
      setShowExercise(true);
    }
  };

  const handleExerciseComplete = (
    scorePercent: number,
    starsEarned: number,
  ) => {
    const res = recordPhonicsLessonResult(
      'word_families',
      scorePercent,
      starsEarned,
    );
    navigation.replace('PhonicsLessonComplete', {
      subModuleId: 'word_families',
      title: 'Word Family Star',
      starsEarned,
      scorePercent,
      unlockedNextId: res.unlockedNextId,
    });
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title={showExercise ? 'Word Family Quiz' : 'Word Families'}
        subtitle={
          showExercise
            ? 'Find the matching word family rhyming pairs!'
            : `Family ${familyIdx + 1} of ${sampleFamilies.length}`
        }
        accentColor="#6366F1"
        titleColor="#6366F1"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {showExercise ? (
          <PhonicsExerciseEngine
            questions={questions}
            accentColor="#6366F1"
            onComplete={handleExerciseComplete}
          />
        ) : (
          <View style={styles.cardWrap}>
            <WordFamilyCard
              familyItem={currentFamily}
              onNext={handleNextFamily}
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
