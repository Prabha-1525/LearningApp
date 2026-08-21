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
  withTiming,
} from 'react-native-reanimated';

import {AppSafeAreaView, LearningHeader} from '@components';
import {SEQUENCE_LEVELS} from '../../features/brainGames/domain/catalog/sequenceData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<
  BrainGamesStackParamList,
  'NumberSequence'
>;

export function NumberSequenceScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const [levelIdx, setLevelIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const level = SEQUENCE_LEVELS[levelIdx] ?? SEQUENCE_LEVELS[0];
  const question = level.questions[questionIdx] ?? level.questions[0];
  const totalQuestions = SEQUENCE_LEVELS.reduce(
    (s, l) => s + l.questions.length,
    0,
  );

  const optionScale = useSharedValue(1);
  const optStyle = useAnimatedStyle(() => ({
    transform: [{scale: optionScale.value}],
  }));

  const handleAnswer = useCallback(
    (choice: string) => {
      const isCorrect = choice === question.answer;
      setFeedback(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        optionScale.value = withSequence(
          withSpring(1.12, {damping: 8}),
          withSpring(1, {damping: 12}),
        );
        setCorrectCount(c => c + 1);
      } else {
        optionScale.value = withSequence(
          withTiming(0.92, {duration: 80}),
          withTiming(1, {duration: 200}),
        );
      }
      setTimeout(() => {
        setFeedback(null);
        const nextQ = questionIdx + 1;
        if (nextQ < level.questions.length) {
          setQuestionIdx(nextQ);
        } else {
          const nextL = levelIdx + 1;
          if (nextL < SEQUENCE_LEVELS.length) {
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
            recordGameCompletion('number-sequence', stars);
            navigation.navigate('GameComplete', {
              gameId: 'number-sequence',
              stars,
              nextGame: 'SortIt',
            });
          }
        }
      }, 800);
    },
    [
      correctCount,
      level.questions.length,
      levelIdx,
      navigation,
      optionScale,
      question.answer,
      questionIdx,
      totalQuestions,
    ],
  );

  const answered = feedback !== null;

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0FFF4">
      <LearningHeader
        title={t('brainGames.games.numberSequence.title', 'Number Sequence')}
        emoji="🔢"
        accentColor="#059669"
        titleColor="#059669"
        score={correctCount}
        totalScore={totalQuestions}
        onBack={() => navigation.navigate('Home')}
      />

      <View style={styles.container}>
        <Text style={styles.prompt}>
          {t('brainGames.sequence.prompt', "What's missing?")}
        </Text>

        <View style={styles.sequenceRow}>
          {question.sequence.map((item, i) => (
            <View
              key={`seq-${i}`}
              style={[styles.seqBox, item === '❓' && styles.blankBox]}>
              <Text
                style={[styles.seqEmoji, item === '❓' && styles.blankEmoji]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {feedback && (
          <Text
            style={[
              styles.feedback,
              feedback === 'correct' ? styles.correctFb : styles.wrongFb,
            ]}>
            {feedback === 'correct'
              ? t('brainGames.correct', '🎉 Correct!')
              : t('brainGames.wrong', '❌ Try Again!')}
          </Text>
        )}

        <Animated.View style={[styles.optionsRow, optStyle]}>
          {question.options.map((opt, i) => (
            <Pressable
              key={`opt-${i}`}
              testID={`seq-opt-${i}`}
              disabled={answered}
              style={({pressed}) => [
                styles.optBtn,
                pressed && styles.optPressed,
                feedback === 'correct' &&
                  opt === question.answer &&
                  styles.correctOpt,
              ]}
              onPress={() => handleAnswer(opt)}>
              <Text style={styles.optEmoji}>{opt}</Text>
            </Pressable>
          ))}
        </Animated.View>
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
    gap: 28,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '800',
    color: '#065F46',
    textAlign: 'center',
  },
  sequenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  seqBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6EE7B7',
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  blankBox: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
    borderStyle: 'dashed',
    borderWidth: 2.5,
  },
  seqEmoji: {
    fontSize: 26,
  },
  blankEmoji: {
    fontSize: 22,
  },
  feedback: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  correctFb: {color: '#059669'},
  wrongFb: {color: '#DC2626'},
  optionsRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  optBtn: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#6EE7B7',
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  optPressed: {
    transform: [{scale: 0.93}],
    opacity: 0.85,
  },
  correctOpt: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  optEmoji: {
    fontSize: 32,
  },
});
