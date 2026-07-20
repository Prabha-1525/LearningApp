import {useCallback, useEffect, useRef, useState} from 'react';

import {asChildId} from '@core/domain';
import type {BadgeRule} from '@core/gamification';
import {applyGrantResult} from '@core/store';

import {completeCountingLessonRewards} from '../../application/completeCountingLessonRewards';
import {
  speakMathCoach,
  stopMathCoachSpeech,
} from '../../application/mathCoachSpeech';
import {recordAnswer} from '../../data/mathProgress';
import type {CountingProgress} from '../../data/countingProgress';
import {pickOne} from '../../domain/generators/random';
import {
  generateCountingQuestion,
  getCountingLesson,
  COUNTING_QUESTIONS_PER_LESSON,
  type CountingLessonDef,
  type CountingQuestion,
} from '../../domain/counting/countingCurriculum';

export type CountingPhase = 'playing' | 'encourage' | 'correct' | 'success';

const ENCOURAGE = [
  'Nice try! Count again carefully, then pick the number.',
  'Almost! Tap each object, then choose the right number.',
  'You can do it! Count one more time.',
] as const;

const PRAISE = [
  'Yes! Perfect counting!',
  'Great job! That is the right number!',
  'Awesome! You counted them all!',
] as const;

const SUCCESS = [
  'Amazing! You finished this counting lesson!',
  'Wow! Ten questions done — super star!',
] as const;

type DispatchFn = (action: unknown) => void;

export function useCountingPlayer(
  lessonIndex: number,
  childId: string,
  dispatch: DispatchFn,
) {
  const lesson: CountingLessonDef = getCountingLesson(lessonIndex);
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<CountingPhase>('playing');
  const [question, setQuestion] = useState<CountingQuestion | null>(null);
  const [caption, setCaption] = useState('Can you count them? Tap each one!');
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [choicesLocked, setChoicesLocked] = useState(false);
  const [correctInLesson, setCorrectInLesson] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<CountingProgress | null>(
    null,
  );
  const [performanceStars, setPerformanceStars] = useState<1 | 2 | 3>(1);
  const [newBadges, setNewBadges] = useState<readonly BadgeRule[]>([]);
  const [rewardDeltaStars, setRewardDeltaStars] = useState(0);

  const recentIdsRef = useRef<string[]>([]);
  const questionStartRef = useRef(Date.now());
  const introPlayedRef = useRef(false);
  const wrongAttemptsRef = useRef(0);

  const say = useCallback(async (text: string) => {
    setCaption(text);
    await speakMathCoach(text);
  }, []);

  const loadQuestion = useCallback(
    (nextStep: number): CountingQuestion => {
      stopMathCoachSpeech();
      setPhase('playing');
      setChoicesLocked(false);
      setTapped(new Set());
      const next = generateCountingQuestion(lessonIndex, recentIdsRef.current);
      recentIdsRef.current = [...recentIdsRef.current.slice(-12), next.id];
      setQuestion(next);
      setStep(nextStep);
      setCaption(next.promptEn);
      questionStartRef.current = Date.now();
      return next;
    },
    [lessonIndex],
  );

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      introPlayedRef.current = false;
      recentIdsRef.current = [];
      wrongAttemptsRef.current = 0;
      setCorrectInLesson(0);
      setWrongAttempts(0);
      setLessonProgress(null);
      setNewBadges([]);
      setRewardDeltaStars(0);
      loadQuestion(1);
      if (!introPlayedRef.current) {
        introPlayedRef.current = true;
        await say(`Welcome to ${lesson.titleEn}! Let's count together.`);
        if (cancelled) {
          return;
        }
      }
    }
    void boot();
    return () => {
      cancelled = true;
      stopMathCoachSpeech();
    };
  }, [lesson.titleEn, lessonIndex, loadQuestion, say]);

  const onTapObject = useCallback((index: number) => {
    setTapped(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const onChoice = useCallback(
    async (choiceId: string) => {
      if (!question || choicesLocked || phase === 'success') {
        return;
      }
      const picked = question.choices.find(c => c.id === choiceId);
      if (!picked) {
        return;
      }

      setChoicesLocked(true);
      const timeMs = Date.now() - questionStartRef.current;

      if (picked.correct) {
        recordAnswer('counting', true, timeMs);
        setPhase('correct');
        const nextCorrect = correctInLesson + 1;
        setCorrectInLesson(nextCorrect);
        await say(pickOne(PRAISE));

        if (nextCorrect >= COUNTING_QUESTIONS_PER_LESSON) {
          const reward = await completeCountingLessonRewards({
            childId: asChildId(childId),
            lessonIndex,
            wrongAttempts: wrongAttemptsRef.current,
          });
          setLessonProgress(reward.counting.progress);
          setPerformanceStars(reward.performanceStars);
          setRewardDeltaStars(reward.counting.deltaStars);
          setNewBadges(reward.newBadges);
          if (reward.snapshot) {
            dispatch(
              applyGrantResult({
                snapshot: reward.snapshot,
                celebrations: [...reward.celebrations],
              }),
            );
          }
          setPhase('success');
          await say(pickOne(SUCCESS));
          return;
        }

        await new Promise<void>(resolve => setTimeout(resolve, 600));
        const next = loadQuestion(step + 1);
        await say(next.promptEn);
        return;
      }

      recordAnswer('counting', false, timeMs);
      wrongAttemptsRef.current += 1;
      setWrongAttempts(wrongAttemptsRef.current);
      setPhase('encourage');
      await say(pickOne(ENCOURAGE));
      setChoicesLocked(false);
      setPhase('playing');
      questionStartRef.current = Date.now();
    },
    [
      childId,
      choicesLocked,
      correctInLesson,
      dispatch,
      lessonIndex,
      loadQuestion,
      phase,
      question,
      say,
      step,
    ],
  );

  const replayPrompt = useCallback(async () => {
    await say(question?.promptEn ?? caption);
  }, [caption, question, say]);

  return {
    lesson,
    step,
    totalSteps: COUNTING_QUESTIONS_PER_LESSON,
    phase,
    question,
    caption,
    tapped,
    choicesLocked,
    correctInLesson,
    wrongAttempts,
    lessonProgress,
    performanceStars,
    rewardDeltaStars,
    newBadges,
    onTapObject,
    onChoice,
    replayPrompt,
  };
}
