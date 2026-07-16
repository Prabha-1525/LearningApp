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

/** Speaks Tamil coach lines with on-device TTS fallback. */
export async function speakCoachLine(text: string): Promise<void> {
  if (!text.trim()) {
    return;
  }
  stopCoachSpeech();
  await aiGateway.synthesizeTamilSpeech({text, locale: 'ta', speechRate: 0.9});
  const tts = loadTts();
  tts?.speak(text);
}

export function stopCoachSpeech(): void {
  loadTts()?.stop();
}
