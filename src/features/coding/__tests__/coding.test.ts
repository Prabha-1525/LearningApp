import {
  CODING_CHALLENGE_QUESTIONS,
  CODING_TOPIC_CARDS,
  COMMAND_METAS,
  CONDITION_SCENARIOS,
  DEBUGGING_PUZZLES,
  LOOP_CHALLENGES,
  ROBOT_MAZE_LEVELS,
  SEQUENCING_STORIES,
} from '../domain/catalog/codingData';
import {
  readCodingProgress,
  recordCodingTopicCompletion,
  recordDebuggingSolved,
  recordRobotMazeSolved,
  recordSequencingSolved,
} from '../data/progress/codingProgress';
import {
  evaluateNewBadges,
  type BadgeEvalContext,
} from '@core/gamification/domain/catalog/badgeRules';

describe('Logic & Coding Module', () => {
  describe('Catalog Data', () => {
    it('should provide 6 command metas with valid labels and icons', () => {
      expect(COMMAND_METAS.length).toBe(6);
      COMMAND_METAS.forEach(cmd => {
        expect(cmd.id).toBeDefined();
        expect(cmd.icon).toBeDefined();
        expect(cmd.labelKey).toContain('coding.commands');
      });
    });

    it('should define 7 coding topic cards', () => {
      expect(CODING_TOPIC_CARDS.length).toBe(7);
      CODING_TOPIC_CARDS.forEach(card => {
        expect(card.id).toBeDefined();
        expect(card.titleKey).toContain('coding.topics');
        expect(card.emoji).toBeDefined();
      });
    });

    it('should define 9 progressive robot maze levels with valid bounds', () => {
      expect(ROBOT_MAZE_LEVELS.length).toBe(9);
      ROBOT_MAZE_LEVELS.forEach(lvl => {
        expect(lvl.levelNumber).toBeGreaterThanOrEqual(1);
        expect(lvl.gridSize.rows).toBeGreaterThanOrEqual(3);
        expect(lvl.gridSize.cols).toBeGreaterThanOrEqual(3);

        // Start & goal must be within grid
        expect(lvl.startPos.row).toBeLessThan(lvl.gridSize.rows);
        expect(lvl.startPos.col).toBeLessThan(lvl.gridSize.cols);
        expect(lvl.goalPos.row).toBeLessThan(lvl.gridSize.rows);
        expect(lvl.goalPos.col).toBeLessThan(lvl.gridSize.cols);

        // Obstacles must be within grid and not on start or goal
        lvl.obstacles.forEach(obs => {
          expect(obs.row).toBeLessThan(lvl.gridSize.rows);
          expect(obs.col).toBeLessThan(lvl.gridSize.cols);
          expect(
            obs.row === lvl.startPos.row && obs.col === lvl.startPos.col,
          ).toBe(false);
          expect(
            obs.row === lvl.goalPos.row && obs.col === lvl.goalPos.col,
          ).toBe(false);
        });
      });
    });

    it('should define 5 sequencing stories with 4 steps each', () => {
      expect(SEQUENCING_STORIES.length).toBe(5);
      SEQUENCING_STORIES.forEach(story => {
        expect(story.steps.length).toBe(4);
        expect(story.correctOrder.length).toBe(4);
      });
    });

    it('should define 5 loop challenges with 1 correct option each', () => {
      expect(LOOP_CHALLENGES.length).toBe(5);
      LOOP_CHALLENGES.forEach(ch => {
        const correctOpts = ch.options.filter(o => o.isCorrect);
        expect(correctOpts.length).toBe(1);
        expect(ch.repeatCount).toBeGreaterThan(0);
      });
    });

    it('should define 6 conditional IF/THEN scenarios with distractors', () => {
      expect(CONDITION_SCENARIOS.length).toBe(6);
      CONDITION_SCENARIOS.forEach(sc => {
        expect(sc.ifConditionKey).toBeDefined();
        expect(sc.correctThenKey).toBeDefined();
        expect(sc.distractorThens.length).toBe(2);
      });
    });

    it('should define 6 debugging puzzles with valid buggy index', () => {
      expect(DEBUGGING_PUZZLES.length).toBe(6);
      DEBUGGING_PUZZLES.forEach(pz => {
        expect(pz.buggyIndex).toBeLessThan(pz.initialCode.length);
        expect(pz.correctCommand).toBeDefined();
      });
    });

    it('should define 10 coding challenge quiz questions', () => {
      expect(CODING_CHALLENGE_QUESTIONS.length).toBe(10);
      CODING_CHALLENGE_QUESTIONS.forEach(q => {
        const correct = q.options.filter(o => o.isCorrect);
        expect(correct.length).toBe(1);
      });
    });
  });

  describe('Progress Persistence', () => {
    it('returns default progress when nothing is stored', () => {
      const p = readCodingProgress();
      expect(p).toBeDefined();
      expect(p.totalStars).toBeGreaterThanOrEqual(0);
    });

    it('updates topic progress on completion', () => {
      const updated = recordCodingTopicCompletion('robot', 3);
      expect(updated.topicsProgress.robot.completed).toBe(true);
      expect(updated.topicsProgress.robot.stars).toBe(3);
    });

    it('tracks robot mazes, debugging, and sequencing counts', () => {
      const p1 = recordRobotMazeSolved(1, 3);
      expect(p1.robotMazesSolved).toBeGreaterThanOrEqual(1);

      const p2 = recordDebuggingSolved();
      expect(p2.debuggingPuzzlesSolved).toBeGreaterThanOrEqual(1);

      const p3 = recordSequencingSolved();
      expect(p3.sequencingPuzzlesSolved).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Gamification & Badge Rules for Coding', () => {
    it('evaluates Little Coder badge when robot maze is solved', () => {
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
        robotMazesSolved: 1,
      };

      const newBadges = evaluateNewBadges(ctx);
      const hasLittleCoder = newBadges.some(b => b.id === 'little_coder');
      expect(hasLittleCoder).toBe(true);
    });

    it('evaluates Bug Finder badge when 2 debugging puzzles are solved', () => {
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
        debuggingPuzzlesSolved: 2,
      };

      const newBadges = evaluateNewBadges(ctx);
      const hasBugFinder = newBadges.some(b => b.id === 'bug_finder');
      expect(hasBugFinder).toBe(true);
    });

    it('evaluates Coding Champion badge when 6 topics and 15 stars are achieved', () => {
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
        codingTopicsCompleted: 6,
        codingStars: 18,
      };

      const newBadges = evaluateNewBadges(ctx);
      const hasChampion = newBadges.some(b => b.id === 'coding_champion');
      expect(hasChampion).toBe(true);
    });
  });
});
