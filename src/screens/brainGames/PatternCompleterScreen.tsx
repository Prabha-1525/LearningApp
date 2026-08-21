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
import {PATTERN_LEVELS} from '../../features/brainGames/domain/catalog/patternData';
import {recordGameCompletion} from '../../features/brainGames/data/progress/brainGamesProgress';
import type {BrainGamesStackParamList} from '../../navigation/brainGamesTypes';

type Nav = NativeStackNavigationProp<
  BrainGamesStackParamList,
  'PatternCompleter'
>;

export function PatternCompleterScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [levelIdx, setLevelIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const levelData = PATTERN_LEVELS[levelIdx] ?? PATTERN_LEVELS[0];
  const question = levelData.questions[questionIdx] ?? levelData.questions[0];

  const optionScale = useSharedValue(1);
  const optionStyle = useAnimatedStyle(() => ({
    transform: [{scale: optionScale.value}],
  }));

  const totalQuestions = PATTERN_LEVELS.reduce(
    (s, l) => s + l.questions.length,
    0,
  );

  const handleAnswer = useCallback(
    (choice: string) => {
      const isCorrect = choice === question.answer;
      setFeedback(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        optionScale.value = withSequence(
          withSpring(1.15, {damping: 8}),
          withSpring(1, {damping: 12}),
        );
        setCorrectCount(c => c + 1);
      } else {
        optionScale.value = withSequence(
          withTiming(0.92, {duration: 100}),
          withTiming(1, {duration: 200}),
        );
      }

      setTimeout(() => {
        setFeedback(null);
        // Advance question
        const nextQIdx = questionIdx + 1;
        if (nextQIdx < levelData.questions.length) {
          setQuestionIdx(nextQIdx);
        } else {
          const nextLevelIdx = levelIdx + 1;
          if (nextLevelIdx < PATTERN_LEVELS.length) {
            setLevelIdx(nextLevelIdx);
            setQuestionIdx(0);
          } else {
            // All done
            const stars =
              correctCount + (isCorrect ? 1 : 0) >= totalQuestions - 1
                ? 3
                : correctCount >= Math.floor(totalQuestions * 0.6)
                ? 2
                : 1;
            recordGameCompletion('pattern-completer', stars);
            navigation.navigate('GameComplete', {
              gameId: 'pattern-completer',
              stars,
              nextGame: 'OddOneOut',
            });
          }
        }
      }, 800);
    },
    [
      correctCount,
      levelData.questions.length,
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
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <LearningHeader
        title={t(
          'brainGames.games.patternCompleter.title',
          'Pattern Completer',
        )}
        emoji="🔢"
        accentColor="#D97706"
        titleColor="#D97706"
        score={correctCount}
        totalScore={totalQuestions}
        onBack={() => navigation.navigate('Home')}
      />

      <View style={styles.container}>
        {/* Sequence display */}
        <Text style={styles.prompt}>
          {t('brainGames.patternCompleter.prompt', 'What comes next?')}
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

        {/* Feedback message */}
        {feedback && (
          <Text
            style={[
              styles.feedbackText,
              feedback === 'correct' ? styles.correctText : styles.wrongText,
            ]}>
            {feedback === 'correct'
              ? t('brainGames.correct', '🎉 Correct!')
              : t('brainGames.wrong', '❌ Try Again!')}
          </Text>
        )}

        {/* Options */}
        <Animated.View style={[styles.optionsRow, optionStyle]}>
          {question.options.map((opt, i) => (
            <Pressable
              key={`opt-${i}`}
              testID={`pattern-opt-${i}`}
              disabled={answered}
              style={({pressed}) => [
                styles.optionBtn,
                pressed && styles.optionPressed,
                feedback === 'correct' &&
                  opt === question.answer &&
                  styles.correctOption,
                feedback === 'wrong' &&
                  opt === question.answer &&
                  styles.correctOption,
              ]}
              onPress={() => handleAnswer(opt)}>
              <Text style={styles.optionEmoji}>{opt}</Text>
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
    color: '#92400E',
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
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  blankBox: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    borderWidth: 2.5,
  },
  seqEmoji: {
    fontSize: 28,
  },
  blankEmoji: {
    fontSize: 24,
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  correctText: {
    color: '#059669',
  },
  wrongText: {
    color: '#DC2626',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  optionBtn: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FCD34D',
    shadowColor: '#D97706',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  optionPressed: {
    transform: [{scale: 0.93}],
    opacity: 0.85,
  },
  correctOption: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  optionEmoji: {
    fontSize: 36,
  },
});
