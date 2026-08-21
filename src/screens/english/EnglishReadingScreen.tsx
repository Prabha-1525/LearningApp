import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ReadingKaraokeView} from '../../features/english/presentation/components';
import {SENTENCE_READING_DATA} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import {englishAudio} from '../../features/english/domain/audio/englishAudioEngine';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'SentenceReading'>;

export function EnglishReadingScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentSentence = SENTENCE_READING_DATA[currentIdx];
  const isLast = currentIdx === SENTENCE_READING_DATA.length - 1;

  const handleSelectAnswer = (opt: string) => {
    if (selectedAnswer !== null || !currentSentence) return;
    setSelectedAnswer(opt);

    const isCorrect = opt === currentSentence.comprehensionQuestion.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      englishAudio.playSuccessChime();
      englishAudio.speak('Great reading comprehension!');
    } else {
      englishAudio.playTryAgainTone();
    }
  };

  const handleNext = () => {
    if (!currentSentence) return;
    if (isLast) {
      const finalScore =
        score +
        (selectedAnswer === currentSentence.comprehensionQuestion.answer
          ? 0
          : 0);
      const total = SENTENCE_READING_DATA.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      recordEnglishLessonResult(
        'sentence_reading',
        'sentence_reading_complete',
        stars,
        score,
      );
      navigation.navigate('LessonComplete', {
        subModuleId: 'sentence_reading',
        title: 'Little Sentence Reader',
        stars,
        score,
        totalQuestions: total,
        nextSubModuleId: 'short_stories',
      });
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  if (!currentSentence) return null;

  const isAnswerCorrect =
    selectedAnswer === currentSentence.comprehensionQuestion.answer;

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Sentence Reading"
        subtitle="Read sentences with word-by-word highlight!"
        emoji="📚"
        accentColor="#2563EB"
        titleColor="#2563EB"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Progress Dots */}
        <View style={styles.progressRow}>
          {SENTENCE_READING_DATA.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIdx && styles.dotActive,
                idx < currentIdx && styles.dotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Karaoke Reader Card */}
        <ReadingKaraokeView
          text={currentSentence.text}
          words={currentSentence.words}
          emoji={currentSentence.emoji}
        />

        {/* Comprehension Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionPrompt}>
            🤔 {currentSentence.comprehensionQuestion.question}
          </Text>

          <View style={styles.optionsList}>
            {currentSentence.comprehensionQuestion.options.map(opt => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt =
                opt === currentSentence.comprehensionQuestion.answer;
              const showSuccess = selectedAnswer !== null && isCorrectOpt;
              const showWrong = isSelected && !isCorrectOpt;

              return (
                <Pressable
                  key={opt}
                  accessibilityRole="button"
                  accessibilityLabel={`Option ${opt}`}
                  disabled={selectedAnswer !== null}
                  onPress={() => handleSelectAnswer(opt)}
                  style={[
                    styles.optionBtn,
                    isSelected && styles.optionSelected,
                    showSuccess && styles.optionSuccess,
                    showWrong && styles.optionWrong,
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      showSuccess && styles.textSuccess,
                      showWrong && styles.textWrong,
                    ]}>
                    {opt}
                  </Text>
                  {showSuccess && <Text style={styles.badgeEmoji}>✅</Text>}
                  {showWrong && <Text style={styles.badgeEmoji}>💡</Text>}
                </Pressable>
              );
            })}
          </View>

          {selectedAnswer !== null && (
            <View
              style={[
                styles.feedbackBox,
                isAnswerCorrect ? styles.feedbackSuccess : styles.feedbackWrong,
              ]}>
              <Text style={styles.feedbackText}>
                {isAnswerCorrect
                  ? '🌟 Excellent reading!'
                  : `💡 Correct answer: ${currentSentence.comprehensionQuestion.answer}`}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={handleNext}
                style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>
                  {isLast ? 'Complete Sentence Reading ⭐' : 'Next Sentence ➔'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  questionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionWrong: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#374151',
  },
  textSuccess: {
    color: '#065F46',
  },
  textWrong: {
    color: '#92400E',
  },
  badgeEmoji: {
    fontSize: 18,
  },
  feedbackBox: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  feedbackSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  feedbackWrong: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  nextBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
