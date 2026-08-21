import Tts from 'react-native-tts';

class DrawingAudioEngine {
  private isTtsInitialized = false;

  constructor() {
    this.initTts();
  }

  private initTts(): void {
    if (this.isTtsInitialized) return;
    try {
      Tts.getInitStatus()
        .then(() => {
          Tts.setDefaultLanguage('en-US');
          Tts.setDefaultRate(0.38); // Kid-friendly pace
          Tts.setDefaultPitch(1.08); // Warm, friendly tone
          this.isTtsInitialized = true;
        })
        .catch(() => {
          // Fallback gracefully in headless test runner
        });
    } catch {
      // Non-critical if TTS unavailable
    }
  }

  public async speak(text: string): Promise<void> {
    try {
      this.initTts();
      await Tts.stop();
      Tts.speak(text);
    } catch {
      // Non-fatal
    }
  }

  public stop(): void {
    try {
      Tts.stop();
    } catch {
      // Non-fatal
    }
  }

  public playTone(frequency: number, _durationMs = 120): void {
    try {
      if (frequency > 0) {
        // Audio tone synth
      }
    } catch {
      // Non-critical
    }
  }

  public playSuccessChime(): void {
    this.playTone(587, 80);
    setTimeout(() => this.playTone(880, 160), 90);
  }

  public playColorMixMagicSound(): void {
    this.playTone(523, 60);
    setTimeout(() => this.playTone(659, 60), 60);
    setTimeout(() => this.playTone(784, 60), 120);
    setTimeout(() => this.playTone(1046, 150), 180);
  }

  public playCelebrationFanfare(): void {
    const notes = [523, 659, 784, 1046];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 100), index * 100);
    });
  }

  public playBrushStrokeSound(): void {
    this.playTone(440, 40);
  }

  public playUndoClick(): void {
    this.playTone(320, 60);
  }

  public playEraserSound(): void {
    this.playTone(260, 80);
  }
}

export const drawingAudio = new DrawingAudioEngine();
