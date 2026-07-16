const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
] as const;

const TENS = [
  '',
  'ten',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
] as const;

/** Spoken English counting word for children (1–100). */
export function englishCountWord(n: number): string {
  if (n <= 0 || n > 100) {
    return String(n);
  }
  if (n < 20) {
    return ONES[n] ?? String(n);
  }
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) {
    return TENS[tens] ?? String(n);
  }
  return `${TENS[tens]} ${ONES[ones]}`;
}

/** Capitalized for counting aloud: "One...", "Two..." */
export function englishCountAloud(n: number): string {
  const word = englishCountWord(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** "two apples", "one star" */
export function englishObjectCount(count: number, labelEn: string): string {
  const singular = labelEn.endsWith('s') ? labelEn.slice(0, -1) : labelEn;
  if (count === 1) {
    return `one ${singular}`;
  }
  return `${englishCountWord(count)} ${labelEn}`;
}
