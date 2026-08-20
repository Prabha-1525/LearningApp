type TtsInstance = {
  getInitStatus: () => Promise<unknown>;
  setDefaultLanguage: (lang: string) => Promise<unknown> | void;
  setDefaultRate: (rate: number) => Promise<unknown> | void;
  setDefaultPitch?: (pitch: number) => Promise<unknown> | void;
  stop: () => void;
  speak: (text: string) => void;
  addEventListener?: (
    type: string,
    handler: (data?: any) => void,
  ) => {remove: () => void};
};

let cachedTts: TtsInstance | null | undefined;
let initAttempted = false;
let initReady = false;
let pendingFinish: (() => void) | null = null;
let currentHighlightInterval: any = null;

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

async function ensureTtsReady(): Promise<boolean> {
  if (initAttempted) {
    return initReady;
  }
  initAttempted = true;
  const tts = loadTts();
  if (!tts) {
    return false;
  }
  try {
    if (typeof tts.addEventListener === 'function') {
      tts.addEventListener('tts-finish', () => {
        pendingFinish?.();
        pendingFinish = null;
      });
      tts.addEventListener('tts-error', () => {});
    }
    if (typeof tts.getInitStatus === 'function') {
      await Promise.resolve(tts.getInitStatus()).catch(() => {});
    }
    if (typeof tts.setDefaultLanguage === 'function') {
      await Promise.resolve(tts.setDefaultLanguage('en-US')).catch(() => {});
    }
    if (typeof tts.setDefaultRate === 'function') {
      await Promise.resolve(tts.setDefaultRate(0.38)).catch(() => {}); // Clear, gentle pace for 6-year-olds
    }
    if (typeof tts.setDefaultPitch === 'function') {
      await Promise.resolve(tts.setDefaultPitch(1.05)).catch(() => {});
    }
    initReady = true;
    return true;
  } catch {
    initReady = false;
    return false;
  }
}

class EnglishAudioEngine {
  private audioCtx: any = null;

  private getContext(): any {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !this.audioCtx) {
        try {
          this.audioCtx = new AudioContextClass();
        } catch {
          // AudioContext fallback
        }
      }
    }
    return this.audioCtx;
  }

  public playTone(
    frequency: number,
    durationMs: number = 250,
    type: OscillatorType = 'sine',
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Safe audio fallback
    }
  }

  public playSuccessChime(): void {
    this.playTone(523.25, 120, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 120, 'sine'), 120); // E5
    setTimeout(() => this.playTone(783.99, 260, 'sine'), 240); // G5
  }

  public playCelebrationFanfare(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 250, 'triangle');
      }, idx * 160);
    });
  }

  public playTryAgainTone(): void {
    this.playTone(330.0, 150, 'sine');
    setTimeout(() => this.playTone(293.66, 200, 'sine'), 150);
  }

  public stopAll(): void {
    if (currentHighlightInterval) {
      clearInterval(currentHighlightInterval);
      currentHighlightInterval = null;
    }
    pendingFinish = null;
    loadTts()?.stop();
  }

  public async speak(text: string): Promise<void> {
    if (!text.trim()) return;
    this.stopAll();
    const ready = await ensureTtsReady();
    const tts = loadTts();
    if (!ready || !tts) return;

    return new Promise<void>(resolve => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        pendingFinish = null;
        resolve();
      };

      const wordCount = text.trim().split(/\s+/).length;
      const timer = setTimeout(done, Math.max(1200, wordCount * 550));
      pendingFinish = done;

      try {
        tts.speak(text);
      } catch {
        done();
      }
    });
  }

  public async speakLetter(
    letter: string,
    wordExample?: string,
  ): Promise<void> {
    const speech = wordExample
      ? `Letter ${letter}. Like in ${wordExample}.`
      : `Letter ${letter}`;
    return this.speak(speech);
  }

  public async speakPhonicsSound(
    letter: string,
    soundDescription: string,
  ): Promise<void> {
    return this.speak(`${letter} says ${soundDescription}`);
  }

  public async blendWordPhonemes(
    phonemes: readonly string[],
    blendedWord: string,
  ): Promise<void> {
    const sequence = phonemes.join('... ') + `... ${blendedWord}!`;
    return this.speak(sequence);
  }

  public readSentenceWithKaraoke(
    words: readonly string[],
    onWordHighlight: (index: number) => void,
    onComplete: () => void,
  ): void {
    this.stopAll();
    const fullSentence = words.join(' ');
    this.speak(fullSentence);

    let currentIdx = 0;
    onWordHighlight(0);

    const stepMs = 520;
    currentHighlightInterval = setInterval(() => {
      currentIdx += 1;
      if (currentIdx < words.length) {
        onWordHighlight(currentIdx);
      } else {
        clearInterval(currentHighlightInterval);
        currentHighlightInterval = null;
        onWordHighlight(-1);
        onComplete();
      }
    }, stepMs);
  }
}

export const englishAudio = new EnglishAudioEngine();
