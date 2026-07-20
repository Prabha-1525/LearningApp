import {useCallback, useEffect, useRef, useState} from 'react';

import {asChildId} from '@core/domain';
import type {BadgeRule} from '@core/gamification';
import {applyGrantResult} from '@core/store';

import {completeMissingLessonRewards} from '../../application/completeMissingLessonRewards';
import {
  speakMathCoach,
  stopMathCoachSpeech,
} from '../../application/mathCoachSpeech';
import {recordAnswer} from '../../data/mathProgress';
import type {MissingProgress} from '../../data/missingProgress';
import {pickOne} from '../../domain/generators/random';
import {
  generateMissingQuestion,
  getMissingLesson,
  MISSING_QUESTIONS_PER_LESSON,
  type MissingLessonDef,
  type MissingQuestion,
} from '../../domain/missing/missingCurriculum';

export type MissingPhase = 'playing' | 'encourage' | 'correct' | 'success';

const ENCOURAGE_LINES = [
  'Nice try! Look again — you can find the missing number!',
  'Almost! Think about what comes next in the line.',
  'Keep going! Count carefully and try another answer.',
  'You are so close! Pick the number that fits the gap.',
] as const;

const PRAISE_LINES = [
  'Yes! That is the missing number!',
  'Great job! You found it!',
  'Awesome! Perfect answer!',
  'Wonderful! You are a number detective!',
] as const;

const SUCCESS_LINES = [
  'Amazing work! You finished this lesson!',
  'Wow! All ten questions done — you are a star!',
  'Fantastic! Lesson complete — high five!',
] as const;

type DispatchFn = (action: unknown) => void;

export function useMissingNumberPlayer(
  lessonIndex: number,
  childId: string,
  dispatch: DispatchFn,
) {
  const lesson: MissingLessonDef = getMissingLesson(lessonIndex);
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<MissingPhase>('playing');
  const [question, setQuestion] = useState<MissingQuestion | null>(null);
  const [caption, setCaption] = useState('Which number is missing?');
  const [choicesLocked, setChoicesLocked] = useState(false);
  const [filledAnswer, setFilledAnswer] = useState<number | null>(null);
  const [correctInLesson, setCorrectInLesson] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<MissingProgress | null>(
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
    (nextStep: number) => {
      stopMathCoachSpeech();
      setPhase('playing');
      setChoicesLocked(false);
      setFilledAnswer(null);
      const next = generateMissingQuestion(lessonIndex, recentIdsRef.current);
      recentIdsRef.current = [...recentIdsRef.current.slice(-12), next.id];
      setQuestion(next);
      setStep(nextStep);
      setCaption('Which number is missing?');
      questionStartRef.current = Date.now();
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
        await say(
          `Welcome to Lesson ${lessonIndex}! Find the missing number in each row.`,
        );
        if (cancelled) {
          return;
        }
        await say('Which number is missing?');
      }
    }
    void boot();
    return () => {
      cancelled = true;
      stopMathCoachSpeech();
    };
  }, [lessonIndex, loadQuestion, say]);

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
        recordAnswer('missing', true, timeMs);
        setFilledAnswer(question.answer);
        setPhase('correct');
        const nextCorrect = correctInLesson + 1;
        setCorrectInLesson(nextCorrect);
        await say(pickOne(PRAISE_LINES));

        if (nextCorrect >= MISSING_QUESTIONS_PER_LESSON) {
          const reward = await completeMissingLessonRewards({
            childId: asChildId(childId),
            lessonIndex,
            wrongAttempts: wrongAttemptsRef.current,
          });
          setLessonProgress(reward.missing.progress);
          setPerformanceStars(reward.performanceStars);
          setRewardDeltaStars(reward.missing.deltaStars);
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
          await say(pickOne(SUCCESS_LINES));
          return;
        }

        await new Promise<void>(resolve => {
          setTimeout(resolve, 700);
        });
        loadQuestion(step + 1);
        await say('Which number is missing?');
        return;
      }

      recordAnswer('missing', false, timeMs);
      wrongAttemptsRef.current += 1;
      setWrongAttempts(wrongAttemptsRef.current);
      setPhase('encourage');
      await say(pickOne(ENCOURAGE_LINES));
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
    await say(caption || 'Which number is missing?');
  }, [caption, say]);

  return {
    lesson,
    step,
    totalSteps: MISSING_QUESTIONS_PER_LESSON,
    phase,
    question,
    caption,
    choicesLocked,
    filledAnswer,
    correctInLesson,
    wrongAttempts,
    lessonProgress,
    performanceStars,
    rewardDeltaStars,
    newBadges,
    onChoice,
    replayPrompt,
  };
}
