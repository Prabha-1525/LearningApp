import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {speakCoachLine, stopCoachSpeech} from '../../application/coachSpeech';
import {
  applyMove,
  emptyBoard,
  type PieceMap,
  type Square,
} from '../../domain/board/squares';
import type {ChessLesson, LessonStep} from '../../domain/curriculum/types';

export type LessonPhase =
  | 'listening'
  | 'demo'
  | 'practicing'
  | 'feedback'
  | 'readyNext';

export function useLessonPlayer(lesson: ChessLesson) {
  const {i18n} = useTranslation();
  const preferTamil = !i18n.language || i18n.language.startsWith('ta');
  const [stepIndex, setStepIndex] = useState(0);
  const [pieces, setPieces] = useState<PieceMap>(emptyBoard());
  const [phase, setPhase] = useState<LessonPhase>('listening');
  const [selectedFrom, setSelectedFrom] = useState<Square | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error' | null>(
    null,
  );
  const [caption, setCaption] = useState('');
  const demoToken = useRef(0);

  const step: LessonStep | undefined = lesson.steps[stepIndex];
  const isLast = stepIndex >= lesson.steps.length - 1;

  const say = useCallback(
    async (ta: string, en: string) => {
      setCaption(preferTamil ? ta : en);
      // Always speak Tamil — target teacher experience for this module.
      await speakCoachLine(ta);
    },
    [preferTamil],
  );

  const runDemo = useCallback(
    async (current: LessonStep, basePieces: PieceMap) => {
      const token = ++demoToken.current;
      let board = {...basePieces};
      setPieces(board);
      if (!current.demo?.length) {
        return board;
      }
      for (const move of current.demo) {
        if (token !== demoToken.current) {
          return board;
        }
        await new Promise<void>(resolve => setTimeout(resolve, 700));
        if (token !== demoToken.current) {
          return board;
        }
        board = applyMove(board, move.from, move.to);
        setPieces({...board});
      }
      await new Promise<void>(resolve => setTimeout(resolve, 450));
      return board;
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function playStep() {
      if (!step) {
        return;
      }
      stopCoachSpeech();
      setSelectedFrom(null);
      setFeedbackTone(null);
      setPhase('listening');

      const base = step.pieces ? {...step.pieces} : emptyBoard();
      setPieces(base);
      await say(step.coachTa, step.coachEn);
      if (cancelled) {
        return;
      }

      if (step.kind === 'demo') {
        setPhase('demo');
        await runDemo(step, base);
        if (cancelled) {
          return;
        }
        setPhase('readyNext');
        return;
      }

      if (step.kind === 'practice' && step.practice) {
        setPhase('practicing');
        return;
      }

      setPhase('readyNext');
    }

    void playStep();
    return () => {
      cancelled = true;
      demoToken.current += 1;
      stopCoachSpeech();
    };
  }, [step, say, runDemo]);

  const goNext = useCallback(() => {
    if (isLast) {
      return false;
    }
    setStepIndex(value => value + 1);
    return true;
  }, [isLast]);

  const replayDemo = useCallback(async () => {
    if (!step?.demo || !step.pieces) {
      return;
    }
    setPhase('demo');
    const base = {...step.pieces};
    setPieces(base);
    await say(step.coachTa, step.coachEn);
    await runDemo(step, base);
    setPhase('practicing');
  }, [runDemo, say, step]);

  const onSquarePress = useCallback(
    async (square: Square) => {
      if (!step?.practice || phase !== 'practicing') {
        return;
      }
      const practice = step.practice;

      if (practice.mode === 'tap') {
        const ok = practice.targets.includes(square);
        setPhase('feedback');
        if (ok) {
          setFeedbackTone('success');
          await say(practice.praiseTa, practice.praiseEn);
          setPhase('readyNext');
        } else {
          setFeedbackTone('error');
          await say(practice.comfortTa, practice.comfortEn);
          setFeedbackTone(null);
          setPhase('practicing');
        }
        return;
      }

      // move mode
      if (!selectedFrom) {
        if (practice.from && square !== practice.from) {
          setFeedbackTone('error');
          await say(practice.comfortTa, practice.comfortEn);
          setFeedbackTone(null);
          return;
        }
        if (!pieces[square]) {
          return;
        }
        setSelectedFrom(square);
        return;
      }

      if (square === selectedFrom) {
        setSelectedFrom(null);
        return;
      }

      const from = selectedFrom;
      const ok =
        (!practice.from || from === practice.from) &&
        practice.targets.includes(square);

      setPhase('feedback');
      if (ok) {
        setPieces(applyMove(pieces, from, square));
        setSelectedFrom(null);
        setFeedbackTone('success');
        await say(practice.praiseTa, practice.praiseEn);
        setPhase('readyNext');
      } else {
        setSelectedFrom(null);
        setFeedbackTone('error');
        await say(practice.comfortTa, practice.comfortEn);
        if (step.demo?.length && step.pieces) {
          await replayDemo();
        } else {
          setFeedbackTone(null);
          setPhase('practicing');
        }
      }
    },
    [phase, pieces, replayDemo, say, selectedFrom, step],
  );

  return {
    step,
    stepIndex,
    stepCount: lesson.steps.length,
    pieces,
    phase,
    caption,
    selectedFrom,
    feedbackTone,
    isLast,
    goNext,
    onSquarePress,
    replayDemo,
    preferTamil,
  };
}
