import {Chess} from 'chess.js';

import type {Square} from '../domain/board/squares';
import {allLegalMoves, applyMove, type EngineMove} from './chessEngine';

const PIECE_TA: Record<string, string> = {
  p: 'காய்',
  n: 'குதிரை',
  b: 'ஆன்',
  r: 'யானை',
  q: 'அரசி',
  k: 'அரசன்',
};

const CENTER: ReadonlySet<string> = new Set(['d4', 'd5', 'e4', 'e5']);

export type CoachMovePlan = {
  readonly move: EngineMove;
  readonly explainTa: string;
  readonly observeTa: string;
};

/**
 * Beginner coach AI — patient, teaching-first, never harsh.
 * Prefers safe development; sometimes leaves gentle lessons for the child.
 */
export function chooseCoachMove(
  game: Chess,
  ply: number,
): CoachMovePlan | null {
  const moves = allLegalMoves(game);
  if (moves.length === 0) {
    return null;
  }

  const scored = moves.map(move => ({
    move,
    score: scoreCoachMove(game, move, ply),
  }));
  scored.sort((a, b) => b.score - a.score);

  // Soft randomness among top 3 so games feel alive but gentle.
  const top = scored.slice(0, Math.min(3, scored.length));
  const pick = top[Math.floor(Math.random() * top.length)]?.move ?? moves[0]!;
  return {
    move: pick,
    explainTa: explainCoachMove(pick),
    observeTa: observePrompt(pick),
  };
}

function scoreCoachMove(game: Chess, move: EngineMove, ply: number): number {
  let score = 0;

  // Avoid mating the child early — teaching, not crushing.
  if (move.isCheckmate && ply < 24) {
    score -= 80;
  } else if (move.isCheckmate) {
    score += 20;
  }

  if (move.isCheck && !move.isCheckmate) {
    score += 8;
  }

  if (move.isCapture) {
    // Capture only if "free-ish" for kids: prefer hanging captures.
    score += 12;
    if (wouldBeRecaptured(game, move)) {
      score -= 25;
    }
  }

  if (CENTER.has(move.to)) {
    score += 6;
  }

  // Develop knights/bishops early.
  if ((move.piece === 'n' || move.piece === 'b') && ply < 16) {
    score += 10;
  }

  // Keep king safe — castling if available (chess.js san O-O).
  if (move.san.startsWith('O')) {
    score += 14;
  }

  // Every ~5 plies, nudge toward leaving something capturable: prefer quiet moves.
  if (ply > 0 && ply % 5 === 0 && !move.isCapture) {
    score += 4;
  }

  // Prefer moving pieces that haven't developed from back rank early.
  if (move.from.endsWith('8') && ply < 12) {
    score += 3;
  }

  return score + Math.random() * 2;
}

function wouldBeRecaptured(game: Chess, move: EngineMove): boolean {
  const clone = new Chess(game.fen());
  const applied = applyMove(clone, move.from, move.to);
  if (!applied) {
    return false;
  }
  const replies = allLegalMoves(clone);
  return replies.some(reply => reply.to === move.to && reply.isCapture);
}

function explainCoachMove(move: EngineMove): string {
  const piece = PIECE_TA[move.piece] ?? 'காய்';
  if (move.isCheckmate) {
    return `நான் ${piece} ஐ ${move.to} க்கு நகர்த்துகிறேன். Checkmate! ஆட்டம் முடிந்தது — நீ நன்றாக விளையாடினாய்.`;
  }
  if (move.isCheck) {
    return `நான் ${piece} ஐ ${move.to} க்கு நகர்த்துகிறேன். உன் அரசனுக்கு Check! மெதுவாக பாதுகா.`;
  }
  if (move.isCapture) {
    return `நான் ${piece} ஐ ${move.to} க்கு நகர்த்தி ஒரு காயை பிடிக்கிறேன். பிடிப்பு எப்படி நடக்கிறது என பார்.`;
  }
  if (CENTER.has(move.to)) {
    return `நான் ${piece} ஐ மையத்திற்கு (${move.to}) அனுப்புகிறேன். மையம் வலிமையானது!`;
  }
  if (move.san.startsWith('O')) {
    return `நான் அரசனை பாதுகாப்பாக நகர்த்துகிறேன். இதை Castling என்போம்.`;
  }
  return `நான் ${piece} ஐ ${move.from} இல் இருந்து ${move.to} க்கு நகர்த்துகிறேன். எளிமையான நகர்வு இது.`;
}

function observePrompt(move: EngineMove): string {
  if (move.isCapture) {
    return 'சாய்வு அல்லது நேர் நகர்வில் பிடிப்பு எப்படி வருகிறது என கவனி.';
  }
  if (CENTER.has(move.to)) {
    return 'மைய சதுரங்களை யார் கட்டுப்படுத்துகிறார்கள் என பார்.';
  }
  if (move.isCheck) {
    return 'அரசன் எப்படி ஆபத்தில் இருக்கிறான் என பார் — பாதுகாக்க ஒரு வழி தேடு.';
  }
  return 'இந்த காய் எந்த திசையில் செல்ல முடியும் என நினைவில் வை.';
}

export function praiseChildMove(move: EngineMove): string {
  if (move.isCheckmate) {
    return 'மிக அருமை! நீ Checkmate கொடுத்துள்ளாய். பெருமைப்படு!';
  }
  if (move.isCheck) {
    return 'மிக அருமை! இப்போது எதிராளிக்கு Check கொடுத்துள்ளாய்.';
  }
  if (move.isCapture) {
    return 'சூப்பர்! நீ ஒரு காயை அழகாக பிடித்தாய்.';
  }
  if (CENTER.has(move.to)) {
    return 'நல்லது! மையத்தை நோக்கி சென்றாய்.';
  }
  return 'சூப்பர்! இந்த நகர்வு நல்லது.';
}

export function comfortWrongMove(): string {
  return 'பரவாயில்லை, இன்னொரு வழியை முயற்சி செய்வோம்.';
}

export function encourageChildTurn(): string {
  return 'இப்போது உன் முறை! ஒரு காயைத் தொட்டு, பிறகு இலக்கைத் தொடு.';
}

export function hintForChild(game: Chess): string {
  const moves = allLegalMoves(game);
  if (moves.length === 0) {
    return 'ஆட்டம் முடிவுக்கு அருகில் இருக்கிறது. நன்றாக விளையாடினாய்!';
  }
  const capture = moves.find(m => m.isCapture);
  if (capture) {
    const piece = PIECE_TA[capture.piece] ?? 'காய்';
    return `ஒரு குறிப்பு: ${piece} ஐ ${capture.from} இல் இருந்து ${capture.to} க்கு நகர்த்தி பாரு.`;
  }
  const center = moves.find(m => CENTER.has(m.to));
  if (center) {
    const piece = PIECE_TA[center.piece] ?? 'காய்';
    return `மையத்தை நோக்கி ${piece} ஐ ${center.to} க்கு அனுப்பலாம்.`;
  }
  const move = moves[0]!;
  const piece = PIECE_TA[move.piece] ?? 'காய்';
  return `${piece} ஐ ${move.from} இல் தொட்டு ${move.to} க்கு அனுப்பு.`;
}

export function teachConceptLine(move: EngineMove): string | null {
  if (move.isCheckmate) {
    return 'Checkmate என்றால் அரசனால் தப்பிக்க முடியாது — ஆட்டம் முடியும்.';
  }
  if (move.isCheck) {
    return 'Check என்றால் அரசன் ஆபத்தில் இருக்கிறான். உடனே பாதுகாக்க வேண்டும்.';
  }
  if (move.isCapture) {
    return 'பிடிப்பு என்றால் எதிரியின் காய் இருந்த சதுரத்திற்கு செல்வது.';
  }
  return null;
}

export type SuggestedMove = {
  readonly from: Square;
  readonly to: Square;
};

/** Suggest a gentle good move for hints (prefer captures / center). */
export function suggestChildMove(game: Chess): SuggestedMove | null {
  const moves = allLegalMoves(game);
  if (moves.length === 0) {
    return null;
  }
  const best =
    moves.find(m => m.isCapture) ??
    moves.find(m => CENTER.has(m.to)) ??
    moves[0]!;
  return {from: best.from, to: best.to};
}
