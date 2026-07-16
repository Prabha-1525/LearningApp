import type {DifficultyLevel} from '../generators/types';

/** Learn Numbers level ranges per product spec. */
export function numbersRange(level: DifficultyLevel): {
  min: number;
  max: number;
} {
  switch (level) {
    case 1:
      return {min: 1, max: 10};
    case 2:
      return {min: 11, max: 20};
    case 3:
      return {min: 21, max: 50};
    case 4:
      return {min: 51, max: 100};
    default:
      return {min: 1, max: 10};
  }
}

export const NUMBERS_LEVEL_LABELS: Record<
  DifficultyLevel,
  {ta: string; en: string}
> = {
  1: {ta: 'நிலை 1: 1–10', en: 'Level 1: 1–10'},
  2: {ta: 'நிலை 2: 11–20', en: 'Level 2: 11–20'},
  3: {ta: 'நிலை 3: 21–50', en: 'Level 3: 21–50'},
  4: {ta: 'நிலை 4: 51–100', en: 'Level 4: 51–100'},
};
