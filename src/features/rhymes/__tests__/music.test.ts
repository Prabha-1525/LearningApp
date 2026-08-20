import {
  GUESS_SOUND_QUESTIONS,
  MELODY_SONGS,
  MUSIC_INSTRUMENTS,
  MUSIC_PATTERN_PUZZLES,
  MUSIC_QUIZ_QUESTIONS,
  MUSIC_TOPIC_CARDS,
  RHYTHM_LEVELS,
} from '../domain/catalog/musicData';
import {PIANO_SCALE} from '../domain/audio/musicAudioEngine';
import {
  readMusicProgress,
  recordInstrumentExplored,
  recordMusicTopicCompletion,
  recordRhythmLevelCompleted,
  recordSoundGuessCorrect,
} from '../data/progress/musicProgress';
import {
  evaluateNewBadges,
  type BadgeEvalContext,
} from '@core/gamification/domain/catalog/badgeRules';

describe('Music & Rhymes Module', () => {
  describe('Catalog Data & Scales', () => {
    it('provides 6 instruments with audio note sequences and valid keys', () => {
      expect(MUSIC_INSTRUMENTS.length).toBe(6);
      MUSIC_INSTRUMENTS.forEach(inst => {
        expect(inst.id).toBeDefined();
        expect(inst.emoji).toBeDefined();
        expect(inst.nameKey).toContain('rhymes.instruments');
        expect(inst.baseFrequency).toBeGreaterThan(50);
        expect(inst.noteSequence.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('provides 6 topic cards in the music hub', () => {
      expect(MUSIC_TOPIC_CARDS.length).toBe(6);
      MUSIC_TOPIC_CARDS.forEach(card => {
        expect(card.id).toBeDefined();
        expect(card.titleKey).toContain('rhymes.topics');
        expect(card.emoji).toBeDefined();
      });
    });

    it('provides 6 progressive rhythm beat levels', () => {
      expect(RHYTHM_LEVELS.length).toBe(6);
      RHYTHM_LEVELS.forEach(lvl => {
        expect(lvl.levelNumber).toBeGreaterThanOrEqual(1);
        expect(lvl.beats.length).toBeGreaterThanOrEqual(4);
        expect(lvl.tempoBpm).toBeGreaterThan(50);
        const hasHits = lvl.beats.some(b => b.type === 'hit');
        expect(hasHits).toBe(true);
      });
    });

    it('provides 6 guess-the-sound questions with 3 choices each', () => {
      expect(GUESS_SOUND_QUESTIONS.length).toBe(6);
      GUESS_SOUND_QUESTIONS.forEach(q => {
        expect(q.options.length).toBe(3);
        expect(q.options).toContain(q.targetInstrumentId);
      });
    });

    it('provides 6 musical pattern puzzles with 1 correct option each', () => {
      expect(MUSIC_PATTERN_PUZZLES.length).toBe(6);
      MUSIC_PATTERN_PUZZLES.forEach(puzzle => {
        const correct = puzzle.options.filter(o => o.isCorrect);
        expect(correct.length).toBe(1);
        expect(puzzle.sequence.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('provides 4 nursery melody songs for the mini piano', () => {
      expect(MELODY_SONGS.length).toBe(4);
      MELODY_SONGS.forEach(s => {
        expect(s.notes.length).toBeGreaterThan(4);
        s.notes.forEach(n => {
          expect(n.note).toBeDefined();
          expect(n.durationMs).toBeGreaterThan(0);
        });
      });
    });

    it('provides 8 notes in the piano scale from C4 to C5', () => {
      expect(PIANO_SCALE.length).toBe(8);
      expect(PIANO_SCALE[0]?.note).toBe('C4');
      expect(PIANO_SCALE[7]?.note).toBe('C5');
    });

    it('provides 10 music quiz questions with single correct answers', () => {
      expect(MUSIC_QUIZ_QUESTIONS.length).toBe(10);
      MUSIC_QUIZ_QUESTIONS.forEach(q => {
        const correct = q.options.filter(o => o.isCorrect);
        expect(correct.length).toBe(1);
      });
    });
  });

  describe('Progress Persistence', () => {
    it('returns default progress when nothing is stored', () => {
      const p = readMusicProgress();
      expect(p).toBeDefined();
      expect(p.totalStars).toBeGreaterThanOrEqual(0);
    });

    it('updates topic progress on completion', () => {
      const updated = recordMusicTopicCompletion('instruments', 3);
      expect(updated.topicsProgress.instruments.completed).toBe(true);
      expect(updated.topicsProgress.instruments.stars).toBe(3);
    });

    it('tracks instruments explored, rhythm levels, and sound guesses', () => {
      const p1 = recordInstrumentExplored();
      expect(p1.instrumentsExplored).toBeGreaterThanOrEqual(1);

      const p2 = recordRhythmLevelCompleted(1, 3);
      expect(p2.rhythmLevelsCompleted).toBeGreaterThanOrEqual(1);

      const p3 = recordSoundGuessCorrect();
      expect(p3.soundGuessesCorrect).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Gamification & Badge Rules for Music', () => {
    it('evaluates Music Explorer badge when 3 instruments are explored', () => {
      const ctx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        instrumentsExplored: 3,
      };

      const newBadges = evaluateNewBadges(ctx);
      const hasExplorer = newBadges.some(b => b.id === 'music_explorer');
      expect(hasExplorer).toBe(true);
    });

    it('evaluates Rhythm Star badge when 2 rhythm levels are completed', () => {
      const ctx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        rhythmLevelsCompleted: 2,
      };

      const newBadges = evaluateNewBadges(ctx);
      const hasRhythmStar = newBadges.some(b => b.id === 'rhythm_star');
      expect(hasRhythmStar).toBe(true);
    });

    it('evaluates Music Master badge when 5 music topics are completed', () => {
      const ctx: BadgeEvalContext = {
        completedLessonCount: 0,
        perfectLessonCount: 0,
        missingLessonsCompleted: 0,
        missingPerfectCount: 0,
        missingAllComplete: false,
        countingLessonsCompleted: 0,
        countingPerfectCount: 0,
        currentStreak: 1,
        ownedBadgeIds: new Set(),
        musicTopicsCompleted: 5,
        musicStars: 15,
      };

      const newBadges = evaluateNewBadges(ctx);
      const hasMusicMaster = newBadges.some(b => b.id === 'music_master');
      expect(hasMusicMaster).toBe(true);
    });
  });
});
