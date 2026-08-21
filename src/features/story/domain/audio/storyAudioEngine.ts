import Tts from 'react-native-tts';

class StoryAudioEngine {
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
          Tts.setDefaultRate(0.38); // Slow and clear narration for 6yo story reading
          Tts.setDefaultPitch(1.05); // Cheerful, gentle voice
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

  public playPageTurn(): void {
    this.playTone(523, 60);
  }

  public playCelebrationFanfare(): void {
    const notes = [523, 659, 784, 1046];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 100), index * 100);
    });
  }
}

export const storyAudio = new StoryAudioEngine();
