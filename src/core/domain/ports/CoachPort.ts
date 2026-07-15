import type {Result} from '@shared/lib';

/**
 * Cross-cutting AI coach port.
 * Features depend on this interface; Infrastructure binds OpenAI or Gemini.
 */
export type CoachHintRequest = {
  readonly moduleId: string;
  readonly context: string;
  readonly childAgeYears: number;
  readonly locale: 'en' | 'ta';
};

export type CoachHintResponse = {
  readonly message: string;
  readonly difficulty: 'gentle' | 'standard';
};

export type CoachPort = {
  requestHint(request: CoachHintRequest): Promise<Result<CoachHintResponse>>;
};
