import {
  CVC_WORDS_CATALOG,
  PHONICS_EXERCISES_MAP,
  PHONICS_LETTERS,
  PHONICS_SENTENCES,
  PHONICS_SUBMODULES,
  WORD_FAMILIES_CATALOG,
  WORD_TRANSFORMATIONS,
} from '../domain/catalog/phonicsData';
import {
  getPhonicsOverallProgress,
  readPhonicsProgress,
  recordPhonicsLessonResult,
  resetPhonicsProgress,
} from '../data/progress/phonicsProgress';
import {phonicsAudio} from '../domain/audio/phonicsAudioEngine';
import {BADGE_RULES} from '@core/gamification/domain/catalog/badgeRules';

describe('Phonics Catalog', () => {
  it('defines 16 sequential submodules', () => {
    expect(PHONICS_SUBMODULES).toHaveLength(16);
    const ids = PHONICS_SUBMODULES.map(s => s.id);
    expect(new Set(ids).size).toBe(16);
  });

  it('contains all 26 letters with phonics sounds and objects', () => {
    expect(PHONICS_LETTERS).toHaveLength(26);
    PHONICS_LETTERS.forEach(item => {
      expect(item.letter).toBeTruthy();
      expect(item.lowercase).toBeTruthy();
      expect(item.soundSymbol).toBeTruthy();
      expect(item.exampleWord).toBeTruthy();
      expect(item.exampleEmoji).toBeTruthy();
    });
  });

  it('contains rich CVC words and word families', () => {
    expect(CVC_WORDS_CATALOG.length).toBeGreaterThanOrEqual(20);
    CVC_WORDS_CATALOG.forEach(cvc => {
      expect(cvc.word).toHaveLength(3);
      expect(cvc.letters).toHaveLength(3);
      expect(cvc.sounds).toHaveLength(3);
      expect(cvc.soundSymbols).toHaveLength(3);
      expect(cvc.emoji).toBeTruthy();
    });

    expect(WORD_FAMILIES_CATALOG).toHaveLength(8);
    expect(WORD_TRANSFORMATIONS.length).toBeGreaterThanOrEqual(5);
    expect(PHONICS_SENTENCES.length).toBeGreaterThanOrEqual(8);
  });

  it('provides valid exercises for each interactive submodule', () => {
    expect(Object.keys(PHONICS_EXERCISES_MAP).length).toBeGreaterThanOrEqual(5);
    Object.values(PHONICS_EXERCISES_MAP).forEach(questions => {
      questions.forEach(q => {
        expect(q.prompt).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.options).toContain(q.correctOption);
      });
    });
  });
});

describe('Phonics Progress & Sequential Unlocking', () => {
  beforeEach(() => {
    resetPhonicsProgress();
  });

  it('initializes with letter_sounds unlocked', () => {
    const p = readPhonicsProgress();
    expect(p.unlockedSubModuleIds).toEqual(['letter_sounds']);
    expect(p.completedSubModuleIds).toEqual([]);
    expect(p.totalStars).toBe(0);
  });

  it('records result, awards stars, and unlocks the next submodule', () => {
    const res = recordPhonicsLessonResult('letter_sounds', 100, 3);
    expect(res.isFirstCompletion).toBe(true);
    expect(res.unlockedNextId).toBe('sound_recognition');
    expect(res.progress.unlockedSubModuleIds).toContain('sound_recognition');
    expect(res.progress.completedSubModuleIds).toContain('letter_sounds');
    expect(res.progress.totalStars).toBe(3);

    const overall = getPhonicsOverallProgress(res.progress);
    expect(overall.completedLessons).toBe(1);
    expect(overall.totalLessons).toBe(16);
    expect(overall.percent).toBe(6); // 1/16 = 6.25% -> 6%
  });
});

describe('Phonics Audio Engine', () => {
  it('invokes phoneme, blending, word, and tone methods gracefully', () => {
    expect(() => phonicsAudio.playTone(440, 50)).not.toThrow();
    expect(() => phonicsAudio.playSuccessFanfare()).not.toThrow();
    expect(() => phonicsAudio.playTryAgain()).not.toThrow();
    expect(() =>
      phonicsAudio.speakLetterPhoneme('A', 'ah', 'Apple'),
    ).not.toThrow();
    expect(() =>
      phonicsAudio.speakSlowBlend(['kuh', 'ah', 'tuh'], 'CAT'),
    ).not.toThrow();
    expect(() => phonicsAudio.speakWord('CAT')).not.toThrow();
    expect(() => phonicsAudio.speakSentence('The cat sat.')).not.toThrow();
  });
});

describe('Phonics Gamification Badges', () => {
  it('evaluates all 8 Phonics badges in badgeRules', () => {
    const phonicsRules = BADGE_RULES.filter(
      r =>
        r.badgeId === 'badge.phonics_sound_starter' ||
        r.badgeId === 'badge.phonics_sound_detective' ||
        r.badgeId === 'badge.phonics_explorer' ||
        r.badgeId === 'badge.phonics_blending_star' ||
        r.badgeId === 'badge.phonics_little_reader' ||
        r.badgeId === 'badge.phonics_word_builder' ||
        r.badgeId === 'badge.phonics_word_family_star' ||
        r.badgeId === 'badge.phonics_champion',
    );
    expect(phonicsRules).toHaveLength(8);

    const starterRule = phonicsRules.find(
      r => r.id === 'phonics_sound_starter',
    );
    expect(
      starterRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        phonicsLessonsCompleted: 1,
      }),
    ).toBe(true);

    const detectiveRule = phonicsRules.find(
      r => r.id === 'phonics_sound_detective',
    );
    expect(
      detectiveRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        phonicsLessonsCompleted: 3,
      }),
    ).toBe(true);

    const readerRule = phonicsRules.find(r => r.id === 'phonics_little_reader');
    expect(
      readerRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        cvcWordsLearnedCount: 10,
      }),
    ).toBe(true);

    const championRule = phonicsRules.find(r => r.id === 'phonics_champion');
    expect(
      championRule?.evaluate({
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        phonicsLessonsCompleted: 16,
      }),
    ).toBe(true);
  });
});
