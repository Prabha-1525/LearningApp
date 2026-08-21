import Tts from 'react-native-tts';

class AnimalsAudioEngine {
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
          Tts.setDefaultRate(0.38); // Slow and crystal clear for 6-year-olds
          Tts.setDefaultPitch(1.06); // Friendly and cheerful pitch
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

  public playAnimalSound(frequency: number, onomatopoeia: string): void {
    this.playTone(frequency, 200);
    this.speak(onomatopoeia);
  }

  public playSuccessChime(): void {
    this.playTone(587, 80);
    setTimeout(() => this.playTone(880, 160), 90);
  }

  public playMatchSound(): void {
    this.playTone(659, 80);
    setTimeout(() => this.playTone(987, 140), 90);
  }

  public playCelebrationFanfare(): void {
    const notes = [523, 659, 784, 1046];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 100), index * 100);
    });
  }
}

export const animalsAudio = new AnimalsAudioEngine();
