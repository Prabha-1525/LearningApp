import {useCallback, useEffect, useState} from 'react';

import type {Country} from '../../domain/entities/Country';
import type {
  DifficultyLevel,
  QuizOption,
  QuizQuestion,
} from '../../domain/entities/QuizQuestion';
import {generateGeographyQuizRound} from '../../data/quiz/geographyQuizEngine';

export function useGeographyQuiz(
  countries: readonly Country[],
  questionCount = 5,
  difficulty: DifficultyLevel = 'beginner',
) {
  const [questions, setQuestions] = useState<readonly QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const startQuiz = useCallback(() => {
    if (countries.length < 4) {
      return;
    }
    const round = generateGeographyQuizRound(
      countries,
      questionCount,
      difficulty,
    );
    setQuestions(round);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAttempts(0);
    setIsComplete(false);
  }, [countries, difficulty, questionCount]);

  useEffect(() => {
    if (countries.length >= 4 && questions.length === 0) {
      startQuiz();
    }
  }, [countries, questions.length, startQuiz]);

  const currentQuestion = questions[currentIndex];

  const selectOption = useCallback(
    (option: QuizOption) => {
      if (isAnswered) {
        return;
      }
      setSelectedOption(option);
      setIsAnswered(true);
      setAttempts(a => a + 1);

      if (option.isCorrect) {
        setScore(s => s + 1);
      }
    },
    [isAnswered],
  );

  const retryQuestion = useCallback(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      setIsComplete(true);
      return false;
    }
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    return true;
  }, [currentIndex, questions.length]);

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedOption,
    isAnswered,
    score,
    attempts,
    isComplete,
    selectOption,
    retryQuestion,
    nextQuestion,
    startQuiz,
  };
}
