import {useCallback, useEffect, useRef, useState} from 'react';

import {
  mathComfortLine,
  mathLessonIntroLine,
  mathPraiseLine,
} from '../../application/coachAiLines';
import {
  speakMathCoach,
  stopMathCoachSpeech,
} from '../../application/mathCoachSpeech';
import {getLessonStats, recordAnswer} from '../../data/mathProgress';
import {
  buildOddEvenQuestion,
  generateOddEvenQuestion,
  type OddEvenQuestion,
} from '../../domain/oddEven/oddEvenGenerator';

export const ODD_EVEN_SESSION_SIZE = 10;

export type OddEvenPhase =
  | 'welcome'
  | 'teach-even'
  | 'teach-odd'
  | 'check-understanding'
  | 'practice'
  | 'retry'
  | 'correct'
  | 'complete';

const EVEN_DEMO = buildOddEvenQuestion(6);
const ODD_DEMO = buildOddEvenQuestion(5);

export function useOddEvenPlayer() {
  const [phase, setPhase] = useState<OddEvenPhase>('welcome');
  const [question, setQuestion] = useState<OddEvenQuestion>(EVEN_DEMO);
  const [caption, setCaption] = useState(
    'Let us discover odd and even numbers by making pairs!',
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [choicesLocked, setChoicesLocked] = useState(true);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const cancelledRef = useRef(false);
  const recentIdsRef = useRef<string[]>([]);
  const questionStartRef = useRef(Date.now());
  const correctCountRef = useRef(0);
  const questionNumberRef = useRef(0);
  const levelRef = useRef(getLessonStats('odd-even').difficultyLevel);

  const say = useCallback(async (text: string) => {
    setCaption(text);
    setIsSpeaking(true);
    await speakMathCoach(text);
    if (!cancelledRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  const loadPracticeQuestion = useCallback(() => {
    const next = generateOddEvenQuestion(
      levelRef.current,
      recentIdsRef.current,
    );
    recentIdsRef.current = [...recentIdsRef.current.slice(-20), next.id];
    setQuestion(next);
    setSelectedChoiceId(null);
    setChoicesLocked(false);
    setPhase('practice');
    setCaption(next.promptEn);
    questionStartRef.current = Date.now();
    return next;
  }, []);

  const runLessonIntro = useCallback(async () => {
    setChoicesLocked(true);
    setPhase('welcome');
    const intro = await mathLessonIntroLine(
      'odd-even',
      'Let us discover odd and even numbers by making pairs!',
    );
    await say(intro);
    if (cancelledRef.current) {
      return;
    }

    setQuestion(EVEN_DEMO);
    setPhase('teach-even');
    await say(
      'Here are six objects. Every object has a partner, so six is even!',
    );
    if (cancelledRef.current) {
      return;
    }

    setQuestion(ODD_DEMO);
    setPhase('teach-odd');
    await say(
      'Here are five objects. One is left without a partner, so five is odd!',
    );
    if (cancelledRef.current) {
      return;
    }
    setPhase('check-understanding');
    await say(
      'Even numbers make complete pairs. Odd numbers leave one alone. Do you understand?',
    );
  }, [say]);

  useEffect(() => {
    cancelledRef.current = false;
    void runLessonIntro();
    return () => {
      cancelledRef.current = true;
      stopMathCoachSpeech();
    };
  }, [runLessonIntro]);

  const onChoice = useCallback(
    async (choiceId: string) => {
      if (
        (phase !== 'practice' && phase !== 'retry') ||
        choicesLocked ||
        isSpeaking
      ) {
        return;
      }
      const picked = question.choices.find(choice => choice.id === choiceId);
      if (!picked) {
        return;
      }

      setSelectedChoiceId(choiceId);
      setChoicesLocked(true);
      const timeMs = Date.now() - questionStartRef.current;

      if (!picked.correct) {
        recordAnswer('odd-even', false, timeMs);
        setPhase('retry');
        const comfort = await mathComfortLine(
          'odd-even',
          `${question.number} was called ${picked.label}`,
          question.explanationEn,
        );
        await say(comfort);
        if (!cancelledRef.current) {
          setSelectedChoiceId(null);
          setChoicesLocked(false);
          questionStartRef.current = Date.now();
        }
        return;
      }

      recordAnswer('odd-even', true, timeMs);
      setPhase('correct');
      setCelebrate(true);
      const nextCorrect = correctCountRef.current + 1;
      const nextQuestionNumber = questionNumberRef.current + 1;
      correctCountRef.current = nextCorrect;
      questionNumberRef.current = nextQuestionNumber;
      setCorrectCount(nextCorrect);
      setQuestionNumber(nextQuestionNumber);

      const praise = await mathPraiseLine(
        'odd-even',
        `Correctly identified ${question.number} as ${question.parity}`,
        `Great pairing! ${question.explanationEn}`,
      );
      await say(praise);
      if (cancelledRef.current) {
        return;
      }

      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setCelebrate(false);
      if (nextQuestionNumber >= ODD_EVEN_SESSION_SIZE) {
        setPhase('complete');
        setChoicesLocked(true);
        await say('Amazing! You are an Odd and Even Pairing Star!');
        return;
      }

      const next = loadPracticeQuestion();
      await say(next.promptEn);
    },
    [choicesLocked, isSpeaking, loadPracticeQuestion, phase, question, say],
  );

  const replay = useCallback(async () => {
    stopMathCoachSpeech();
    await say(
      phase === 'practice' || phase === 'retry' ? question.promptEn : caption,
    );
  }, [caption, phase, question.promptEn, say]);

  const understand = useCallback(async () => {
    stopMathCoachSpeech();
    const next = loadPracticeQuestion();
    await say(`Great! Let us start the pairing quest. ${next.promptEn}`);
  }, [loadPracticeQuestion, say]);

  const tryAgain = useCallback(async () => {
    stopMathCoachSpeech();
    setSelectedChoiceId(null);
    setCelebrate(false);
    await runLessonIntro();
  }, [runLessonIntro]);

  const startNextRound = useCallback(() => {
    correctCountRef.current = 0;
    questionNumberRef.current = 0;
    setCorrectCount(0);
    setQuestionNumber(0);
    setCelebrate(false);
    loadPracticeQuestion();
  }, [loadPracticeQuestion]);

  return {
    phase,
    question,
    caption,
    isSpeaking,
    choicesLocked,
    selectedChoiceId,
    questionNumber,
    correctCount,
    celebrate,
    isTeaching:
      phase === 'welcome' ||
      phase === 'teach-even' ||
      phase === 'teach-odd' ||
      phase === 'check-understanding',
    revealAnswer:
      phase === 'teach-even' ||
      phase === 'teach-odd' ||
      phase === 'retry' ||
      phase === 'correct',
    onChoice,
    replay,
    understand,
    tryAgain,
    startNextRound,
  };
}
