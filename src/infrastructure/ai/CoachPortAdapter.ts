import {ok, type Result} from '@shared/lib';
import type {
  CoachHintRequest,
  CoachHintResponse,
  CoachPort,
} from '@core/domain';

import type {AiGateway} from './types';

/**
 * Binds CoachPort to the AI gateway (OpenAI / Gemini / offline).
 */
export function createCoachPort(gateway: AiGateway): CoachPort {
  return {
    async requestHint(
      request: CoachHintRequest,
    ): Promise<Result<CoachHintResponse>> {
      const conversationId = `coach.${request.moduleId}`;
      const result = await gateway.generateText({
        promptId: 'coach.hint',
        locale: request.locale,
        conversationId,
        variables: {
          locale: request.locale,
          age: request.childAgeYears,
          lesson: request.moduleId,
          context: request.context,
        },
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
