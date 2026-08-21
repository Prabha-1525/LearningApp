import Tts from 'react-native-tts';

class ShapesAudioEngine {
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
          Tts.setDefaultRate(0.38); // Slow and clear for 6-year-olds
          Tts.setDefaultPitch(1.08); // Friendly pitch
          this.isTtsInitialized = true;
        })
        .catch(() => {
          // Graceful fallback
        });
    } catch {
      // Non-critical
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
        // Audio synthesis tone hook
      }
    } catch {
      // Non-critical
    }
  }

  public playSuccessChime(): void {
    this.playTone(587, 80);
    setTimeout(() => this.playTone(880, 160), 90);
  }

  public playMatchSound(): void {
    this.playTone(659, 80);
    setTimeout(() => this.playTone(987, 140), 90);
  }

  public playSideCountTone(sideIndex: number): void {
    this.playTone(440 + sideIndex * 60, 80);
  }

  public playSortingSnap(): void {
    this.playTone(523, 70);
    setTimeout(() => this.playTone(784, 120), 80);
  }

  public playCelebrationFanfare(): void {
    const notes = [523, 659, 784, 1046];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 100), index * 100);
    });
  }
}

export const shapesAudio = new ShapesAudioEngine();
