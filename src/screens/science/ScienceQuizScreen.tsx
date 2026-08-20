import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  ScienceHeader,
  ScienceQuizCard,
} from '../../features/science/presentation/components';
import {SCIENCE_QUIZ_QUESTIONS} from '../../features/science/domain/catalog/scienceData';
import {
  recordQuizCompletion,
  recordTopicCompletion,
} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'ScienceQuiz'>;

export function ScienceQuizScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const total = SCIENCE_QUIZ_QUESTIONS.length;
  const currentQ =
    SCIENCE_QUIZ_QUESTIONS[currentIdx] ?? SCIENCE_QUIZ_QUESTIONS[0];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    setShowExplanation(true);
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      recordQuizCompletion(score);
      recordTopicCompletion('quiz', 3);
      navigation.navigate('ScienceComplete', {
        topicId: 'quiz',
        stars: 3,
        title: t('science.topics.quiz.title', 'Science Quiz'),
      });
    }
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FDF2F8">
      <ScienceHeader
        title={t('science.topics.quiz.title', 'Science Quiz')}
        emoji="🎯"
        accentColor="#DB2777"
        score={score}
        totalScore={total}
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Progress header */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {currentIdx + 1} of {total}
          </Text>
          <View style={styles.starsPill}>
            <Text style={styles.starsPillText}>⭐ {score} Correct</Text>
          </View>
        </View>

        <ScienceQuizCard
          question={currentQ}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          showExplanation={showExplanation}
        />

        {showExplanation && (
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {currentIdx < total - 1 ? 'Next Question ❯' : 'See Results 🏆'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    gap: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9D174D',
  },
  starsPill: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  starsPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#BE185D',
  },
  nextBtn: {
    backgroundColor: '#DB2777',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#DB2777',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
