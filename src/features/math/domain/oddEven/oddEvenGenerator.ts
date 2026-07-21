import {
  COUNTING_OBJECTS,
  type CountingObjectDef,
} from '@assets/countingObjects';

import type {DifficultyLevel, MathChoice} from '../generators/types';
import {pickOne, randInt, shuffle} from '../generators/random';

export type Parity = 'odd' | 'even';

export type OddEvenQuestion = {
  readonly id: string;
  readonly number: number;
  readonly parity: Parity;
  readonly pairCount: number;
  readonly hasUnpaired: boolean;
  readonly object: CountingObjectDef;
  readonly promptEn: string;
  readonly explanationEn: string;
  readonly choices: readonly MathChoice[];
};

function rangeForLevel(level: DifficultyLevel): {min: number; max: number} {
  switch (level) {
    case 1:
      return {min: 1, max: 10};
    case 2:
      return {min: 5, max: 20};
    case 3:
      return {min: 10, max: 30};
    case 4:
      return {min: 20, max: 40};
    default:
      return {min: 1, max: 10};
  }
}

export function parityOf(number: number): Parity {
  return number % 2 === 0 ? 'even' : 'odd';
}

export function buildOddEvenQuestion(
  number: number,
  object = pickOne(COUNTING_OBJECTS),
): OddEvenQuestion {
  const parity = parityOf(number);
  const hasUnpaired = parity === 'odd';
  const objectLabel = number === 1 ? object.labelEn : object.labelPluralEn;
  return {
    id: `odd-even|${number}|${object.id}`,
    number,
    parity,
    pairCount: Math.floor(number / 2),
    hasUnpaired,
    object,
    promptEn: `Make pairs with the ${objectLabel}. Is ${number} odd or even?`,
    explanationEn:
      parity === 'even'
        ? `${number} is even because every ${object.labelEn} has a partner.`
        : `${number} is odd because one ${object.labelEn} is left without a partner.`,
    choices: shuffle([
      {id: 'even', label: 'Even', correct: parity === 'even'},
      {id: 'odd', label: 'Odd', correct: parity === 'odd'},
    ]),
  };
}

export function generateOddEvenQuestion(
  level: DifficultyLevel,
  recentIds: readonly string[] = [],
): OddEvenQuestion {
  const range = rangeForLevel(level);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const question = buildOddEvenQuestion(
      randInt(range.min, range.max),
      pickOne(COUNTING_OBJECTS),
    );
    if (!recentIds.includes(question.id)) {
      return question;
    }
  }
  return buildOddEvenQuestion(randInt(range.min, range.max));
}
