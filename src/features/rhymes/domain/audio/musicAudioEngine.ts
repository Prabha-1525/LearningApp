import type {MelodyNote} from '../entities/musicEntities';

export const PIANO_SCALE: readonly MelodyNote[] = [
  {note: 'C4', solfege: 'Do', keyColor: '#EF4444', freq: 261.63},
  {note: 'D4', solfege: 'Re', keyColor: '#F97316', freq: 293.66},
  {note: 'E4', solfege: 'Mi', keyColor: '#FBBF24', freq: 329.63},
  {note: 'F4', solfege: 'Fa', keyColor: '#10B981', freq: 349.23},
  {note: 'G4', solfege: 'So', keyColor: '#06B6D4', freq: 392.0},
  {note: 'A4', solfege: 'La', keyColor: '#3B82F6', freq: 440.0},
  {note: 'B4', solfege: 'Ti', keyColor: '#8B5CF6', freq: 493.88},
  {note: 'C5', solfege: 'Do', keyColor: '#EC4899', freq: 523.25},
];

class SimpleAudioSynth {
  private audioCtx: any = null;

  private getContext(): any {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !this.audioCtx) {
        try {
          this.audioCtx = new AudioContextClass();
        } catch {
          // context creation fallback
        }
      }
    }
    return this.audioCtx;
  }

  public playTone(
    frequency: number,
    durationMs: number = 300,
    type: OscillatorType = 'sine',
  ): void {
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }

    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000,
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Safe fallback
    }
  }

  public playDrumBeat(): void {
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }

    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Safe fallback
    }
  }

  public playInstrumentSequence(
    frequencies: readonly number[],
    type: OscillatorType = 'sine',
    stepDelayMs: number = 220,
  ): void {
    frequencies.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 280, type);
      }, idx * stepDelayMs);
    });
  }
}

export const musicSynth = new SimpleAudioSynth();
