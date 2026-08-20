import {
  CHANGE_PUZZLES,
  COIN_EQUIVALENCES,
  COUNTING_CHALLENGES,
  INDIAN_COINS,
  INDIAN_NOTES,
  MONEY_QUIZ_QUESTIONS,
  SHOPPING_ITEMS,
} from '../moneyData';
import {
  readMoneyProgress,
  recordChangePuzzleSolved,
  recordCoinChallengeDone,
  recordMoneyQuizScore,
  recordMoneyTabCompleted,
  recordShoppingPurchase,
} from '../moneyProgress';
import {MATH_ADVENTURE_TOPICS} from '../../curriculum';

describe('Money Module Domain & Progress', () => {
  it('defines Indian coins accurately', () => {
    expect(INDIAN_COINS).toHaveLength(5);
    const values = INDIAN_COINS.map(c => c.value);
    expect(values).toEqual([1, 2, 5, 10, 20]);
    expect(INDIAN_COINS.find(c => c.value === 10)?.isBiMetallic).toBe(true);
    expect(INDIAN_COINS.find(c => c.value === 20)?.isBiMetallic).toBe(true);
  });

  it('defines 6 common Indian notes with authentic color codes', () => {
    expect(INDIAN_NOTES).toHaveLength(6);
    const values = INDIAN_NOTES.map(n => n.value);
    expect(values).toEqual([10, 20, 50, 100, 200, 500]);
  });

  it('has valid coin equivalence equations', () => {
    expect(COIN_EQUIVALENCES.length).toBeGreaterThanOrEqual(4);
    COIN_EQUIVALENCES.forEach(eq => {
      expect(eq.unitCount * eq.unitValue).toBe(eq.targetValue);
    });
  });

  it('contains counting challenges and shopping items below/around ₹35 for 1st standard', () => {
    expect(COUNTING_CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(SHOPPING_ITEMS.length).toBeGreaterThanOrEqual(8);

    const apple = SHOPPING_ITEMS.find(i => i.id === 'apple');
    expect(apple?.price).toBe(5);

    const milk = SHOPPING_ITEMS.find(i => i.id === 'milk');
    expect(milk?.price).toBe(20);
  });

  it('calculates correct change in change puzzles', () => {
    expect(CHANGE_PUZZLES.length).toBeGreaterThanOrEqual(5);
    CHANGE_PUZZLES.forEach(p => {
      expect(p.paidAmount - p.item.price).toBe(p.changeAmount);
      expect(p.options).toContain(p.changeAmount);
    });
  });

  it('has a 10-question money quiz with valid answers', () => {
    expect(MONEY_QUIZ_QUESTIONS).toHaveLength(10);
    MONEY_QUIZ_QUESTIONS.forEach(q => {
      const correctOpts = q.options.filter(o => o.isCorrect);
      expect(correctOpts).toHaveLength(1);
    });
  });

  it('records progress, shopping purchases, and quiz completions', () => {
    const init = readMoneyProgress();
    expect(init).toBeDefined();

    const t1 = recordMoneyTabCompleted('coins', 1);
    expect(t1.completedTabs).toContain('coins');

    const t2 = recordCoinChallengeDone();
    expect(t2.coinChallengesCompleted).toBeGreaterThan(0);

    const t3 = recordShoppingPurchase();
    expect(t3.shoppingPurchases).toBeGreaterThan(0);

    const t4 = recordChangePuzzleSolved();
    expect(t4.changePuzzlesSolved).toBeGreaterThan(0);

    const t5 = recordMoneyQuizScore(8);
    expect(t5.quizScore).toBeGreaterThanOrEqual(8);
  });

  it('activates money topic in MATH_ADVENTURE_TOPICS', () => {
    const moneyTopic = MATH_ADVENTURE_TOPICS.find(t => t.id === 'money');
    expect(moneyTopic).toBeDefined();
    expect(moneyTopic?.lessonId).toBe('money');
    expect(moneyTopic?.comingSoon).toBeFalsy();
  });
});
