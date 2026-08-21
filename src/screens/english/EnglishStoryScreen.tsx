import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ReadingKaraokeView} from '../../features/english/presentation/components';
import {SHORT_STORIES_DATA} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import {englishAudio} from '../../features/english/domain/audio/englishAudioEngine';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'ShortStories'>;

export function EnglishStoryScreen() {
  const navigation = useNavigation<Nav>();
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentStory = SHORT_STORIES_DATA[currentStoryIdx];
  const currentPage = currentStory ? currentStory.pages[currentPageIdx] : null;
  const currentQuizQ = currentStory
    ? currentStory.questions[quizQuestionIdx]
    : null;

  const isLastPage =
    currentStory && currentPageIdx === currentStory.pages.length - 1;
  const isLastQuizQ =
    currentStory && quizQuestionIdx === currentStory.questions.length - 1;

  const handleNextPage = () => {
    if (isLastPage) {
      setIsQuizMode(true);
      setQuizQuestionIdx(0);
      setSelectedAnswer(null);
    } else {
      setCurrentPageIdx(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPageIdx(prev => Math.max(0, prev - 1));
  };

  const handleSelectQuizAnswer = (ans: string) => {
    if (selectedAnswer !== null || !currentQuizQ) return;
    setSelectedAnswer(ans);

    const isCorrect = ans === currentQuizQ.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      englishAudio.playSuccessChime();
      englishAudio.speak('Great story comprehension!');
    } else {
      englishAudio.playTryAgainTone();
    }
  };

  const handleNextQuizQuestion = () => {
    if (!currentStory) return;
    if (isLastQuizQ) {
      const finalScore =
        score + (selectedAnswer === currentQuizQ?.answer ? 0 : 0);
      const total = currentStory.questions.length;
      let stars = 1;
      if (finalScore >= total) stars = 3;
      else if (finalScore >= Math.ceil(total * 0.6)) stars = 2;

      recordEnglishLessonResult('short_stories', currentStory.id, stars, score);
      navigation.navigate('LessonComplete', {
        subModuleId: 'short_stories',
        title: 'Story Reader Extraordinaire',
        stars,
        score,
        totalQuestions: total,
        nextSubModuleId: 'reading_challenge',
      });
    } else {
      setQuizQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  if (!currentStory) return null;

  return (
    <AppSafeAreaView>
      <LearningHeader
        title={currentStory.title}
        subtitle={
          isQuizMode
            ? `Story Questions (${quizQuestionIdx + 1}/${
                currentStory.questions.length
              })`
            : `Page ${currentPageIdx + 1} of ${currentStory.pages.length}`
        }
        emoji={currentStory.coverEmoji}
        accentColor="#9333EA"
        titleColor="#9333EA"
      />

      {/* Story Picker Tabs */}
      <View style={styles.storiesStrip}>
        {SHORT_STORIES_DATA.map((story, idx) => (
          <Pressable
            key={story.id}
            accessibilityRole="button"
            accessibilityLabel={`Select story ${story.title}`}
            onPress={() => {
              setCurrentStoryIdx(idx);
              setCurrentPageIdx(0);
              setIsQuizMode(false);
              setQuizQuestionIdx(0);
              setSelectedAnswer(null);
            }}
            style={[
              styles.storyPill,
              idx === currentStoryIdx && styles.storyPillActive,
            ]}>
            <Text style={styles.storyPillEmoji}>{story.coverEmoji}</Text>
            <Text
              style={[
                styles.storyPillTitle,
                idx === currentStoryIdx && styles.storyPillTitleActive,
              ]}
              numberOfLines={1}>
              {story.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {!isQuizMode && currentPage ? (
          <>
            {/* Karaoke Page Reader */}
            <ReadingKaraokeView
              text={currentPage.text}
              words={currentPage.words}
              emoji={currentPage.emoji}
            />

            {/* Page Navigation */}
            <View style={styles.pageNavRow}>
              <Pressable
                accessibilityRole="button"
                disabled={currentPageIdx === 0}
                onPress={handlePrevPage}
                style={[
                  styles.navBtn,
                  currentPageIdx === 0 && styles.navBtnDisabled,
                ]}>
                <Text style={styles.navBtnText}>‹ Prev Page</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleNextPage}
                style={[styles.navBtn, styles.navBtnPrimary]}>
                <Text style={[styles.navBtnText, styles.navBtnTextPrimary]}>
                  {isLastPage ? 'Story Questions ➔' : 'Next Page ›'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : currentQuizQ ? (
          <View style={styles.questionCard}>
            <Text style={styles.questionPrompt}>
              🤔 {currentQuizQ.question}
            </Text>

            <View style={styles.optionsList}>
              {currentQuizQ.options.map(opt => {
                const isSelected = selectedAnswer === opt;
                const isCorrectOpt = opt === currentQuizQ.answer;
                const showSuccess = selectedAnswer !== null && isCorrectOpt;
                const showWrong = isSelected && !isCorrectOpt;

                return (
                  <Pressable
                    key={opt}
                    accessibilityRole="button"
                    disabled={selectedAnswer !== null}
                    onPress={() => handleSelectQuizAnswer(opt)}
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
                  selectedAnswer === currentQuizQ.answer
                    ? styles.feedbackSuccess
                    : styles.feedbackWrong,
                ]}>
                <Text style={styles.feedbackText}>
                  {selectedAnswer === currentQuizQ.answer
                    ? '🌟 Great answer!'
                    : `💡 Remember: ${currentQuizQ.answer}`}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleNextQuizQuestion}
                  style={styles.nextQuizBtn}>
                  <Text style={styles.nextQuizBtnText}>
                    {isLastQuizQ ? 'Complete Story ⭐' : 'Next Question ➔'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  storiesStrip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  storyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  storyPillActive: {
    backgroundColor: '#FAF5FF',
    borderColor: '#9333EA',
  },
  storyPillEmoji: {
    fontSize: 16,
  },
  storyPillTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  storyPillTitleActive: {
    color: '#9333EA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
  pageNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnPrimary: {
    backgroundColor: '#9333EA',
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  navBtnTextPrimary: {
    color: '#FFFFFF',
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
    borderColor: '#9333EA',
    backgroundColor: '#FAF5FF',
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
  nextQuizBtn: {
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  nextQuizBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
