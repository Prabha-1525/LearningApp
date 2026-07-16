import {useCallback, useEffect, useRef, useState} from 'react';

import {
  speakMathCoach,
  stopMathCoachSpeech,
} from '../../application/mathCoachSpeech';
import {
  mathComfortLine,
  mathExplainLine,
  mathLessonIntroLine,
  mathPraiseLine,
} from '../../application/coachAiLines';
import {getLessonStats, recordAnswer} from '../../data/mathProgress';
import {getLesson} from '../../domain/curriculum/lessons';
import type {MathLessonId} from '../../domain/curriculum/types';
import {COMFORT_EN, PRAISE_EN} from '../../domain/generators/catalog';
import {generateQuestion} from '../../domain/generators/questionEngine';
import {pickOne} from '../../domain/generators/random';
import type {
  DifficultyLevel,
  MathQuestion,
} from '../../domain/generators/types';

export type MathPracticePhase =
  | 'intro'
  | 'listening'
  | 'practicing'
  | 'feedback';

export type SessionStats = {
  readonly attempted: number;
  readonly correct: number;
};

export function useInfiniteMathPractice(lessonId: MathLessonId) {
  const lesson = getLesson(lessonId);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<MathPracticePhase>('intro');
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [caption, setCaption] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error' | null>(
    null,
  );
  const [countTapped, setCountTapped] = useState<Set<number>>(new Set());
  const [celebrate, setCelebrate] = useState(false);
  const [session, setSession] = useState<SessionStats>({
    attempted: 0,
    correct: 0,
  });
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(
    () => getLessonStats(lessonId).difficultyLevel,
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [choicesLocked, setChoicesLocked] = useState(false);

  const recentIdsRef = useRef<string[]>([]);
  const questionStartRef = useRef(Date.now());
  const introPlayedRef = useRef(false);

  const say = useCallback(async (text: string) => {
    setCaption(text);
    await speakMathCoach(text);
  }, []);

  const advanceQuestion = useCallback(() => {
    setQuestionIndex(value => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function playQuestion() {
      stopMathCoachSpeech();
      setFeedbackTone(null);
      setCountTapped(new Set());
      setChoicesLocked(false);

      if (!introPlayedRef.current) {
        setPhase('intro');
        introPlayedRef.current = true;
        setIsAiLoading(true);
        const introLine = await mathLessonIntroLine(lessonId, lesson.introEn);
        setIsAiLoading(false);
        await say(introLine);
        if (cancelled) {
          return;
        }
      }

      const stats = getLessonStats(lessonId);
      setDifficultyLevel(stats.difficultyLevel);

      const next = generateQuestion(
        lessonId,
        stats.difficultyLevel,
        recentIdsRef.current,
      );
      recentIdsRef.current = [...recentIdsRef.current.slice(-19), next.id];
      setQuestion(next);
      questionStartRef.current = Date.now();

      setPhase('listening');
      await say(next.coachEn);
      if (cancelled) {
        return;
      }
      setPhase('practicing');
    }

    void playQuestion();
    return () => {
      cancelled = true;
      stopMathCoachSpeech();
    };
  }, [lesson, lessonId, questionIndex, say]);

  const onCorrect = useCallback(async () => {
    if (!question) {
      return;
    }
    const timeMs = Date.now() - questionStartRef.current;
    recordAnswer(lessonId, true, timeMs);
    setSession(value => ({
      attempted: value.attempted + 1,
      correct: value.correct + 1,
    }));
    setPhase('feedback');
    setFeedbackTone('success');
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1200);
    setIsAiLoading(true);
    const praise = await mathPraiseLine(
      lessonId,
      question.coachEn,
      pickOne(PRAISE_EN),
    );
    setIsAiLoading(false);
    await say(praise);
    setTimeout(() => advanceQuestion(), 600);
  }, [advanceQuestion, lessonId, question, say]);

  const onWrong = useCallback(async () => {
    if (!question) {
      return;
    }
    const timeMs = Date.now() - questionStartRef.current;
    recordAnswer(lessonId, false, timeMs);
    setSession(value => ({
      attempted: value.attempted + 1,
      correct: value.correct,
    }));
    setPhase('feedback');
    setFeedbackTone('error');
    setIsAiLoading(true);
    const comfort = await mathComfortLine(
      lessonId,
      question.coachEn,
      COMFORT_EN,
    );
    const explain = await mathExplainLine(
      lessonId,
      question.coachEn,
      question.explainEn,
      undefined,
      question.explainEn,
    );
    setIsAiLoading(false);
    await say(comfort);
    await say(explain);
    setFeedbackTone(null);
    setCountTapped(new Set());
    setChoicesLocked(false);
    setPhase('practicing');
    questionStartRef.current = Date.now();
  }, [lessonId, question, say]);

  const onChoice = useCallback(
    async (choiceId: string) => {
      if (!question || phase !== 'practicing' || choicesLocked) {
        return;
      }
      const practice = question.practice;
      if (practice.mode !== 'choice' || !practice.choices) {
        return;
      }
      const picked = practice.choices.find(c => c.id === choiceId);
      setChoicesLocked(true);
      if (picked?.correct) {
        await onCorrect();
      } else {
        await onWrong();
      }
    },
    [choicesLocked, onCorrect, onWrong, phase, question],
  );

  const onCountTap = useCallback(
    async (index: number) => {
      if (!question || phase !== 'practicing' || choicesLocked) {
        return;
      }
      const practice = question.practice;
      if (
        practice.mode !== 'count' ||
        !practice.emojis ||
        !practice.targetCount
      ) {
        return;
      }
      if (countTapped.has(index)) {
        return;
      }
      const next = new Set(countTapped);
      next.add(index);
      setCountTapped(next);
      if (next.size < practice.targetCount) {
        return;
      }
      setChoicesLocked(true);
      await onCorrect();
    },
    [choicesLocked, countTapped, onCorrect, phase, question],
  );

  const replayAudio = useCallback(async () => {
    if (question) {
      await say(question.coachEn);
    } else {
      await say(lesson.introEn);
    }
  }, [lesson, question, say]);

  return {
    lesson,
    question,
    questionIndex,
    phase,
    caption,
    feedbackTone,
    countTapped,
    celebrate,
    session,
    difficultyLevel,
    isAiLoading,
    choicesLocked,
    onChoice,
    onCountTap,
    replayAudio,
    advanceQuestion,
  };
}
