import type {MathLessonId} from '../curriculum/types';
import {numbersRange} from '../numbers/numbersRange';
import {COLORS, OBJECT_POOLS, SHAPES} from './catalog';
import {
  additionOperands,
  countRange,
  makeChoices,
  missingRange,
  pickOne,
  randInt,
  scatterOffsets,
  shuffle,
  validateChoices,
} from './random';
import type {DifficultyLevel, MathQuestion} from './types';

function buildObjects(count: number, poolEmoji: string) {
  const emojis = Array.from({length: count}, () => poolEmoji);
  return {emojis, scatterOffsets: scatterOffsets(count)};
}

function distractorNumbers(
  answer: number,
  min: number,
  max: number,
  count = 3,
) {
  const set = new Set<number>();
  while (set.size < count) {
    const n = randInt(min, max);
    if (n !== answer) {
      set.add(n);
    }
  }
  return [...set].map(String);
}

export function generateQuestion(
  lessonId: MathLessonId,
  level: DifficultyLevel,
  recentIds: readonly string[] = [],
): MathQuestion {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const question = buildQuestion(lessonId, level);
    if (!recentIds.includes(question.id)) {
      return question;
    }
  }
  return buildQuestion(lessonId, level);
}

function buildQuestion(
  lessonId: MathLessonId,
  level: DifficultyLevel,
): MathQuestion {
  switch (lessonId) {
    case 'numbers':
      return buildNumbers(level);
    case 'counting':
      return buildCounting(level);
    case 'missing':
      return buildMissing(level);
    case 'sequence':
      return buildSequence(level);
    case 'matching':
      return buildMatching(level);
    case 'compare':
      return buildCompare(level);
    case 'addition':
      return buildAddition(level);
    case 'subtraction':
      return buildSubtraction(level);
    case 'shapes':
      return buildShapes();
    case 'colors':
      return buildColors();
    case 'big-small':
      return buildBigSmall();
    case 'patterns':
      return buildPatterns(level);
    case 'practice':
      return buildPractice(level);
    default:
      return buildCounting(level);
  }
}

function buildNumbers(level: DifficultyLevel): MathQuestion {
  const range = numbersRange(level);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const n = randInt(range.min, range.max);
    const pool = pickOne(OBJECT_POOLS);
    const emoji = pickOne(pool.emojis);
    const display = Math.min(n, 15);
    const {emojis, scatterOffsets: offsets} = buildObjects(display, emoji);
    const choices = makeChoices(
      String(n),
      distractorNumbers(n, range.min, range.max, 6),
      4,
    );
    if (!validateChoices(choices, String(n), 4)) {
      continue;
    }
    return {
      id: `numbers|${n}|${pool.id}|${emoji}`,
      lessonId: 'numbers',
      coachTa: `This is number ${n}. Tap number ${n}!`,
      coachEn: `This is number ${n}. Tap number ${n}!`,
      explainTa: `Look! The answer is ${n}.`,
      explainEn: `Look! The answer is ${n}.`,
      visual: {type: 'number', number: n, emojis},
      practice: {
        mode: 'choice',
        choices,
        emojis,
        scatterOffsets: offsets,
      },
    };
  }
  return buildNumbers(level === 1 ? 2 : 1);
}

function buildCounting(level: DifficultyLevel): MathQuestion {
  const range = countRange(level);
  const count = randInt(range.min, range.max);
  const pool = pickOne(OBJECT_POOLS);
  const emoji = pickOne(pool.emojis);
  const tapCount = count <= 20;
  const displayCount = tapCount ? count : Math.min(count, 18);
  const {emojis, scatterOffsets: offsets} = buildObjects(displayCount, emoji);
  return {
    id: `counting|${count}|${pool.id}|${emoji}|${level}`,
    lessonId: 'counting',
    coachTa: tapCount
      ? `Count ${count} ${pool.labelEn}! Tap each one.`
      : `There are ${count} ${pool.labelEn}. How many? Pick the number!`,
    coachEn: tapCount
      ? `Count ${count} ${pool.labelEn}! Tap each one.`
      : `There are ${count} ${pool.labelEn}. How many? Pick the number!`,
    explainTa: `Nice try! There are ${count} ${pool.labelEn} here.`,
    explainEn: `Nice try! There are ${count} ${pool.labelEn} here.`,
    visual: {type: 'objects', emojis, number: count},
    practice: tapCount
      ? {
          mode: 'count',
          emojis,
          scatterOffsets: offsets,
          targetCount: count,
        }
      : {
          mode: 'choice',
          choices: makeChoices(
            String(count),
            distractorNumbers(count, Math.max(1, count - 5), count + 5),
          ),
          emojis,
          scatterOffsets: offsets,
        },
  };
}

function buildMissing(level: DifficultyLevel): MathQuestion {
  const range = missingRange(level);
  const len = randInt(3, 4);
  const start = randInt(range.min, Math.max(range.min, range.max - len));
  const missingIndex = randInt(0, len - 1);
  const seq = Array.from({length: len}, (_, i) => start + i);
  const answer = seq[missingIndex]!;
  const display: (number | null)[] = seq.map((n, i) =>
    i === missingIndex ? null : n,
  );
  const gapLabel = display.map(n => (n == null ? '_' : String(n))).join(' ');
  return {
    id: `missing|${gapLabel}|${answer}`,
    lessonId: 'missing',
    coachTa: `${gapLabel}. What number is missing?`,
    coachEn: `${gapLabel}. What number is missing?`,
    explainTa: `See! The missing number is ${answer}.`,
    explainEn: `See! The missing number is ${answer}.`,
    visual: {type: 'sequence', sequence: display},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        String(answer),
        distractorNumbers(answer, range.min, range.max + len),
      ),
    },
  };
}

function buildSequence(level: DifficultyLevel): MathQuestion {
  const range = countRange(level);
  const size = randInt(3, 4);
  const nums = shuffle(
    Array.from({length: size}, () => randInt(range.min, range.max)),
  );
  const askSmallest = Math.random() > 0.5;
  const answer = askSmallest ? Math.min(...nums) : Math.max(...nums);
  return {
    id: `sequence|${nums.join(',')}|${askSmallest ? 'min' : 'max'}`,
    lessonId: 'sequence',
    coachTa: askSmallest
      ? `Which is smallest in ${nums.join(', ')}?`
      : `Which is biggest in ${nums.join(', ')}?`,
    coachEn: askSmallest
      ? `Which is smallest in ${nums.join(', ')}?`
      : `Which is biggest in ${nums.join(', ')}?`,
    explainTa: `The answer is ${answer}.`,
    explainEn: `The answer is ${answer}.`,
    visual: {type: 'sequence', sequence: nums},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        String(answer),
        nums.filter(n => n !== answer).map(String),
      ),
    },
  };
}

function buildMatching(level: DifficultyLevel): MathQuestion {
  const range = countRange(level);
  const count = randInt(range.min, Math.min(range.max, 15));
  const pool = pickOne(OBJECT_POOLS);
  const emoji = pickOne(pool.emojis);
  const {emojis, scatterOffsets: offsets} = buildObjects(count, emoji);
  return {
    id: `matching|${count}|${pool.id}`,
    lessonId: 'matching',
    coachTa: `There are ${count} ${pool.labelEn}. Pick the right number!`,
    coachEn: `There are ${count} ${pool.labelEn}. Pick the right number!`,
    explainTa: `See! ${count} objects = number ${count}.`,
    explainEn: `See! ${count} objects = number ${count}.`,
    visual: {type: 'objects', number: count, emojis},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        String(count),
        distractorNumbers(count, Math.max(1, count - 3), count + 3),
      ),
      emojis,
      scatterOffsets: offsets,
    },
  };
}

function buildCompare(level: DifficultyLevel): MathQuestion {
  const range = countRange(level);
  let left = randInt(range.min, range.max);
  let right = randInt(range.min, range.max);
  while (left === right) {
    right = randInt(range.min, range.max);
  }
  const bigger = left > right ? left : right;
  const answer = String(bigger);
  return {
    id: `compare|${left}|${right}`,
    lessonId: 'compare',
    coachTa: `${left} and ${right} — which is bigger?`,
    coachEn: `${left} and ${right} — which is bigger?`,
    explainTa: `${bigger} is bigger.`,
    explainEn: `${bigger} is bigger.`,
    visual: {type: 'compare', compareLeft: left, compareRight: right},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        answer,
        [String(left), String(right)].filter(v => v !== answer),
      ),
    },
  };
}

function buildAddition(level: DifficultyLevel): MathQuestion {
  const {aMin, aMax, bMin, bMax} = additionOperands(level);
  const a = randInt(aMin, aMax);
  const b = randInt(bMin, bMax);
  const sum = a + b;
  const pool = pickOne(OBJECT_POOLS);
  const emoji = pickOne(pool.emojis);
  const showCount = Math.min(sum, 16);
  const {emojis, scatterOffsets: offsets} = buildObjects(showCount, emoji);
  return {
    id: `addition|${a}|${b}|${level}`,
    lessonId: 'addition',
    coachTa: `${a} + ${b} = ? Add them!`,
    coachEn: `${a} + ${b} = ? Add them!`,
    explainTa: `${a} + ${b} = ${sum}.`,
    explainEn: `${a} + ${b} = ${sum}.`,
    visual: {type: 'equation', equation: `${a} + ${b} = ?`, emojis},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        String(sum),
        distractorNumbers(sum, Math.max(0, sum - 5), sum + 5),
      ),
      emojis,
      scatterOffsets: offsets,
    },
  };
}

function buildSubtraction(level: DifficultyLevel): MathQuestion {
  const range = countRange(level);
  const total = randInt(range.min + 2, Math.min(range.max, 30));
  const take = randInt(1, total - 1);
  const remain = total - take;
  const pool = pickOne(OBJECT_POOLS);
  const emoji = pickOne(pool.emojis);
  const {emojis, scatterOffsets: offsets} = buildObjects(total, emoji);
  return {
    id: `subtraction|${total}|${take}`,
    lessonId: 'subtraction',
    coachTa: `${total} items. Take ${take} away. How many left?`,
    coachEn: `${total} items. Take ${take} away. How many left?`,
    explainTa: `${total} - ${take} = ${remain}.`,
    explainEn: `${total} - ${take} = ${remain}.`,
    visual: {type: 'equation', equation: `${total} - ${take} = ?`, emojis},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        String(remain),
        distractorNumbers(remain, Math.max(0, remain - 4), remain + 4),
      ),
      emojis,
      scatterOffsets: offsets,
    },
  };
}

function buildShapes(): MathQuestion {
  const shape = pickOne(SHAPES);
  const others = shuffle(SHAPES.filter(s => s.id !== shape.id)).slice(0, 2);
  return {
    id: `shapes|${shape.id}`,
    lessonId: 'shapes',
    coachTa: `Which is a ${shape.en}?`,
    coachEn: `Which is a ${shape.en}?`,
    explainTa: `This is a ${shape.en}.`,
    explainEn: `This is a ${shape.en}.`,
    visual: {type: 'shapes', shape: shape.emoji},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        shape.emoji,
        others.map(o => o.emoji),
      ),
    },
  };
}

function buildColors(): MathQuestion {
  const color = pickOne(COLORS);
  const others = shuffle(COLORS.filter(c => c.id !== color.id)).slice(0, 2);
  return {
    id: `colors|${color.id}`,
    lessonId: 'colors',
    coachTa: `Which is ${color.en}?`,
    coachEn: `Which is ${color.en}?`,
    explainTa: `This is ${color.en}.`,
    explainEn: `This is ${color.en}.`,
    visual: {type: 'colors', color: color.emoji},
    practice: {
      mode: 'choice',
      choices: makeChoices(
        color.emoji,
        others.map(o => o.emoji),
      ),
    },
  };
}

function buildBigSmall(): MathQuestion {
  const pairs = [
    {big: '🐘', small: '🐁', ta: 'யானை', en: 'elephant'},
    {big: '🌳', small: '🌸', ta: 'மரம்', en: 'tree'},
    {big: '🏀', small: '⚽', ta: 'பந்து', en: 'ball'},
    {big: '🚌', small: '🚲', ta: 'வாகனம்', en: 'vehicle'},
  ];
  const pair = pickOne(pairs);
  const askBig = Math.random() > 0.5;
  return {
    id: `big-small|${pair.big}|${pair.small}|${askBig}`,
    lessonId: 'big-small',
    coachTa: askBig ? 'Which is bigger?' : 'Which is smaller?',
    coachEn: askBig ? 'Which is bigger?' : 'Which is smaller?',
    explainTa: askBig ? `${pair.en} is bigger.` : `Smaller is ${pair.small}.`,
    explainEn: askBig ? `${pair.en} is bigger.` : `Smaller is ${pair.small}.`,
    visual: {type: 'objects', emojis: [pair.big, pair.small]},
    practice: {
      mode: 'choice',
      choices: makeChoices(askBig ? pair.big : pair.small, [
        askBig ? pair.small : pair.big,
      ]),
    },
  };
}

function buildPatterns(level: DifficultyLevel): MathQuestion {
  const motifs =
    level >= 3
      ? [
          ['⭐', '⭕', '🔺'],
          ['🔴', '🔵', '🟢'],
          ['🍎', '🍌', '🍊'],
        ]
      : [
          ['⭐', '⭕'],
          ['🔴', '🔵'],
          ['🍎', '🍌'],
        ];
  const motif = pickOne(motifs);
  const repeats = level >= 2 ? 3 : 2;
  const pattern = [...Array.from({length: repeats}, () => motif).flat(), '?'];
  const next = motif[pattern.length % motif.length]!;
  const wrong = shuffle(motif.filter(m => m !== next)).slice(0, 2);
  return {
    id: `patterns|${pattern.join('')}|${next}`,
    lessonId: 'patterns',
    coachTa: 'What comes next? Complete the pattern!',
    coachEn: 'What comes next? Complete the pattern!',
    explainTa: `Next is ${next}.`,
    explainEn: `Next is ${next}.`,
    visual: {type: 'pattern', pattern},
    practice: {
      mode: 'choice',
      choices: makeChoices(next, wrong),
    },
  };
}

function buildPractice(level: DifficultyLevel): MathQuestion {
  const pool: MathLessonId[] = [
    'counting',
    'missing',
    'addition',
    'subtraction',
    'compare',
    'matching',
  ];
  const pick = pickOne(pool);
  return buildQuestion(pick, level);
}

/** Verify generator can produce many unique counting questions. */
export function uniqueQuestionCount(
  lessonId: MathLessonId,
  level: DifficultyLevel,
  samples: number,
): number {
  const ids = new Set<string>();
  for (let i = 0; i < samples; i += 1) {
    ids.add(generateQuestion(lessonId, level, []).id);
  }
  return ids.size;
}
