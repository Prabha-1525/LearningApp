import {aiGateway} from '@infrastructure/ai';

type TtsModule = {
  setDefaultLanguage: (lang: string) => void;
  setDefaultRate: (rate: number) => void;
  stop: () => void;
  speak: (text: string) => void;
};

let cachedTts: TtsModule | null | undefined;

function loadTts(): TtsModule | null {
  if (cachedTts !== undefined) {
    return cachedTts;
  }
  try {
    // Optional native module — Jest / sims without pods still work via captions.

    const mod = require('react-native-tts') as TtsModule;
    mod.setDefaultLanguage('ta-IN');
    mod.setDefaultRate(0.42);
    cachedTts = mod;
    return mod;
  } catch {
    cachedTts = null;
    return null;
  }
}

/**
 * Speaks Tamil coach lines.
 * Prefers backend TTS URI when configured; always falls back to on-device TTS.
 */
export async function speakCoachLine(text: string): Promise<void> {
  if (!text.trim()) {
    return;
  }

  stopCoachSpeech();

  const synthesized = await aiGateway.synthesizeTamilSpeech({
    text,
    locale: 'ta',
    speechRate: 0.9,
  });

  const tts = loadTts();
  if (tts) {
    tts.speak(text);
    return;
  }

  // No device TTS — keep caption UX; optionally a real audioUri is ready for a future player.
  if (synthesized.ok && synthesized.value.audioUri.startsWith('http')) {
    // Playback library not linked yet; caption remains the guarantee.
  }
}

export function stopCoachSpeech(): void {
  const tts = loadTts();
  tts?.stop();
}
