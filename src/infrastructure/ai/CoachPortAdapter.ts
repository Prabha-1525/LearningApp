import {ok, type Result} from '@shared/lib';
import type {
  CoachHintRequest,
  CoachHintResponse,
  CoachPort,
} from '@core/domain';
import type {AIService} from '@core/ai';

/**
 * Binds CoachPort to the provider-agnostic AIService (Gemini primary).
 */
export function createCoachPort(ai: AIService): CoachPort {
  return {
    async requestHint(
      request: CoachHintRequest,
    ): Promise<Result<CoachHintResponse>> {
      const result = await ai.generateHint({
        context: {
          moduleId: request.moduleId === 'math' ? 'math' : 'chess',
          lessonId: request.moduleId,
          lessonTitle: request.moduleId,
          childAgeYears: request.childAgeYears,
          locale: request.locale,
        },
        situation: request.context,
      });

      if (!result.ok) {
        return result;
      }

      return ok({
        message: result.value.text,
        difficulty: request.childAgeYears <= 6 ? 'gentle' : 'standard',
      });
    },
  };
}
