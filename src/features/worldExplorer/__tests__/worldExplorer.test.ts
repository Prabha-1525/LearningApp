import {codeToFlagEmoji, normalizeCountry} from '../data/api/countryApi';
import {
  generateGeographyQuizRound,
  generateQuizQuestion,
} from '../data/quiz/geographyQuizEngine';
import {isActivityUnlocked} from '../domain/policies/unlockRules';
import {CURATED_COUNTRIES} from '../domain/catalog/curatedCountries';
import {LANDMARKS} from '../domain/catalog/landmarks';
import {CONTINENTS} from '../domain/catalog/continents';

describe('World Explorer Module', () => {
  describe('Country API & Normalizer', () => {
    it('converts country code IN to flag emoji 🇮🇳', () => {
      expect(codeToFlagEmoji('IN')).toBe('🇮🇳');
      expect(codeToFlagEmoji('FR')).toBe('🇫🇷');
      expect(codeToFlagEmoji('JP')).toBe('🇯🇵');
    });

    it('normalizes raw REST Country object correctly', () => {
      const raw = {
        cca2: 'IN',
        name: {common: 'India', official: 'Republic of India'},
        capital: ['New Delhi'],
        continents: ['Asia'],
        languages: {hin: 'Hindi', eng: 'English'},
        currencies: {INR: {name: 'Indian Rupee', symbol: '₹'}},
        population: 1400000000,
      };

      const normalized = normalizeCountry(raw);
      expect(normalized).not.toBeNull();
      expect(normalized?.code).toBe('IN');
      expect(normalized?.name).toBe('India');
      expect(normalized?.flag).toBe('🇮🇳');
      expect(normalized?.capital).toBe('New Delhi');
      expect(normalized?.continent).toBe('Asia');
      expect(normalized?.languages).toContain('Hindi');
    });
  });

  describe('Catalogs', () => {
    it('contains at least 20 curated fallback countries', () => {
      expect(CURATED_COUNTRIES.length).toBeGreaterThanOrEqual(20);
    });

    it('contains 7 earth continents', () => {
      expect(CONTINENTS.length).toBe(7);
    });

    it('contains famous world landmarks', () => {
      expect(LANDMARKS.length).toBeGreaterThanOrEqual(10);
      const taj = LANDMARKS.find(l => l.id === 'taj-mahal');
      expect(taj?.countryName).toBe('India');
    });
  });

  describe('Unlock Rules Policy', () => {
    it('unlocks countries initially', () => {
      const emptyState = {
        exploredCountryCodes: [],
        learnedFlagCodes: [],
        exploredContinents: [],
        learnedCapitals: [],
        exploredLandmarkIds: [],
        quizCompletedCount: 0,
      };
      expect(isActivityUnlocked('countries', emptyState)).toBe(true);
      expect(isActivityUnlocked('flags', emptyState)).toBe(false);
    });

    it('unlocks flags after 3 countries explored', () => {
      const progress = {
        exploredCountryCodes: ['IN', 'JP', 'FR'],
        learnedFlagCodes: [],
        exploredContinents: [],
        learnedCapitals: [],
        exploredLandmarkIds: [],
        quizCompletedCount: 0,
      };
      expect(isActivityUnlocked('flags', progress)).toBe(true);
    });
  });

  describe('Geography Quiz Engine', () => {
    it('generates a flag question with 3 options for beginner level', () => {
      const target = CURATED_COUNTRIES[0]!;
      const question = generateQuizQuestion(
        'flag',
        target,
        CURATED_COUNTRIES,
        'beginner',
      );
      expect(question).not.toBeNull();
      expect(question?.type).toBe('flag');
      expect(question?.options.length).toBe(3);
      expect(question?.options.some(o => o.isCorrect)).toBe(true);
    });

    it('generates a full geography quiz round of 5 questions', () => {
      const round = generateGeographyQuizRound(
        CURATED_COUNTRIES,
        5,
        'beginner',
      );
      expect(round.length).toBe(5);
    });
  });
});
