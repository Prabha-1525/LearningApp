import React, {useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {GKLesson} from '../../domain/entities/gkEntities';
import {GKInteractivePractice} from './GKInteractivePractice';
import {GKQuizEngine} from './GKQuizEngine';

type LessonStep = 'learn' | 'explore' | 'practice' | 'quiz' | 'result';

interface GKLessonFlowProps {
  readonly lesson: GKLesson;
  readonly onComplete: (starsEarned: number, score: number) => void;
  readonly onNextLesson?: () => void;
  readonly onBackToCategory?: () => void;
}

export function GKLessonFlow({
  lesson,
  onComplete,
  onNextLesson,
  onBackToCategory,
}: GKLessonFlowProps) {
  const {t} = useTranslation();
  const [step, setStep] = useState<LessonStep>('learn');
  const [quizScore, setQuizScore] = useState(0);
  const [quizStars, setQuizStars] = useState(0);

  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const triggerBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.15,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleQuizFinish = (score: number, stars: number) => {
    setQuizScore(score);
    setQuizStars(stars);
    setStep('result');
    onComplete(stars, score);
  };

  const handleRetryQuiz = () => {
    setStep('quiz');
  };

  return (
    <View style={styles.container}>
      {/* Step Progress Pills */}
      <View style={styles.stepHeader}>
        {[
          {id: 'learn', label: '1. Learn 📖'},
          {id: 'explore', label: '2. Explore 🔍'},
          {id: 'practice', label: '3. Practice 🎮'},
          {id: 'quiz', label: '4. Quiz 🎯'},
        ].map((st, idx) => {
          const isActive = step === st.id;
          const isPassed =
            (step === 'explore' && idx === 0) ||
            (step === 'practice' && idx <= 1) ||
            (step === 'quiz' && idx <= 2) ||
            (step === 'result' && idx <= 3);

          return (
            <View
              key={st.id}
              style={[
                styles.stepPill,
                isActive && [
                  styles.stepPillActive,
                  {borderColor: lesson.accentColor},
                ],
                isPassed && styles.stepPillPassed,
              ]}>
              <Text
                style={[
                  styles.stepPillText,
                  isActive && styles.stepPillTextActive,
                  isActive && {color: lesson.accentColor},
                ]}>
                {st.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* STEP 1: LEARN */}
      {step === 'learn' && (
        <ScrollView
          contentContainerStyle={styles.centerContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.heroCircle,
              {
                backgroundColor: `${lesson.accentColor}1A`,
                borderColor: lesson.accentColor,
                transform: [{scale: bounceAnim}],
              },
            ]}>
            <Text style={styles.heroEmoji}>{lesson.emoji}</Text>
          </Animated.View>

          <Text style={styles.heroTitle}>{t(lesson.titleKey, lesson.id)}</Text>
          <Text style={styles.heroSub}>{t(lesson.subtitleKey, '')}</Text>

          {/* Purpose Box */}
          <View style={[styles.infoBox, {borderColor: lesson.accentColor}]}>
            <Text style={styles.infoLabel}>💡 What is it?</Text>
            <Text style={styles.infoText}>{t(lesson.purposeKey, '')}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              triggerBounce();
              setStep('explore');
            }}
            style={[styles.primaryBtn, {backgroundColor: lesson.accentColor}]}>
            <Text style={styles.primaryBtnText}>
              {t('generalKnowledge.exploreNext', 'Explore Fun Facts ➔')}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* STEP 2: EXPLORE */}
      {step === 'explore' && (
        <ScrollView
          contentContainerStyle={styles.centerContent}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.exploreCard,
              {
                backgroundColor: `${lesson.accentColor}10`,
                borderColor: lesson.accentColor,
              },
            ]}>
            <Text style={styles.exploreEmoji}>{lesson.emoji}</Text>
            <Text style={styles.exploreTitle}>
              {t('generalKnowledge.didYouKnow', '🌟 Did You Know?')}
            </Text>
            <Text style={styles.exploreFact}>{t(lesson.factKey, '')}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setStep('practice')}
            style={[styles.primaryBtn, {backgroundColor: lesson.accentColor}]}>
            <Text style={styles.primaryBtnText}>
              {t('generalKnowledge.letsPractice', 'Interactive Practice 🎮')}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* STEP 3: PRACTICE */}
      {step === 'practice' && (
        <ScrollView
          contentContainerStyle={styles.centerContent}
          showsVerticalScrollIndicator={false}>
          <GKInteractivePractice
            practice={lesson.practice}
            accentColor={lesson.accentColor}
            onSolved={() => setStep('quiz')}
          />
        </ScrollView>
      )}

      {/* STEP 4: QUIZ */}
      {step === 'quiz' && (
        <GKQuizEngine
          questions={lesson.quizQuestions}
          accentColor={lesson.accentColor}
          onFinish={handleQuizFinish}
        />
      )}

      {/* STEP 5: RESULT / STARS / REWARD */}
      {step === 'result' && (
        <ScrollView
          contentContainerStyle={styles.centerContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.resultBadge}>
            <Text style={styles.resultEmoji}>
              {quizStars >= 2 ? '🎉' : '💡'}
            </Text>
          </View>

          <Text style={styles.resultTitle}>
            {quizStars >= 2
              ? t('generalKnowledge.lessonPassed', 'Lesson Completed! 🌟')
              : t(
                  'generalKnowledge.tryAgainEncourage',
                  'Good Practice! Let’s Try Again',
                )}
          </Text>

          <Text style={styles.resultScore}>
            {quizScore} / {lesson.quizQuestions.length} Questions Correct
          </Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map(s => (
              <Text
                key={s}
                style={[
                  styles.starResult,
                  s <= quizStars
                    ? styles.starResultFilled
                    : styles.starResultEmpty,
                ]}>
                ⭐
              </Text>
            ))}
          </View>

          {quizStars >= 2 ? (
            <View style={styles.unlockedBox}>
              <Text style={styles.unlockedEmoji}>🔓 ✨</Text>
              <Text style={styles.unlockedText}>
                {t(
                  'generalKnowledge.newLessonUnlocked',
                  'New Lesson Unlocked!',
                )}
              </Text>
            </View>
          ) : (
            <View style={styles.retryBox}>
              <Text style={styles.retryText}>
                {t(
                  'generalKnowledge.retryToUnlock',
                  'Get at least 2 stars to unlock the next exciting lesson!',
                )}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.resultActions}>
            {quizStars < 2 && (
              <Pressable
                accessibilityRole="button"
                onPress={handleRetryQuiz}
                style={[styles.retryBtn, {borderColor: lesson.accentColor}]}>
                <Text
                  style={[styles.retryBtnText, {color: lesson.accentColor}]}>
                  🔄 {t('generalKnowledge.retryQuiz', 'Try Quiz Again')}
                </Text>
              </Pressable>
            )}

            {quizStars >= 2 && onNextLesson && (
              <Pressable
                accessibilityRole="button"
                onPress={onNextLesson}
                style={[
                  styles.primaryBtn,
                  {backgroundColor: lesson.accentColor},
                ]}>
                <Text style={styles.primaryBtnText}>
                  ➡️ {t('generalKnowledge.nextLesson', 'Next Lesson')}
                </Text>
              </Pressable>
            )}

            {onBackToCategory && (
              <Pressable
                accessibilityRole="button"
                onPress={onBackToCategory}
                style={styles.backCategoryBtn}>
                <Text style={styles.backCategoryText}>
                  🏠 {t('generalKnowledge.backToCategory', 'Category Overview')}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stepPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  stepPillActive: {
    backgroundColor: '#FFFFFF',
  },
  stepPillPassed: {
    backgroundColor: '#ECFDF5',
  },
  stepPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  stepPillTextActive: {
    fontWeight: '900',
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroEmoji: {
    fontSize: 60,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    gap: 6,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 22,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  exploreCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  exploreEmoji: {
    fontSize: 54,
  },
  exploreTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  exploreFact: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  resultEmoji: {
    fontSize: 48,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },
  resultScore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  starResult: {
    fontSize: 38,
  },
  starResultFilled: {
    opacity: 1,
    transform: [{scale: 1.1}],
  },
  starResultEmpty: {
    opacity: 0.2,
  },
  unlockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  unlockedEmoji: {
    fontSize: 20,
  },
  unlockedText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
  },
  retryBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
  },
  resultActions: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  retryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 15,
    fontWeight: '900',
  },
  backCategoryBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  backCategoryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
  },
});
