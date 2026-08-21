import Tts from 'react-native-tts';

class PhonicsAudioEngine {
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
          Tts.setDefaultRate(0.38); // Gentle and clear for 6yo phonics
          Tts.setDefaultPitch(1.08); // Cheerful voice
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

  public async speakLetterPhoneme(
    letter: string,
    sound: string,
    exampleWord?: string,
  ): Promise<void> {
    const text = exampleWord
      ? `${letter} says ${sound}. As in ${exampleWord}!`
      : `${letter} says ${sound}!`;
    await this.speak(text);
  }

  public async speakSlowBlend(
    sounds: readonly string[],
    finalWord: string,
  ): Promise<void> {
    const blendSequence = `${sounds.join(
      ' ... ',
    )} ... blends to ... ${finalWord}!`;
    await this.speak(blendSequence);
  }

  public async speakWord(word: string): Promise<void> {
    await this.speak(word);
  }

  public async speakSentence(sentence: string): Promise<void> {
    await this.speak(sentence);
  }

  public playTone(frequency: number, _durationMs = 100): void {
    try {
      if (frequency > 0) {
        // Audio synthesis tone hook
      }
    } catch {
      // Non-critical
    }
  }

  public playSuccessFanfare(): void {
    const notes = [523, 659, 784, 1046];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 90), index * 90);
    });
  }

  public playTryAgain(): void {
    this.playTone(320, 120);
  }
}

export const phonicsAudio = new PhonicsAudioEngine();
