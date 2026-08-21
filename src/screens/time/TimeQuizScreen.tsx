import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {TimeQuizCard} from '../../features/time/presentation/components';
import {TIME_QUIZ_QUESTIONS} from '../../features/time/domain/catalog/timeData';
import {
  recordQuizCompletion,
  recordTimeTopicCompletion,
} from '../../features/time/data/progress/timeProgress';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'TimeQuiz'>;

export function TimeQuizScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [questions] = useState(TIME_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCurrent, setAnsweredCurrent] = useState(false);

  const currentQ = questions[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    setAnsweredCurrent(true);
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnsweredCurrent(false);
    } else {
      const finalScore = score;
      const stars = finalScore >= 4 ? 3 : finalScore >= 2 ? 2 : 1;
      recordQuizCompletion(finalScore);
      recordTimeTopicCompletion('quiz', stars);
      navigation.navigate('TimeComplete', {
        starsEarned: stars,
        topicTitle: t('time.topics.quiz.title', 'Time & Calendar Quiz'),
      });
    }
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#EEF2FF">
      <LearningHeader
        title={t('time.topics.quiz.title', 'Time Quiz')}
        subtitle={`Question ${currentIndex + 1} of ${questions.length}`}
        emoji="🎯"
        accentColor="#4F46E5"
        titleColor="#4F46E5"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressBarWrap}>
          <View
            style={[
              styles.progressBarFill,
              {width: `${((currentIndex + 1) / questions.length) * 100}%`},
            ]}
          />
        </View>

        {/* Score & Counter */}
        <View style={styles.scoreRow}>
          <Text style={styles.counterText}>
            Question {currentIndex + 1} / {questions.length}
          </Text>
          <Text style={styles.scoreText}>⭐ Score: {score}</Text>
        </View>

        {/* Question Card */}
        <TimeQuizCard
          key={currentQ.id}
          question={currentQ}
          onAnswer={handleAnswer}
        />

        {/* Next Question Button */}
        {answeredCurrent && (
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {currentIndex + 1 === questions.length
                ? 'Finish Quiz 🏆'
                : 'Next Question ▶'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  progressBarWrap: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7D2FE',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
  },
  nextBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
