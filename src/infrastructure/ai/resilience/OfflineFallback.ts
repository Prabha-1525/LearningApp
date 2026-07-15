import type {AiLocale, LlmGenerateResponse, PromptId} from '../types';

/**
 * Offline Tamil/English script fallbacks when proxies are unavailable.
 * Not full lesson content — short coach utterances only.
 */
const FALLBACKS: Record<PromptId, Record<AiLocale, string>> = {
  'coach.hint': {
    ta: 'மெதுவாக பார். இலக்கை நினைவில் வை. மீண்டும் முயற்சி செய்.',
    en: 'Look slowly. Remember the goal. Try again.',
  },
  'coach.explain': {
    ta: 'நல்ல முயற்சி. அந்த காய் அவ்வளவு தூரம் நகர்ந்தது.',
    en: 'Nice try. That piece moved that far.',
  },
  'coach.praise': {
    ta: 'அருமை! நீ நன்றாக முயன்றாய்.',
    en: 'Awesome! You tried so well.',
  },
  'coach.comfort': {
    ta: 'பரவாயில்லை. மீண்டும் விளையாடலாம்.',
    en: 'That is okay. We can try again.',
  },
  'coach.greet': {
    ta: 'வணக்கம்! இன்று ஒரு சிறிய பாடம் கற்போம்.',
    en: 'Hello! Let’s learn one small thing today.',
  },
};

export function offlineFallbackText(
  promptId: PromptId,
  locale: AiLocale,
): LlmGenerateResponse {
  return {
    text: FALLBACKS[promptId][locale] ?? FALLBACKS[promptId].en,
    provider: 'offline',
    cached: false,
  };
}

export function isProbablyOfflineError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true;
  }
  if (error instanceof Error) {
    return /network|offline|Failed to fetch|aborted/i.test(error.message);
  }
  return false;
}
