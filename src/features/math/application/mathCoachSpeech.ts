type TtsInstance = {
  getInitStatus: () => Promise<unknown>;
  setDefaultLanguage: (lang: string) => Promise<unknown> | void;
  setDefaultRate: (rate: number) => Promise<unknown> | void;
  stop: () => void;
  speak: (text: string) => void;
  addEventListener: (type: string, handler: () => void) => {remove: () => void};
};

export type MathSpeechResult = {
  readonly ok: boolean;
  readonly error?: string;
};

let cachedTts: TtsInstance | null | undefined;
let initAttempted = false;
let initReady = false;
let initError: string | null = null;
let finishListener: {remove: () => void} | null = null;
let pendingFinish: (() => void) | null = null;

function loadTts(): TtsInstance | null {
  if (cachedTts !== undefined) {
    return cachedTts;
  }
  try {
    const mod = require('react-native-tts');
    cachedTts = (mod.default ?? mod) as TtsInstance;
    return cachedTts;
  } catch {
    cachedTts = null;
    return null;
  }
}

function ensureFinishListener(tts: TtsInstance): void {
  if (finishListener) {
    return;
  }
  finishListener = tts.addEventListener('tts-finish', () => {
    pendingFinish?.();
    pendingFinish = null;
  });
}

async function ensureTtsReady(): Promise<boolean> {
  if (initAttempted) {
    return initReady;
  }
  initAttempted = true;
  const tts = loadTts();
  if (!tts) {
    initError = 'Voice is not available on this device.';
    return false;
  }
  try {
    await tts.getInitStatus();
    await tts.setDefaultLanguage('en-US');
    await tts.setDefaultRate(0.42);
    ensureFinishListener(tts);
    initReady = true;
    return true;
  } catch {
    initError = 'Voice could not start. Tap replay to try again.';
    return false;
  }
}

function estimateSpeechMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.min(12000, Math.max(900, words * 420));
}

/** Speaks simple English coach lines and waits until playback finishes. */
export async function speakMathCoach(text: string): Promise<MathSpeechResult> {
  if (!text.trim()) {
    return {ok: true};
  }

  const ready = await ensureTtsReady();
  if (!ready) {
    return {ok: false, error: initError ?? 'Voice is not available.'};
  }

  const tts = loadTts();
  if (!tts) {
    return {ok: false, error: 'Voice is not available.'};
  }

  stopMathCoachSpeech();

  return new Promise<MathSpeechResult>(resolve => {
    let settled = false;
    const done = (result: MathSpeechResult) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      pendingFinish = null;
      resolve(result);
    };

    const timer = setTimeout(() => {
      done({ok: true});
    }, estimateSpeechMs(text));

    pendingFinish = () => done({ok: true});

    try {
      tts.speak(text);
    } catch {
      done({
        ok: false,
        error: 'Could not play voice. Tap replay to try again.',
      });
    }
  });
}

export function stopMathCoachSpeech(): void {
  pendingFinish = null;
  loadTts()?.stop();
}

export function getMathCoachSpeechError(): string | null {
  return initError;
}
