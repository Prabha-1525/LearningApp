import {
  TIME_TOPICS,
  CLOCK_LESSONS,
  CLOCK_CHALLENGES,
  DAY_PARTS,
  DAYS_OF_WEEK,
  MONTHS_OF_YEAR,
  SEASONS_DATA,
  TIME_QUIZ_QUESTIONS,
} from '../domain/catalog/timeData';
import {
  readTimeProgress,
  recordTimeTopicCompletion,
  recordClockChallengeCompletion,
  recordCalendarExplored,
  recordQuizCompletion,
} from '../data/progress/timeProgress';
import {registerTimeModule} from '../index';
import {ModuleId} from '@core/domain';

describe('Time & Calendar Module', () => {
  it('has all core topics defined', () => {
    expect(TIME_TOPICS.length).toBeGreaterThanOrEqual(7);
    const ids = TIME_TOPICS.map(t => t.id);
    expect(ids).toContain('clock');
    expect(ids).toContain('day-parts');
    expect(ids).toContain('days');
    expect(ids).toContain('months');
    expect(ids).toContain('seasons');
    expect(ids).toContain('calendar');
    expect(ids).toContain('quiz');
  });

  it('contains clock lessons and challenges with key 1st standard milestones', () => {
    expect(CLOCK_LESSONS.length).toBeGreaterThanOrEqual(5);
    expect(CLOCK_CHALLENGES.length).toBeGreaterThanOrEqual(5);

    const lessonHoursMinutes = CLOCK_LESSONS.map(l => `${l.hour}:${l.minute}`);
    expect(lessonHoursMinutes).toContain('3:0');
    expect(lessonHoursMinutes).toContain('3:30');
    expect(lessonHoursMinutes).toContain('4:0');
    expect(lessonHoursMinutes).toContain('5:30');
  });

  it('contains 4 parts of the day with routines', () => {
    expect(DAY_PARTS).toHaveLength(4);
    const ids = DAY_PARTS.map(p => p.id);
    expect(ids).toEqual(['morning', 'afternoon', 'evening', 'night']);
    DAY_PARTS.forEach(part => {
      expect(part.activities.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('contains 7 days of the week in order', () => {
    expect(DAYS_OF_WEEK).toHaveLength(7);
    const ids = DAYS_OF_WEEK.map(d => d.id);
    expect(ids).toEqual([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]);
  });

  it('contains 12 months of the year with correct day counts', () => {
    expect(MONTHS_OF_YEAR).toHaveLength(12);
    expect(MONTHS_OF_YEAR[0].id).toBe('january');
    expect(MONTHS_OF_YEAR[1].id).toBe('february');
    expect(MONTHS_OF_YEAR[1].daysCount).toBe(28);
    expect(MONTHS_OF_YEAR[3].daysCount).toBe(30); // April
    expect(MONTHS_OF_YEAR[5].daysCount).toBe(30); // June
    expect(MONTHS_OF_YEAR[8].daysCount).toBe(30); // September
    expect(MONTHS_OF_YEAR[10].daysCount).toBe(30); // November
    expect(MONTHS_OF_YEAR[11].id).toBe('december');
    expect(MONTHS_OF_YEAR[11].daysCount).toBe(31);
  });

  it('contains 4 seasons including monsoon/rainy with visual details', () => {
    expect(SEASONS_DATA).toHaveLength(4);
    const seasonIds = SEASONS_DATA.map(s => s.id);
    expect(seasonIds).toContain('summer');
    expect(seasonIds).toContain('rainy');
    expect(seasonIds).toContain('autumn');
    expect(seasonIds).toContain('winter');
  });

  it('contains comprehensive quiz questions', () => {
    expect(TIME_QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(10);
    const types = new Set(TIME_QUIZ_QUESTIONS.map(q => q.type));
    expect(types.has('clock_identify')).toBe(true);
    expect(types.has('day_sequence')).toBe(true);
    expect(types.has('yesterday_tomorrow')).toBe(true);
    expect(types.has('month_sequence')).toBe(true);
    expect(types.has('calendar_read')).toBe(true);
  });

  it('reads and writes time progress and awards stars', () => {
    const initial = readTimeProgress();
    expect(initial).toBeDefined();

    const updated = recordTimeTopicCompletion('clock', 3);
    expect(updated.topicsProgress.clock.completed).toBe(true);
    expect(updated.topicsProgress.clock.stars).toBe(3);

    const challengeProgress = recordClockChallengeCompletion('challenge_1');
    expect(challengeProgress.clockChallengesCompleted).toContain('challenge_1');

    const calProgress = recordCalendarExplored();
    expect(calProgress.calendarExplored).toBe(true);

    const quizProgress = recordQuizCompletion(5);
    expect(quizProgress.quizzesCompleted).toBeGreaterThan(0);
  });

  it('registers time module with correct manifest and navigator', () => {
    const manifest = registerTimeModule();
    expect(manifest.id).toBe(ModuleId.Time);
    expect(manifest.isEnabled()).toBe(true);
    expect(manifest.getNavigator()).not.toBeNull();
  });
});
