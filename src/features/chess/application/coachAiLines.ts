import {aiService} from '@infrastructure/ai';
import {buildLessonContext, resolveCoachLine} from '@shared/ai';

function chessContext(lessonId = 'play-with-coach') {
  return buildLessonContext({
    moduleId: 'chess',
    lessonId,
    lessonTitle: 'Play with Coach',
    locale: 'ta',
  });
}

export async function chessGreetLine(fallback: string): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.generateLesson({
        context: chessContext(),
        topic: 'friendly chess game for beginners',
      }),
    fallback,
  );
}

export async function chessHintLine(
  situation: string,
  fallback: string,
): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.generateHint({
        context: chessContext(),
        situation,
      }),
    fallback,
  );
}

export async function chessPraiseLine(
  success: string,
  fallback: string,
): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.encourageChild({
        context: chessContext(),
        success,
      }),
    fallback,
  );
}

export async function chessComfortLine(
  mistake: string,
  fallback: string,
): Promise<string> {
  return resolveCoachLine(
    () =>
      aiService.comfortChild({
        context: chessContext(),
        mistake,
      }),
    fallback,
  );
}
