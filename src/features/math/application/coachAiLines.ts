import {aiService} from '@infrastructure/ai';
import {buildLessonContext, resolveCoachLine} from '@shared/ai';

import type {MathLessonId} from '../domain/curriculum/types';
import {getLesson} from '../domain/curriculum/lessons';

function mathContext(lessonId: MathLessonId) {
  const lesson = getLesson(lessonId);
  return buildLessonContext({
    moduleId: 'math',
    lessonId,
    lessonTitle: lesson.titleEn,
    locale: 'en',
  });
}

export async function mathLessonIntroLine(
  lessonId: MathLessonId,
  fallback: string,
): Promise<string> {
  const lesson = getLesson(lessonId);
  return resolveCoachLine(
    () =>
      aiService.generateLesson({
        context: mathContext(lessonId),
        topic: lesson.subtitleEn,
      }),
    fallback,
  );
}

export async function mathPraiseLine(
  lessonId: MathLessonId,
  success: string,
  fallback: string,
): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.encourageChild({
        context: mathContext(lessonId),
        success,
      }),
    fallback,
  );
}

export async function mathExplainLine(
  lessonId: MathLessonId,
  question: string,
  correctAnswer: string,
  childAnswer: string | undefined,
  fallback: string,
): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.explainAnswer({
        context: mathContext(lessonId),
        question,
        correctAnswer,
        childAnswer,
      }),
    fallback,
  );
}

export async function mathComfortLine(
  lessonId: MathLessonId,
  mistake: string,
  fallback: string,
): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.comfortChild({
        context: mathContext(lessonId),
        mistake,
      }),
    fallback,
  );
}
