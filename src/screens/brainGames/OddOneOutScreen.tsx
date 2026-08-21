import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ODD_ONE_OUT_LEVELS} from '../../features/brainGames/domain/catalog/oddOneOutData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<BrainGamesStackParamList, 'OddOneOut'>;

export function OddOneOutScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const [levelIdx, setLevelIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{
    index: number;
    correct: boolean;
  } | null>(null);

  const level = ODD_ONE_OUT_LEVELS[levelIdx] ?? ODD_ONE_OUT_LEVELS[0];
  const question = level.questions[questionIdx] ?? level.questions[0];

  const totalQuestions = ODD_ONE_OUT_LEVELS.reduce(
    (s, l) => s + l.questions.length,
    0,
  );

  const cardScale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{scale: cardScale.value}],
  }));

  const handleChoice = useCallback(
    (chosenIndex: number) => {
      const isCorrect = chosenIndex === question.oddIndex;
      setFeedback({index: chosenIndex, correct: isCorrect});
      if (isCorrect) {
        cardScale.value = withSequence(
          withSpring(1.1, {damping: 8}),
          withSpring(1, {damping: 12}),
        );
        setCorrectCount(c => c + 1);
      }

      setTimeout(() => {
        setFeedback(null);
        const nextQ = questionIdx + 1;
        if (nextQ < level.questions.length) {
          setQuestionIdx(nextQ);
        } else {
          const nextL = levelIdx + 1;
          if (nextL < ODD_ONE_OUT_LEVELS.length) {
            setLevelIdx(nextL);
            setQuestionIdx(0);
          } else {
            const earned = isCorrect ? correctCount + 1 : correctCount;
            const stars =
              earned >= totalQuestions - 1
                ? 3
                : earned >= Math.floor(totalQuestions * 0.6)
                ? 2
                : 1;
            recordGameCompletion('odd-one-out', stars);
            navigation.navigate('GameComplete', {
              gameId: 'odd-one-out',
              stars,
              nextGame: 'NumberSequence',
            });
          }
        }
      }, 900);
    },
    [
      cardScale,
      correctCount,
      level.questions.length,
      levelIdx,
      navigation,
      question.oddIndex,
      questionIdx,
      totalQuestions,
    ],
  );

  const answered = feedback !== null;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFF1F2">
      <LearningHeader
        title={t('brainGames.games.oddOneOut.title', 'Odd One Out')}
        emoji="👀"
        accentColor="#DC2626"
        titleColor="#DC2626"
        score={correctCount}
        totalScore={totalQuestions}
        onBack={() => navigation.navigate('Home')}
      />

      <View style={styles.container}>
        <Text style={styles.prompt}>
          {t('brainGames.oddOneOut.question', 'Which one is different?')}
        </Text>

        {feedback && (
          <Text
            style={[
              styles.feedbackText,
              feedback.correct ? styles.correctText : styles.wrongText,
            ]}>
            {feedback.correct
              ? t('brainGames.correct', '🎉 Correct!')
              : t('brainGames.wrong', '❌ Oops! Try next!')}
          </Text>
        )}

        <Animated.View style={[styles.itemGrid, cardStyle]}>
          {question.items.map((item, i) => {
            const isFeedback = feedback?.index === i;
            const isCorrectOdd = i === question.oddIndex && feedback !== null;
            return (
              <Pressable
                key={`odd-item-${i}`}
                testID={`odd-item-${i}`}
                disabled={answered}
                style={[
                  styles.itemCard,
                  isFeedback && !feedback?.correct && styles.wrongCard,
                  isCorrectOdd && styles.correctCard,
                ]}
                onPress={() => handleChoice(i)}>
                <Text style={styles.itemEmoji}>{item}</Text>
              </Pressable>
            );
          })}
        </Animated.View>

        <Text style={styles.levelPill}>
          {t('brainGames.level', {
            level: level.level,
            defaultValue: `Level ${level.level}`,
          })}
        </Text>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 24,
  },
  prompt: {
    fontSize: 22,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  correctText: {
    color: '#059669',
  },
  wrongText: {
    color: '#DC2626',
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    justifyContent: 'center',
  },
  itemCard: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FECACA',
    shadowColor: '#DC2626',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  wrongCard: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  correctCard: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  itemEmoji: {
    fontSize: 48,
  },
  levelPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FECDD3',
    fontSize: 14,
    fontWeight: '700',
    color: '#9F1239',
  },
});
