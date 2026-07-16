import type {DifficultyLevel} from './types';
import type {MathLessonId} from '../curriculum/types';

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

export function pickOne<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)]!;
}

export function countRange(level: DifficultyLevel): {min: number; max: number} {
  switch (level) {
    case 1:
      return {min: 1, max: 10};
    case 2:
      return {min: 1, max: 20};
    case 3:
      return {min: 1, max: 50};
    case 4:
      return {min: 1, max: 100};
    default:
      return {min: 1, max: 10};
  }
}

export function missingRange(level: DifficultyLevel): {
  min: number;
  max: number;
} {
  switch (level) {
    case 1:
      return {min: 1, max: 10};
    case 2:
      return {min: 1, max: 20};
    case 3:
      return {min: 1, max: 50};
    case 4:
      return {min: 1, max: 99};
    default:
      return {min: 1, max: 10};
  }
}

export function additionOperands(level: DifficultyLevel): {
  aMin: number;
  aMax: number;
  bMin: number;
  bMax: number;
} {
  switch (level) {
    case 1:
      return {aMin: 1, aMax: 9, bMin: 1, bMax: 9};
    case 2:
      return {aMin: 10, aMax: 99, bMin: 1, bMax: 9};
    case 3:
      return {aMin: 10, aMax: 99, bMin: 10, bMax: 99};
    case 4:
      return {aMin: 20, aMax: 99, bMin: 20, bMax: 99};
    default:
      return {aMin: 1, aMax: 9, bMin: 1, bMax: 9};
  }
}

export function scatterOffsets(count: number) {
  return Array.from({length: count}, () => ({
    x: randInt(-36, 36),
    y: randInt(-24, 24),
  }));
}

export function makeChoices(
  correct: string,
  distractors: readonly string[],
  total = 4,
): {id: string; label: string; correct?: boolean}[] {
  const labels = new Set<string>([correct]);
  for (const d of distractors) {
    if (labels.size >= total) {
      break;
    }
    if (d !== correct) {
      labels.add(d);
    }
  }

  const answerNum = Number(correct);
  let offset = 1;
  while (labels.size < total && Number.isFinite(answerNum)) {
    const candidates = [
      String(answerNum + offset),
      String(Math.max(1, answerNum - offset)),
    ];
    for (const c of candidates) {
      if (labels.size >= total) {
        break;
      }
      if (c !== correct) {
        labels.add(c);
      }
    }
    offset += 1;
    if (offset > 30) {
      break;
    }
  }

  while (labels.size < total) {
    const filler = String(randInt(1, 100));
    if (filler !== correct) {
      labels.add(filler);
    }
  }

  return shuffle([...labels].slice(0, total)).map((label, index) => ({
    id: `c${index}`,
    label,
    correct: label === correct,
  }));
}

export function validateChoices(
  choices: readonly {label: string; correct?: boolean}[],
  correct: string,
  expectedCount = 4,
): boolean {
  if (choices.length !== expectedCount) {
    return false;
  }
  const labels = new Set(choices.map(c => c.label));
  if (labels.size !== expectedCount) {
    return false;
  }
  const correctOnes = choices.filter(c => c.correct);
  if (correctOnes.length !== 1) {
    return false;
  }
  return choices.some(c => c.label === correct);
}

export function nextDifficultyLevel(
  attempted: number,
  correct: number,
  current: DifficultyLevel,
): DifficultyLevel {
  if (attempted < 8) {
    return current;
  }
  const accuracy = correct / attempted;
  if (accuracy >= 0.82 && current < 4) {
    return (current + 1) as DifficultyLevel;
  }
  if (accuracy < 0.45 && current > 1) {
    return (current - 1) as DifficultyLevel;
  }
  return current;
}

export function defaultDifficultyForLesson(
  lessonId: MathLessonId,
): DifficultyLevel {
  if (lessonId === 'practice') {
    return 2;
  }
  return 1;
}
