import {
  ALPHABET_LETTERS,
  BEGINNING_SOUNDS_DATA,
  BLENDING_WORDS_DATA,
  CVC_WORDS_DATA,
  ENGLISH_SUB_MODULES,
  LETTER_MATCH_PAIRS,
  LETTER_OBJECTS_DATA,
  LETTER_SOUNDS_DATA,
  PHONICS_ITEMS,
  SENTENCE_READING_DATA,
  SHORT_STORIES_DATA,
  SIGHT_WORDS_DATA,
  SUBMODULE_QUIZZES,
  TONGUE_TWISTERS_DATA,
  WORD_BUILDING_TASKS,
} from '../domain/catalog/englishData';
import {
  DEFAULT_ENGLISH_PROGRESS,
  getEnglishOverallProgress,
  isLessonUnlocked,
  isSubModuleUnlocked,
  readEnglishProgress,
  recordEnglishLessonResult,
  recordReadingChallengeScore,
  writeEnglishProgress,
} from '../data/progress/englishProgress';
import {
  evaluateNewBadges,
  type BadgeEvalContext,
} from '@core/gamification/domain/catalog/badgeRules';

describe('English Learning Module', () => {
  describe('Data Catalog Integrity', () => {
    it('contains all 14 sub-modules', () => {
      expect(ENGLISH_SUB_MODULES).toHaveLength(14);
      expect(ENGLISH_SUB_MODULES.map(m => m.id)).toEqual([
        'alphabet',
        'capital_small',
        'letter_sounds',
        'letter_objects',
        'beginning_sounds',
        'phonics',
        'sound_blending',
        'word_building',
        'cvc_words',
        'sight_words',
        'tongue_twisters',
        'sentence_reading',
        'short_stories',
        'reading_challenge',
      ]);
    });

    it('contains full 26 A-Z alphabet letters with upper, lower, and sound definitions', () => {
      expect(ALPHABET_LETTERS).toHaveLength(26);
      expect(ALPHABET_LETTERS[0].upper).toBe('A');
      expect(ALPHABET_LETTERS[0].lower).toBe('a');
      expect(ALPHABET_LETTERS[25].upper).toBe('Z');
      expect(ALPHABET_LETTERS[25].lower).toBe('z');
      ALPHABET_LETTERS.forEach(letter => {
        expect(letter.word).toBeTruthy();
        expect(letter.emoji).toBeTruthy();
        expect(letter.soundIpa).toBeTruthy();
        expect(letter.sentence).toBeTruthy();
        expect(letter.audioSpeech).toBeTruthy();
      });
    });

    it('contains capital and small letter matching pairs', () => {
      expect(LETTER_MATCH_PAIRS.length).toBeGreaterThanOrEqual(10);
      LETTER_MATCH_PAIRS.forEach(pair => {
        expect(pair.upper.toLowerCase()).toBe(pair.lower);
        expect(pair.distractors.length).toBeGreaterThan(0);
      });
    });

    it('contains phonetic sounds and beginning sound items', () => {
      expect(LETTER_SOUNDS_DATA.length).toBeGreaterThanOrEqual(5);
      expect(BEGINNING_SOUNDS_DATA.length).toBeGreaterThanOrEqual(5);
      BEGINNING_SOUNDS_DATA.forEach(item => {
        expect(item.word.startsWith(item.firstLetter)).toBe(true);
        expect(item.distractorSounds.length).toBeGreaterThan(0);
      });
    });

    it('contains letter-object associations with valid distractors', () => {
      expect(LETTER_OBJECTS_DATA.length).toBeGreaterThanOrEqual(5);
      LETTER_OBJECTS_DATA.forEach(item => {
        expect(item.objectName.startsWith(item.letter)).toBe(true);
        expect(item.distractors.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('contains phonics and sound blending items', () => {
      expect(PHONICS_ITEMS.length).toBeGreaterThanOrEqual(5);
      expect(BLENDING_WORDS_DATA.length).toBeGreaterThanOrEqual(5);
      BLENDING_WORDS_DATA.forEach(blend => {
        expect(blend.letters.join('').toLowerCase()).toBe(blend.blendedWord);
      });
    });

    it('contains word building tasks with target words and scrambled tiles', () => {
      expect(WORD_BUILDING_TASKS.length).toBeGreaterThanOrEqual(6);
      WORD_BUILDING_TASKS.forEach(task => {
        const letters = task.targetWord.split('');
        letters.forEach(l => {
          expect(task.scrambledLetters).toContain(l);
        });
      });
    });

    it('contains CVC words covering short vowels a, e, i, o, u', () => {
      expect(CVC_WORDS_DATA.length).toBeGreaterThanOrEqual(15);
      const vowels = new Set(CVC_WORDS_DATA.map(w => w.vowel));
      expect(vowels.has('a')).toBe(true);
      expect(vowels.has('e')).toBe(true);
      expect(vowels.has('i')).toBe(true);
      expect(vowels.has('o')).toBe(true);
      expect(vowels.has('u')).toBe(true);
      CVC_WORDS_DATA.forEach(cvc => {
        expect(cvc.onset + cvc.rime).toBe(cvc.word);
      });
    });

    it('contains sight words and tongue twisters', () => {
      expect(SIGHT_WORDS_DATA.length).toBeGreaterThanOrEqual(10);
      expect(TONGUE_TWISTERS_DATA.length).toBeGreaterThanOrEqual(4);
    });

    it('contains sentence reading lessons and illustrated short stories with comprehension', () => {
      expect(SENTENCE_READING_DATA.length).toBeGreaterThanOrEqual(5);
      SENTENCE_READING_DATA.forEach(sen => {
        expect(sen.words.length).toBeGreaterThan(0);
        expect(sen.comprehensionQuestion.options).toContain(
          sen.comprehensionQuestion.answer,
        );
      });

      expect(SHORT_STORIES_DATA.length).toBeGreaterThanOrEqual(3);
      SHORT_STORIES_DATA.forEach(story => {
        expect(story.pages.length).toBeGreaterThan(1);
        expect(story.questions.length).toBeGreaterThan(0);
      });
    });

    it('contains quiz questions for all core sub-modules', () => {
      expect(SUBMODULE_QUIZZES.alphabet.length).toBeGreaterThanOrEqual(3);
      expect(SUBMODULE_QUIZZES.capital_small.length).toBeGreaterThanOrEqual(3);
      expect(SUBMODULE_QUIZZES.letter_sounds.length).toBeGreaterThanOrEqual(3);
      expect(SUBMODULE_QUIZZES.beginning_sounds.length).toBeGreaterThanOrEqual(
        3,
      );
      expect(SUBMODULE_QUIZZES.cvc_words.length).toBeGreaterThanOrEqual(3);
      expect(SUBMODULE_QUIZZES.sight_words.length).toBeGreaterThanOrEqual(3);
      expect(SUBMODULE_QUIZZES.reading_challenge.length).toBeGreaterThanOrEqual(
        5,
      );
    });
  });

  describe('Progress Persistence & Unlock Progression', () => {
    beforeEach(() => {
      writeEnglishProgress(DEFAULT_ENGLISH_PROGRESS);
    });

    it('reads default progress correctly', () => {
      const p = readEnglishProgress();
      expect(p.totalStars).toBe(0);
      expect(p.completedSubModules).toEqual([]);
    });

    it('allows initial submodules to be unlocked by default', () => {
      const p = readEnglishProgress();
      expect(isSubModuleUnlocked('alphabet', p)).toBe(true);
      expect(isSubModuleUnlocked('capital_small', p)).toBe(true);
      // Later submodules are locked initially
      expect(isSubModuleUnlocked('cvc_words', p)).toBe(false);
      expect(isSubModuleUnlocked('reading_challenge', p)).toBe(false);
    });

    it('unlocks subsequent sub-modules when prior sub-module is completed', () => {
      let p = readEnglishProgress();
      expect(isSubModuleUnlocked('letter_sounds', p)).toBe(false);

      // Complete capital_small
      const res = recordEnglishLessonResult(
        'capital_small',
        'capital_small_match',
        3,
        100,
      );
      p = res.progress;

      expect(p.completedSubModules).toContain('capital_small');
      expect(isSubModuleUnlocked('letter_sounds', p)).toBe(true);
    });

    it('accumulates stars, scores, and mastered words correctly', () => {
      recordEnglishLessonResult('alphabet', 'alpha_1', 3, 100, 'Apple');
      recordEnglishLessonResult('cvc_words', 'cvc_1', 2, 80, 'Cat');

      const p = readEnglishProgress();
      expect(p.totalStars).toBe(5);
      expect(p.wordsMastered).toContain('Apple');
      expect(p.wordsMastered).toContain('Cat');
    });

    it('records reading challenge score and milestone flag', () => {
      const p = recordReadingChallengeScore(5);
      expect(p.readingChallengeScore).toBe(5);
      expect(p.readingChallengePassed).toBe(true);
    });

    it('calculates overall reading progress milestone metrics', () => {
      const summary = getEnglishOverallProgress(DEFAULT_ENGLISH_PROGRESS);
      expect(summary.percent).toBe(0);
      expect(summary.alphabetDone).toBe(false);

      const updated = {
        ...DEFAULT_ENGLISH_PROGRESS,
        completedSubModules: ['alphabet' as const, 'letter_sounds' as const],
      };
      const summary2 = getEnglishOverallProgress(updated);
      expect(summary2.percent).toBeGreaterThan(10);
      expect(summary2.alphabetDone).toBe(true);
      expect(summary2.soundsDone).toBe(true);
    });

    it('checks lesson unlock state', () => {
      const p = readEnglishProgress();
      expect(isLessonUnlocked('alphabet_intro', p)).toBe(true);
    });
  });

  describe('Gamification Badge Rules', () => {
    it('evaluates English badges based on lesson count, stars, and reading achievements', () => {
      const baseCtx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        englishLessonsCompleted: 1,
        englishStars: 1,
      };

      const newBadges1 = evaluateNewBadges(baseCtx);
      expect(newBadges1.some(b => b.id === 'alphabet_starter')).toBe(true);

      const readerCtx: BadgeEvalContext = {
        ...baseCtx,
        englishLessonsCompleted: 12,
        englishStars: 28,
        cvcWordsMastered: 8,
        sightWordsLearned: 6,
        storiesCompleted: 2,
        readingChallengeCompleted: true,
      };

      const newBadges2 = evaluateNewBadges(readerCtx);
      const earnedIds = newBadges2.map(b => b.id);
      expect(earnedIds).toContain('cvc_reader');
      expect(earnedIds).toContain('little_reader');
      expect(earnedIds).toContain('story_reader');
      expect(earnedIds).toContain('reading_champion');
    });
  });
});
