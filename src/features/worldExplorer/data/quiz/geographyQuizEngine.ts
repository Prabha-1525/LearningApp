import type {Country} from '../../domain/entities/Country';
import type {
  DifficultyLevel,
  QuizOption,
  QuizQuestion,
  QuizType,
} from '../../domain/entities/QuizQuestion';
import {LANDMARKS} from '../../domain/catalog/landmarks';

function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }
  return arr;
}

export function generateQuizQuestion(
  targetType: QuizType,
  targetCountry: Country,
  allCountries: readonly Country[],
  difficulty: DifficultyLevel = 'beginner',
): QuizQuestion | null {
  const optionCount = difficulty === 'beginner' ? 3 : 4;

  // Filter distractor choices
  const otherCountries = allCountries.filter(
    c => c.code !== targetCountry.code,
  );
  if (otherCountries.length < optionCount - 1) {
    return null;
  }

  const randomDistractors = shuffleArray(otherCountries).slice(
    0,
    optionCount - 1,
  );

  switch (targetType) {
    case 'flag': {
      const correctOpt: QuizOption = {
        id: targetCountry.code,
        label: targetCountry.name,
        isCorrect: true,
        flagEmoji: targetCountry.flag,
      };

      const distractorOpts: QuizOption[] = randomDistractors.map(d => ({
        id: d.code,
        label: d.name,
        isCorrect: false,
        flagEmoji: d.flag,
      }));

      const options = shuffleArray([correctOpt, ...distractorOpts]);

      return {
        id: `quiz-flag-${targetCountry.code}-${Date.now()}`,
        type: 'flag',
        difficulty,
        promptText: 'Which country has this flag?',
        promptSubtext: 'Tap the correct country name below!',
        flagEmoji: targetCountry.flag,
        countryCode: targetCountry.code,
        options,
        explanationText: `${targetCountry.flag} is the flag of ${targetCountry.name}!`,
      };
    }

    case 'capital': {
      if (!targetCountry.capital) {
        return null;
      }
      const correctOpt: QuizOption = {
        id: targetCountry.code,
        label: targetCountry.capital,
        isCorrect: true,
      };

      const distractorCapitals = randomDistractors
        .map(d => d.capital)
        .filter((c): c is string => Boolean(c));

      if (distractorCapitals.length < optionCount - 1) {
        return null;
      }

      const distractorOpts: QuizOption[] = distractorCapitals.map((cap, i) => ({
        id: `distractor-cap-${i}`,
        label: cap,
        isCorrect: false,
      }));

      const options = shuffleArray([correctOpt, ...distractorOpts]);

      return {
        id: `quiz-capital-${targetCountry.code}-${Date.now()}`,
        type: 'capital',
        difficulty,
        promptText: `What is the capital of ${targetCountry.name}?`,
        flagEmoji: targetCountry.flag,
        countryCode: targetCountry.code,
        options,
        explanationText: `The capital of ${targetCountry.name} is ${targetCountry.capital}!`,
      };
    }

    case 'continent': {
      const continentsList = [
        'Asia',
        'Europe',
        'Africa',
        'North America',
        'South America',
        'Oceania',
      ];
      const correctContinent = targetCountry.continent;
      const otherContinents = continentsList.filter(
        c => c.toLowerCase() !== correctContinent.toLowerCase(),
      );

      const chosenDistractorContinents = shuffleArray(otherContinents).slice(
        0,
        optionCount - 1,
      );

      const correctOpt: QuizOption = {
        id: correctContinent,
        label: correctContinent,
        isCorrect: true,
      };

      const distractorOpts: QuizOption[] = chosenDistractorContinents.map(
        cont => ({
          id: cont,
          label: cont,
          isCorrect: false,
        }),
      );

      const options = shuffleArray([correctOpt, ...distractorOpts]);

      return {
        id: `quiz-continent-${targetCountry.code}-${Date.now()}`,
        type: 'continent',
        difficulty,
        promptText: `Which continent is ${targetCountry.name} in?`,
        flagEmoji: targetCountry.flag,
        countryCode: targetCountry.code,
        options,
        explanationText: `${targetCountry.name} is located in ${correctContinent}!`,
      };
    }

    case 'landmark': {
      const landmark = LANDMARKS.find(
        l => l.countryCode === targetCountry.code,
      );
      if (!landmark) {
        return null;
      }

      const correctOpt: QuizOption = {
        id: targetCountry.code,
        label: targetCountry.name,
        isCorrect: true,
        flagEmoji: targetCountry.flag,
      };

      const distractorOpts: QuizOption[] = randomDistractors.map(d => ({
        id: d.code,
        label: d.name,
        isCorrect: false,
        flagEmoji: d.flag,
      }));

      const options = shuffleArray([correctOpt, ...distractorOpts]);

      return {
        id: `quiz-landmark-${landmark.id}-${Date.now()}`,
        type: 'landmark',
        difficulty,
        promptText: `Where is the ${landmark.name}?`,
        promptSubtext: landmark.description,
        imageUrl: landmark.image,
        countryCode: targetCountry.code,
        options,
        explanationText: `${landmark.name} is located in ${targetCountry.name}!`,
      };
    }

    case 'fact': {
      if (!targetCountry.funFact) {
        return null;
      }
      const correctOpt: QuizOption = {
        id: targetCountry.code,
        label: targetCountry.name,
        isCorrect: true,
        flagEmoji: targetCountry.flag,
      };

      const distractorOpts: QuizOption[] = randomDistractors.map(d => ({
        id: d.code,
        label: d.name,
        isCorrect: false,
        flagEmoji: d.flag,
      }));

      const options = shuffleArray([correctOpt, ...distractorOpts]);

      return {
        id: `quiz-fact-${targetCountry.code}-${Date.now()}`,
        type: 'fact',
        difficulty,
        promptText: targetCountry.funFact,
        promptSubtext: 'Which country is this fact about?',
        countryCode: targetCountry.code,
        options,
        explanationText: `This fun fact is about ${targetCountry.name}!`,
      };
    }
  }
}

export function generateGeographyQuizRound(
  countries: readonly Country[],
  questionCount = 5,
  difficulty: DifficultyLevel = 'beginner',
): readonly QuizQuestion[] {
  if (countries.length < 4) {
    return [];
  }

  const types: QuizType[] = [
    'flag',
    'capital',
    'continent',
    'landmark',
    'fact',
  ];
  const shuffledCountries = shuffleArray(countries);
  const questions: QuizQuestion[] = [];

  let idx = 0;
  let attempts = 0;
  while (questions.length < questionCount && attempts < 40) {
    attempts++;
    const country = shuffledCountries[idx % shuffledCountries.length]!;
    const quizType = types[questions.length % types.length]!;
    const q = generateQuizQuestion(quizType, country, countries, difficulty);
    if (q) {
      questions.push(q);
    }
    idx++;
  }

  return questions;
}
