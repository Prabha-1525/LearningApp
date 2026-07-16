import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  speakMathCoach,
  stopMathCoachSpeech,
} from '../../application/mathCoachSpeech';
import {
  mathPraiseLine,
  mathComfortLine,
  mathExplainLine,
} from '../../application/coachAiLines';
import {
  getLessonStats,
  recordAnswer,
  setNumbersLevel,
} from '../../data/mathProgress';
import {
  fullCoachScript,
  generateLearnNumbersQuestion,
  type LearnNumbersQuestion,
} from '../../domain/numbers/learnNumbersGenerator';
import type {DifficultyLevel} from '../../domain/generators/types';

export const SESSION_BATCH_SIZE = 20;
const SUCCESS_PAUSE_MS = 1800;

export type LearnNumbersPhase =
  | 'idle'
  | 'welcome'
  | 'showObjects'
  | 'tapCount'
  | 'ask'
  | 'practice'
  | 'correct'
  | 'retry'
  | 'explain'
  | 'transition'
  | 'batchComplete';

export type BatchStats = {
  readonly questionInBatch: number;
  readonly batchSize: number;
  readonly correct: number;
  readonly stars: number;
};

export type BatchCompleteSnapshot = {
  readonly stars: number;
  readonly greatJobs: number;
};

export function batchScore(stats: BatchStats): number {
  const done = stats.questionInBatch;
  if (done === 0) {
    return 0;
  }
  return Math.round((stats.correct / done) * 100);
}

function buildTapOrderMap(order: readonly number[]): Map<number, number> {
  const map = new Map<number, number>();
  order.forEach((index, i) => map.set(index, i + 1));
  return map;
}

export function useLearnNumbersPlayer() {
  const [level, setLevel] = useState<DifficultyLevel>(
    () => getLessonStats('numbers').difficultyLevel,
  );
  const [question, setQuestion] = useState<LearnNumbersQuestion | null>(null);
  const [phase, setPhase] = useState<LearnNumbersPhase>('idle');
  const [caption, setCaption] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [tappedOrder, setTappedOrder] = useState<number[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [choicesLocked, setChoicesLocked] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showCorrectChoiceId, setShowCorrectChoiceId] = useState<string | null>(
    null,
  );
  const [batchStats, setBatchStats] = useState<BatchStats>({
    questionInBatch: 0,
    batchSize: SESSION_BATCH_SIZE,
    correct: 0,
    stars: 0,
  });
  const [batchComplete, setBatchComplete] =
    useState<BatchCompleteSnapshot | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionToken, setQuestionToken] = useState(0);

  const recentIdsRef = useRef<string[]>([]);
  const questionStartRef = useRef(Date.now());
  const cancelledRef = useRef(false);
  const welcomeOnceRef = useRef(false);
  const tapCountResolveRef = useRef<(() => void) | null>(null);

  const tapOrderByIndex = useMemo(
    () => buildTapOrderMap(tappedOrder),
    [tappedOrder],
  );

  const say = useCallback(async (text: string) => {
    setIsSpeaking(true);
    setCaption(text);
    const result = await speakMathCoach(text);
    if (!result.ok) {
      setAudioError(result.error ?? 'Voice could not play.');
    } else {
      setAudioError(null);
    }
    setIsSpeaking(false);
  }, []);

  const loadQuestion = useCallback(() => {
    const next = generateLearnNumbersQuestion(level, recentIdsRef.current);
    recentIdsRef.current = [...recentIdsRef.current.slice(-40), next.id];
    setQuestion(next);
    setWrongAttempts(0);
    setHighlightIndex(-1);
    setTappedOrder([]);
    setChoicesLocked(false);
    setSelectedChoiceId(null);
    setShowCorrectChoiceId(null);
    setCelebrate(false);
    setShowStarBurst(false);
    questionStartRef.current = Date.now();
    return next;
  }, [level]);

  const recordBatchProgress = useCallback(
    (wasCorrect: boolean): BatchCompleteSnapshot | null => {
      let snapshot: BatchCompleteSnapshot | null = null;
      setBatchStats(prev => {
        const nextInBatch = prev.questionInBatch + 1;
        const nextCorrect = prev.correct + (wasCorrect ? 1 : 0);
        const nextStars = prev.stars + (wasCorrect ? 1 : 0);
        if (nextInBatch >= prev.batchSize) {
          snapshot = {stars: nextStars, greatJobs: nextCorrect};
          return {
            questionInBatch: 0,
            batchSize: SESSION_BATCH_SIZE,
            correct: 0,
            stars: 0,
          };
        }
        return {
          ...prev,
          questionInBatch: nextInBatch,
          correct: nextCorrect,
          stars: nextStars,
        };
      });
      return snapshot;
    },
    [],
  );

  const finishQuestion = useCallback(
    (wasCorrect: boolean): boolean => {
      const timeMs = Date.now() - questionStartRef.current;
      recordAnswer('numbers', wasCorrect, timeMs);
      setStreak(prev => (wasCorrect ? prev + 1 : 0));
      const snapshot = recordBatchProgress(wasCorrect);
      if (snapshot) {
        setBatchComplete(snapshot);
        setPhase('batchComplete');
        return true;
      }
      return false;
    },
    [recordBatchProgress],
  );

  const waitForTapCount = useCallback(
    (q: LearnNumbersQuestion) =>
      new Promise<void>(resolve => {
        if (!q.tapToCount || q.emojis.length === 0) {
          resolve();
          return;
        }
        tapCountResolveRef.current = resolve;
      }),
    [],
  );

  const runTeachFlow = useCallback(
    async (q: LearnNumbersQuestion) => {
      cancelledRef.current = false;
      stopMathCoachSpeech();

      if (!welcomeOnceRef.current) {
        welcomeOnceRef.current = true;
        setPhase('welcome');
        await say('Hello!');
        await say('Welcome!');
        await say(q.welcomeLine);
        if (cancelledRef.current) {
          return;
        }
      }

      setPhase('showObjects');
      await say(q.showObjectsLine);
      if (cancelledRef.current) {
        return;
      }

      setPhase('tapCount');
      setTappedOrder([]);
      await say(q.tapCountLine);
      await waitForTapCount(q);
      if (cancelledRef.current) {
        return;
      }

      await say(q.afterCountLine);
      setPhase('ask');
      await say(q.askLine);
      if (cancelledRef.current) {
        return;
      }
      setPhase('practice');
    },
    [say, waitForTapCount],
  );

  useEffect(() => {
    cancelledRef.current = false;
    if (batchComplete != null) {
      return undefined;
    }
    const q = loadQuestion();
    void runTeachFlow(q);
    return () => {
      cancelledRef.current = true;
      stopMathCoachSpeech();
      tapCountResolveRef.current = null;
    };
  }, [batchComplete, loadQuestion, questionToken, runTeachFlow]);

  const advanceQuestion = useCallback(() => {
    setBatchComplete(null);
    setQuestionToken(value => value + 1);
  }, []);

  const dismissBatchComplete = useCallback(() => {
    setBatchComplete(null);
    setPhase('transition');
    setQuestionToken(value => value + 1);
  }, []);

  const onObjectTap = useCallback(
    async (index: number) => {
      if (!question || phase !== 'tapCount' || tappedOrder.includes(index)) {
        return;
      }
      const nextOrder = [...tappedOrder, index];
      const tapCount = nextOrder.length;
      setTappedOrder(nextOrder);
      setHighlightIndex(index);
      const countWord = question.countWords[tapCount - 1];
      if (countWord) {
        await say(`${countWord}!`);
      }
      if (nextOrder.length >= question.emojis.length) {
        setHighlightIndex(-1);
        tapCountResolveRef.current?.();
        tapCountResolveRef.current = null;
      }
    },
    [phase, question, say, tappedOrder],
  );

  const onChoice = useCallback(
    async (choiceId: string) => {
      if (!question || phase !== 'practice' || choicesLocked) {
        return;
      }
      const picked = question.choices.find(c => c.id === choiceId);
      if (!picked) {
        return;
      }

      setChoicesLocked(true);
      setSelectedChoiceId(choiceId);

      if (picked.correct) {
        setPhase('correct');
        setCelebrate(true);
        setShowStarBurst(true);

        await say('Great job!');
        const praise = await mathPraiseLine(
          'numbers',
          question.askLine,
          question.praiseLine,
        );
        await say(praise);
        if (streak >= 2) {
          await say('You are doing great!');
        }

        await new Promise<void>(r => setTimeout(r, SUCCESS_PAUSE_MS));
        setCelebrate(false);
        setShowStarBurst(false);

        const batchDone = finishQuestion(true);
        if (!batchDone) {
          setPhase('transition');
          setTimeout(() => advanceQuestion(), 400);
        }
        return;
      }

      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setPhase('retry');
      await say(
        await mathComfortLine('numbers', question.askLine, "That's okay."),
      );

      if (nextWrong < 2) {
        await say(question.retryLine);
        setSelectedChoiceId(null);
        setTappedOrder([]);
        setPhase('tapCount');
        await say(question.tapCountLine);
        await waitForTapCount(question);
        await say(question.afterCountLine);
        await say(question.askLine);
        setPhase('practice');
        setChoicesLocked(false);
        return;
      }

      const correctChoice = question.choices.find(c => c.correct);
      setShowCorrectChoiceId(correctChoice?.id ?? null);
      setPhase('explain');
      const explain = await mathExplainLine(
        'numbers',
        question.askLine,
        String(question.number),
        picked.label,
        `${question.explainLine} The answer is ${question.number}.`,
      );
      await say(explain);
      await say('You are learning! Let us try a new one.');
      const batchDone = finishQuestion(true);
      if (!batchDone) {
        setPhase('transition');
        setTimeout(() => advanceQuestion(), SUCCESS_PAUSE_MS);
      }
    },
    [
      advanceQuestion,
      choicesLocked,
      finishQuestion,
      phase,
      question,
      say,
      streak,
      waitForTapCount,
      wrongAttempts,
    ],
  );

  const changeLevel = useCallback((next: DifficultyLevel) => {
    setLevel(next);
    setNumbersLevel(next);
    welcomeOnceRef.current = false;
    setBatchComplete(null);
    setBatchStats({
      questionInBatch: 0,
      batchSize: SESSION_BATCH_SIZE,
      correct: 0,
      stars: 0,
    });
    setStreak(0);
    setQuestionToken(t => t + 1);
  }, []);

  const replayAudio = useCallback(async () => {
    if (!question) {
      return;
    }
    stopMathCoachSpeech();
    setIsSpeaking(true);
    setAudioError(null);
    for (const line of fullCoachScript(question)) {
      setCaption(line.text);
      const result = await speakMathCoach(line.text);
      if (!result.ok) {
        setAudioError(result.error ?? 'Voice could not play.');
        break;
      }
    }
    setIsSpeaking(false);
  }, [question]);

  return {
    level,
    question,
    phase,
    caption,
    highlightIndex,
    tappedOrder,
    tapOrderByIndex,
    celebrate,
    showStarBurst,
    isSpeaking,
    audioError,
    choicesLocked,
    selectedChoiceId,
    showCorrectChoiceId,
    batchStats,
    batchScore: batchScore(batchStats),
    batchComplete,
    streak,
    onChoice,
    onObjectTap,
    changeLevel,
    replayAudio,
    dismissBatchComplete,
  };
}
