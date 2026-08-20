import {
  SCIENCE_TOPICS,
  PLANT_GROWTH_STAGES,
  BODY_PARTS,
  ANIMALS_DATA,
  CELESTIAL_BODIES,
  WEATHER_TYPES,
  FLOAT_EXPERIMENT_ITEMS,
  COLOR_MIXES,
  SCIENCE_QUIZ_QUESTIONS,
} from '../domain/catalog/scienceData';
import {isScienceTopicUnlocked} from '../domain/policies/unlockRules';
import {
  readScienceProgress,
  recordTopicCompletion,
  recordExperimentCompletion,
  recordQuizCompletion,
} from '../data/progress/scienceProgress';
import {registerScienceModule} from '../index';
import {ModuleId} from '@core/domain';

describe('Science Module', () => {
  it('has all core topics defined', () => {
    expect(SCIENCE_TOPICS.length).toBeGreaterThanOrEqual(9);
    const ids = SCIENCE_TOPICS.map(t => t.id);
    expect(ids).toContain('plants');
    expect(ids).toContain('human-body');
    expect(ids).toContain('animals');
    expect(ids).toContain('space');
    expect(ids).toContain('weather');
    expect(ids).toContain('water');
    expect(ids).toContain('earth');
    expect(ids).toContain('experiments');
    expect(ids).toContain('quiz');
  });

  it('contains plant growth stages and body parts', () => {
    expect(PLANT_GROWTH_STAGES).toHaveLength(5);
    expect(BODY_PARTS.length).toBeGreaterThanOrEqual(6);
    expect(ANIMALS_DATA.length).toBeGreaterThanOrEqual(10);
    expect(CELESTIAL_BODIES.length).toBeGreaterThanOrEqual(5);
    expect(WEATHER_TYPES.length).toBeGreaterThanOrEqual(5);
    expect(FLOAT_EXPERIMENT_ITEMS.length).toBeGreaterThanOrEqual(6);
    expect(COLOR_MIXES.length).toBeGreaterThanOrEqual(3);
    expect(SCIENCE_QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(6);
  });

  it('unlocks all science topics for young learners', () => {
    const progress = readScienceProgress();
    expect(isScienceTopicUnlocked('plants', progress)).toBe(true);
    expect(isScienceTopicUnlocked('experiments', progress)).toBe(true);
  });

  it('records topic completions and awards stars', () => {
    const updated = recordTopicCompletion('plants', 3);
    expect(updated.topicsProgress.plants.completed).toBe(true);
    expect(updated.topicsProgress.plants.stars).toBe(3);
  });

  it('records experiments and quizzes', () => {
    const expUpdated = recordExperimentCompletion('float-sink');
    expect(expUpdated.completedExperiments).toContain('float-sink');

    const quizUpdated = recordQuizCompletion(5);
    expect(quizUpdated.quizzesCompleted).toBeGreaterThan(0);
  });

  it('registers science module with correct manifest and navigator', () => {
    const manifest = registerScienceModule();
    expect(manifest.id).toBe(ModuleId.Science);
    expect(manifest.isEnabled()).toBe(true);
    expect(manifest.getNavigator()).not.toBeNull();
  });
});
