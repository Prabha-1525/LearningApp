import {useCallback, useEffect, useRef, useState} from 'react';

import {asChildId} from '@core/domain';
import type {BadgeRule} from '@core/gamification';
import {applyGrantResult} from '@core/store';

import {completeEquationLessonRewards} from '../../application/completeEquationLessonRewards';
import {
  speakMathCoach,
  stopMathCoachSpeech,
} from '../../application/mathCoachSpeech';
import type {EquationProgress} from '../../data/equationProgress';
import {recordAnswer} from '../../data/mathProgress';
import type {CountingObjectDef} from '@assets/countingObjects';
import {pickOne} from '../../domain/generators/random';
import {
  generateEquationQuestion,
  getEquationLesson,
  getEquationQuestionsPerLesson,
  type EquationLessonDef,
  type EquationMode,
  type EquationQuestion,
} from '../../domain/equation/equationCurriculum';

export type EquationPhase =
  | 'intro'
  | 'example'
  | 'playing'
  | 'encourage'
  | 'correct'
  | 'success';

const ENCOURAGE = [
  'Nice try! Count carefully, then pick the number.',
  'Almost! Look at both sides again.',
  'You can do it! Try one more time.',
] as const;

const PRAISE_ADD = [
  'Yes! That is the total!',
  'Great adding!',
  'Awesome! You found the sum!',
  'Super star! Correct!',
] as const;

const PRAISE_SUB = [
  'Yes! That many are left!',
  'Great subtracting!',
  'Awesome! You found the answer!',
] as const;

const SUCCESS = [
  'Amazing! You finished this lesson!',
  'Wow! All questions done — super star!',
] as const;

type DispatchFn = (action: unknown) => void;

export type EquationExample = {
  readonly left: number;
  readonly right: number;
  readonly answer: number;
};

export function useEquationPlayer(
  mode: EquationMode,
  lessonIndex: number,
  childId: string,
  dispatch: DispatchFn,
) {
  const lesson: EquationLessonDef = getEquationLesson(mode, lessonIndex);
  const totalSteps = getEquationQuestionsPerLesson(mode);
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<EquationPhase>('playing');
  const [question, setQuestion] = useState<EquationQuestion | null>(null);
  const [example, setExample] = useState<EquationExample | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [caption, setCaption] = useState(
    mode === 'addition'
      ? 'How many do we have in total?'
      : 'How many are left?',
  );
  const [choicesLocked, setChoicesLocked] = useState(false);
  const [correctInLesson, setCorrectInLesson] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<EquationProgress | null>(
    null,
  );
  const [performanceStars, setPerformanceStars] = useState<1 | 2 | 3>(1);
  const [newBadges, setNewBadges] = useState<readonly BadgeRule[]>([]);
  const [rewardDeltaStars, setRewardDeltaStars] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [teachObject] = useState<CountingObjectDef | null>(null);

  const recentIdsRef = useRef<string[]>([]);
  const questionStartRef = useRef(Date.now());
  const introPlayedRef = useRef(false);
  const wrongAttemptsRef = useRef(0);

  const say = useCallback(async (text: string) => {
    setCaption(text);
    await speakMathCoach(text);
  }, []);

  const loadQuestion = useCallback(
    (nextStep: number): EquationQuestion => {
      stopMathCoachSpeech();
      setPhase('playing');
      setChoicesLocked(false);
      setCelebrate(false);
      setExample(null);
      const next = generateEquationQuestion(
        mode,
        lessonIndex,
        recentIdsRef.current,
      );
      recentIdsRef.current = [...recentIdsRef.current.slice(-40), next.id];
      setQuestion(next);
      setStep(nextStep);
      setCaption(next.promptEn);
      questionStartRef.current = Date.now();
      return next;
    },
    [lessonIndex, mode],
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
      setCelebrate(false);
      setExampleIndex(0);

      loadQuestion(1);
      if (!introPlayedRef.current) {
        introPlayedRef.current = true;
        const intro =
          lesson.introEn ??
          (mode === 'addition'
            ? "Let's add together!"
            : "Let's take away together!");
        await say(`Welcome to ${lesson.titleEn}! ${intro}`);
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
  }, [lesson.introEn, lesson.titleEn, lessonIndex, loadQuestion, mode, say]);

  const onChoice = useCallback(
    async (choiceId: string) => {
      if (
        !question ||
        choicesLocked ||
        phase === 'success' ||
        phase === 'intro' ||
        phase === 'example'
      ) {
        return;
      }
      const picked = question.choices.find(c => c.id === choiceId);
      if (!picked) {
        return;
      }

      setChoicesLocked(true);
      const timeMs = Date.now() - questionStartRef.current;

      if (picked.correct) {
        recordAnswer(mode, true, timeMs);
        setPhase('correct');
        setCelebrate(true);
        const nextCorrect = correctInLesson + 1;
        setCorrectInLesson(nextCorrect);
        await say(pickOne(mode === 'addition' ? PRAISE_ADD : PRAISE_SUB));

        if (nextCorrect >= totalSteps) {
          const reward = await completeEquationLessonRewards({
            childId: asChildId(childId),
            mode,
            lessonIndex,
            wrongAttempts: wrongAttemptsRef.current,
          });
          setLessonProgress(reward.equation.progress);
          setPerformanceStars(reward.performanceStars);
          setRewardDeltaStars(reward.equation.deltaStars);
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
          setCelebrate(false);
          await say(pickOne(SUCCESS));
          return;
        }

        await new Promise<void>(resolve => setTimeout(resolve, 700));
        const next = loadQuestion(step + 1);
        await say(next.promptEn);
        return;
      }

      recordAnswer(mode, false, timeMs);
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
      mode,
      phase,
      question,
      say,
      step,
      totalSteps,
    ],
  );

  const replayPrompt = useCallback(async () => {
    await say(question?.promptEn ?? caption);
  }, [caption, question, say]);

  return {
    mode,
    lesson,
    step,
    totalSteps,
    phase,
    question,
    example,
    exampleIndex,
    caption,
    choicesLocked,
    correctInLesson,
    wrongAttempts,
    lessonProgress,
    performanceStars,
    rewardDeltaStars,
    newBadges,
    celebrate,
    teachObject,
    onChoice,
    replayPrompt,
  };
}
