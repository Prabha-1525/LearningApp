import type {Result} from '@shared/lib';
import type {AiGenerateResponse, LessonContext} from '@core/ai';
import {aiService} from '@infrastructure/ai';

/**
 * Resolves coach speech: Gemini AI when available, static Tamil fallback otherwise.
 */
export async function resolveCoachLine(
  aiCall: () => Promise<Result<AiGenerateResponse>>,
  fallback: string,
): Promise<string> {
  try {
    const result = await aiCall();
    if (result.ok && result.value.text.trim().length > 0) {
      return result.value.text;
    }
  } catch {
    // Offline or provider error — use fallback script.
  }
  return fallback;
}

export function buildLessonContext(input: {
  moduleId: LessonContext['moduleId'];
  lessonId: string;
  lessonTitle: string;
  childAgeYears?: number;
  locale?: LessonContext['locale'];
}): LessonContext {
  return {
    moduleId: input.moduleId,
    lessonId: input.lessonId,
    lessonTitle: input.lessonTitle,
    childAgeYears: input.childAgeYears ?? 6,
    locale: input.locale ?? 'ta',
  };
}

export {aiService};
