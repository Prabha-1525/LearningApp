import {useCallback, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components';
import {asChildId, ModuleId} from '@core/domain';
import {
  applyGrantResult,
  createMmkvGamificationRepository,
  grantRewards,
} from '@core/gamification';
import {speakCoachLine} from '@shared/speech/tamilCoachSpeech';
import {
  ExplorerHeader,
  QuizOptionCard,
} from '@features/worldExplorer/presentation/components';
import {useCountries} from '@features/worldExplorer/presentation/hooks/useCountries';
import {useGeographyQuiz} from '@features/worldExplorer/presentation/hooks/useGeographyQuiz';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

import type {QuizOption} from '@features/worldExplorer/domain/entities/QuizQuestion';

type Props = NativeStackScreenProps<WorldExplorerStackParamList, 'Quiz'>;

export function GeographyQuizScreen({navigation, route}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(
    state => state.profile.activeChildId ?? 'demo-child',
  );

  const difficulty = route.params?.difficulty ?? 'beginner';
  const {countries} = useCountries();
  const {progress, finishQuiz} = useWorldExplorerProgress();

  const quiz = useGeographyQuiz(countries, 5, difficulty);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelectOption = useCallback(
    (option: QuizOption) => {
      quiz.selectOption(option);
      if (option.isCorrect) {
        void speakCoachLine('Great job! Correct answer!');
      } else {
        void speakCoachLine('Try again!');
      }
    },
    [quiz],
  );

  const handleNext = useCallback(async () => {
    const hasNext = quiz.nextQuestion();
    if (!hasNext) {
      const earnedStars = Math.max(1, Math.min(3, quiz.score));
      finishQuiz(earnedStars);

      const repo = createMmkvGamificationRepository();
      const result = await grantRewards(repo, {
        childId: asChildId(activeChildId),
        source: 'lesson',
        moduleId: ModuleId.WorldExplorer,
        reasonCode: `worldExplorer.quiz.${difficulty}.complete`,
        stars: earnedStars,
        xp: 25,
      });
      if (result.ok) {
        dispatch(
          applyGrantResult({
            snapshot: result.value.snapshot,
            celebrations: result.value.celebrations,
          }),
        );
      }
      setShowCelebration(true);
    }
  }, [activeChildId, difficulty, dispatch, finishQuiz, quiz]);

  const handleDoneCelebration = () => {
    setShowCelebration(false);
    navigation.navigate('Home');
  };

  const q = quiz.currentQuestion;

  if (!q) {
    return (
      <AppSafeAreaView testID="geography-quiz-screen">
        <ExplorerHeader
          title={t('worldExplorer.activities.quiz', {
            defaultValue: 'Geography Quiz',
          })}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Preparing quiz questions...</Text>
        </View>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView testID="geography-quiz-screen" padded={false}>
      <ExplorerHeader
        title={t('worldExplorer.activities.quiz', {
          defaultValue: 'Geography Quiz',
        })}
        subtitle={`Question ${quiz.currentIndex + 1} of ${quiz.totalQuestions}`}
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          {q.flagEmoji && (
            <View style={styles.flagWrap}>
              <Text style={styles.flagEmoji}>{q.flagEmoji}</Text>
            </View>
          )}

          {q.imageUrl && (
            <Image
              source={{uri: q.imageUrl}}
              style={styles.questionImage}
              resizeMode="cover"
            />
          )}

          <Text style={styles.promptText}>{q.promptText}</Text>
          {q.promptSubtext ? (
            <Text style={styles.promptSubtext}>{q.promptSubtext}</Text>
          ) : null}
        </View>

        {/* 3-4 Option Choice Buttons */}
        <View style={styles.optionsWrap}>
          {q.options.map(opt => {
            const isSelected = quiz.selectedOption?.id === opt.id;
            return (
              <QuizOptionCard
                key={opt.id}
                option={opt}
                isSelected={isSelected}
                isAnswered={quiz.isAnswered}
                onPress={() => handleSelectOption(opt)}
                testID={`quiz-option-${opt.id}`}
              />
            );
          })}
        </View>

        {/* Retry / Next Actions */}
        {quiz.isAnswered && (
          <View style={styles.actionWrap}>
            {quiz.selectedOption && !quiz.selectedOption.isCorrect ? (
              <Pressable
                accessibilityRole="button"
                onPress={quiz.retryQuestion}
                style={({pressed}) => [
                  styles.retryBtn,
                  pressed && styles.btnPressed,
                ]}>
                <Text style={styles.retryText}>
                  🔄{' '}
                  {t('worldExplorer.labels.tryAgain', {
                    defaultValue: 'Try Again',
                  })}
                </Text>
              </Pressable>
            ) : null}

            {quiz.selectedOption && quiz.selectedOption.isCorrect ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleNext}
                style={({pressed}) => [
                  styles.nextBtn,
                  pressed && styles.btnPressed,
                ]}>
                <Text style={styles.nextText}>
                  {quiz.currentIndex >= quiz.totalQuestions - 1
                    ? t('worldExplorer.labels.completed', {
                        defaultValue: 'Finish Quiz 🏆',
                      })
                    : t('worldExplorer.labels.next', {
                        defaultValue: 'Next Question ➔',
                      })}
                </Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Completion Celebration Modal */}
      <Modal
        visible={showCelebration}
        transparent
        animationType="fade"
        onRequestClose={handleDoneCelebration}>
        <View style={styles.modalBackdrop}>
          <View style={styles.celebrationCard}>
            <View style={styles.starBadgeRow}>
              {Array.from({length: 3}).map((_, sIdx) => (
                <Text
                  key={`quiz-star-${sIdx}`}
                  style={[
                    styles.earnedStar,
                    sIdx < Math.max(1, quiz.score) && styles.earnedStarActive,
                  ]}>
                  ★
                </Text>
              ))}
            </View>

            <Text style={styles.congratsTitle}>
              {t('worldExplorer.labels.awesome', {defaultValue: 'Awesome!'})}
            </Text>
            <Text style={styles.congratsDesc}>
              You scored {quiz.score} out of {quiz.totalQuestions} in the
              Geography Quiz!
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleDoneCelebration}
              style={({pressed}) => [
                styles.doneBtn,
                pressed && styles.btnPressed,
              ]}>
              <Text style={styles.doneBtnText}>
                {t('worldExplorer.labels.continue', {defaultValue: 'Continue'})}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#3B82F6',
    shadowColor: '#1E3A8A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 10,
  },
  flagWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#93C5FD',
  },
  flagEmoji: {
    fontSize: 54,
  },
  questionImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  promptText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  promptSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  optionsWrap: {
    gap: 10,
  },
  actionWrap: {
    gap: 12,
    marginTop: 8,
  },
  retryBtn: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B45309',
  },
  nextBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  nextText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 28, 36, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: 14,
    borderWidth: 3,
    borderColor: '#22C55E',
  },
  starBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  earnedStar: {
    fontSize: 42,
    color: '#E5E7EB',
  },
  earnedStarActive: {
    color: '#F59E0B',
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#166534',
  },
  congratsDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  doneBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 8,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
