import {aiGateway} from '@infrastructure/ai';

type TtsModule = {
  setDefaultLanguage?: (lang: string) => void;
  setDefaultRate?: (rate: number) => void;
  stop?: () => void;
  speak?: (text: string) => void;
};

let cachedTts: TtsModule | null | undefined;

function loadTts(): TtsModule | null {
  if (cachedTts !== undefined) {
    return cachedTts;
  }
  try {
    const raw = require('react-native-tts');
    const mod = (raw && raw.default ? raw.default : raw) as TtsModule;
    if (mod && typeof mod.stop === 'function') {
      if (typeof mod.setDefaultLanguage === 'function') {
        void Promise.resolve(mod.setDefaultLanguage('ta-IN')).catch(() => {});
      }
      if (typeof mod.setDefaultRate === 'function') {
        void Promise.resolve(mod.setDefaultRate(0.42)).catch(() => {});
      }
      cachedTts = mod;
      return mod;
    }
    cachedTts = null;
    return null;
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
  try {
    await aiGateway.synthesizeTamilSpeech({
      text,
      locale: 'ta',
      speechRate: 0.9,
    });
    const tts = loadTts();
    if (tts && typeof tts.speak === 'function') {
      tts.speak(text);
    }
  } catch {
    // optional TTS fallback
  }
}

export function stopCoachSpeech(): void {
  try {
    const tts = loadTts();
    if (tts && typeof tts.stop === 'function') {
      tts.stop();
    }
  } catch {
    // optional TTS stop catch
  }
}
