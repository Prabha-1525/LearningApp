import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LIFE_SKILLS_QUIZ_QUESTIONS} from '../../domain/catalog/lifeSkillsData';
import type {LifeSkillsQuizQuestion} from '../../domain/entities/lifeSkillsEntities';

interface LifeSkillsQuizArenaProps {
  readonly onFinish?: (score: number) => void;
}

export function LifeSkillsQuizArena({onFinish}: LifeSkillsQuizArenaProps) {
  const {t} = useTranslation();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  const question: LifeSkillsQuizQuestion =
    LIFE_SKILLS_QUIZ_QUESTIONS[currentIdx] ?? LIFE_SKILLS_QUIZ_QUESTIONS[0]!;

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (selectedOptionId !== null) {
      return;
    }
    setSelectedOptionId(optId);

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({
        correct: true,
        text: '🌟 Super smart & kind! That is the right choice!',
      });
    } else {
      setFeedback({
        correct: false,
        text: '💛 Good try! Remember to make safe and polite choices.',
      });
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      setFeedback(null);
      if (currentIdx + 1 < LIFE_SKILLS_QUIZ_QUESTIONS.length) {
        setCurrentIdx(i => i + 1);
      } else {
        setIsQuizComplete(true);
        onFinish?.(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setIsQuizComplete(false);
  };

  if (isQuizComplete) {
    return (
      <View style={styles.resultsCard}>
        <Text style={styles.resultsEmoji}>🏆 😊 🌟</Text>
        <Text style={styles.resultsTitle}>
          {t('lifeSkills.quiz.completeTitle', 'Life Skills Star Finished!')}
        </Text>
        <Text style={styles.resultsScore}>
          Score: {score} / {LIFE_SKILLS_QUIZ_QUESTIONS.length} ⭐
        </Text>
        <Text style={styles.resultsMsg}>
          {score >= 8
            ? '🌟 Awesome! You are a polite, safe, and super kind friend!'
            : '👍 Wonderful effort! Keep practicing your daily good habits!'}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleRestart}
          style={styles.restartBtn}>
          <Text style={styles.restartBtnText}>🔄 Play Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <Text style={styles.progressText}>
          Question {currentIdx + 1} of {LIFE_SKILLS_QUIZ_QUESTIONS.length}
        </Text>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.card}>
        {question.promptEmoji ? (
          <View style={styles.promptEmojiBox}>
            <Text style={styles.promptEmoji}>{question.promptEmoji}</Text>
          </View>
        ) : null}

        <Text style={styles.questionText}>{t(question.questionKey, '')}</Text>

        {feedback && (
          <View
            style={[
              styles.feedbackBanner,
              feedback.correct ? styles.feedbackSuccess : styles.feedbackHint,
            ]}>
            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </View>
        )}

        {/* Options */}
        <View style={styles.optionsList}>
          {question.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = styles.optionBtn;
            if (isSelected && opt.isCorrect) {
              optStyle = styles.optionBtnCorrect;
            } else if (isSelected && !opt.isCorrect) {
              optStyle = styles.optionBtnWrong;
            }

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                disabled={selectedOptionId !== null}
                onPress={() => handleSelectOption(opt.id, opt.isCorrect)}
                style={optStyle}>
                {opt.icon ? (
                  <Text style={styles.optIcon}>{opt.icon}</Text>
                ) : null}
                <Text style={styles.optText}>{t(opt.textKey, '')}</Text>
                {isSelected && opt.isCorrect && (
                  <Text style={styles.checkIcon}>✅</Text>
                )}
                {isSelected && !opt.isCorrect && (
                  <Text style={styles.checkIcon}>💛</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  scorePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  promptEmojiBox: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  promptEmoji: {
    fontSize: 32,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  feedbackBanner: {
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  feedbackHint: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  optionBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionBtnWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  optIcon: {
    fontSize: 22,
  },
  optText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  checkIcon: {
    fontSize: 18,
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    gap: 14,
    marginHorizontal: 16,
    marginTop: 20,
  },
  resultsEmoji: {
    fontSize: 54,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#065F46',
    textAlign: 'center',
  },
  resultsScore: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  resultsMsg: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  restartBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
