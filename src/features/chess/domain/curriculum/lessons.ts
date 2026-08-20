import {makePiece} from '../board/squares';
import type {ChessLesson, ChessLessonId} from './types';

const P = makePiece('pawn', 'white');
const p = makePiece('pawn', 'black');
const R = makePiece('rook', 'white');
const r = makePiece('rook', 'black');
const N = makePiece('knight', 'white');
const n = makePiece('knight', 'black');
const B = makePiece('bishop', 'white');
const b = makePiece('bishop', 'black');
const Q = makePiece('queen', 'white');
const q = makePiece('queen', 'black');
const K = makePiece('king', 'white');
const k = makePiece('king', 'black');

export const CHESS_LESSONS: readonly ChessLesson[] = [
  // 1. PAWN
  {
    id: 'pawn',
    order: 1,
    titleTa: 'Pawn (சிப்பாய்)',
    titleEn: 'The Pawn',
    subtitleTa: 'முன்னோக்கிச் செல்லும் வீரர்கள்',
    subtitleEn: 'The foot soldiers',
    pieceSymbol: '♙',
    steps: [
      {
        id: 'pawn-intro',
        kind: 'talk',
        coachTa: 'இது Pawn. சதுரங்கப் பலகையின் முதல் வரிசை வீரர்கள்!',
        coachEn: 'This is the Pawn. The brave foot soldiers of the board!',
        pieces: {e2: P},
        highlights: ['e2'],
        highlightTone: 'teach',
      },
      {
        id: 'pawn-one-step',
        kind: 'talk',
        coachTa: 'Pawn எப்பொழுதும் முன்னோக்கி ஒரு கட்டம் மட்டுமே நகரும்.',
        coachEn: 'A Pawn always moves forward one square at a time.',
        pieces: {e2: P},
        highlights: ['e3'],
        highlightTone: 'move',
        demo: [{from: 'e2', to: 'e3'}],
      },
      {
        id: 'pawn-first-move',
        kind: 'talk',
        coachTa:
          'முதல் நகர்வில் மட்டும் Pawn இரண்டு கட்டங்கள் முன்னால் நகரலாம்!',
        coachEn: 'On its very first move, a Pawn can jump two squares forward!',
        pieces: {e2: P},
        highlights: ['e4'],
        highlightTone: 'move',
        demo: [{from: 'e2', to: 'e4'}],
      },
      {
        id: 'pawn-capture-rule',
        kind: 'talk',
        coachTa:
          'Pawn முன்னால் செல்லும். ஆனால் எதிரி காயை குறுக்காக மட்டுமே அடிக்கும்!',
        coachEn: 'Pawn moves straight, but captures enemy pieces diagonally!',
        pieces: {
          e4: P,
          d5: p,
        },
        highlights: ['d5'],
        highlightTone: 'capture',
        demo: [{from: 'e4', to: 'd5'}],
      },
      {
        id: 'pawn-practice-move-1',
        kind: 'practice',
        coachTa: 'சவாலுக்கு தயாரா? Pawn-ஐ ஒரு கட்டம் முன்னால் நகர்த்து!',
        coachEn: 'Ready for a challenge? Move the Pawn forward one square!',
        pieces: {e2: P},
        practice: {
          mode: 'move',
          from: 'e2',
          targets: ['e3'],
          praiseTa: 'அருமை! சரியான நகர்வு!',
          praiseEn: 'Great job! Correct move!',
          comfortTa: 'மீண்டும் முயற்சி செய்! Pawn முன்னால் e3-க்கு செல்லும்.',
          comfortEn: 'Try again! Pawn moves forward to e3.',
        },
      },
      {
        id: 'pawn-practice-double-move',
        kind: 'practice',
        coachTa: 'இப்போது Pawn-ஐ முதல் நகர்வில் 2 கட்டங்கள் முன்னால் நகர்த்து!',
        coachEn: 'Now move the Pawn two squares forward on its first move!',
        pieces: {e2: P},
        practice: {
          mode: 'move',
          from: 'e2',
          targets: ['e4'],
          praiseTa: 'பிரமாதம்! 2 கட்டங்கள் நகர்த்திவிட்டாய்!',
          praiseEn: 'Awesome! You moved two squares!',
          comfortTa: 'மீண்டும் பார்! e4-க்கு 2 கட்டங்கள் நகர்த்து.',
          comfortEn: 'Look again! Move 2 squares to e4.',
        },
      },
      {
        id: 'pawn-practice-capture',
        kind: 'practice',
        coachTa: 'எதிரி காயை குறுக்காக அடிக்க Pawn-ஐ நகர்த்து!',
        coachEn: 'Move the Pawn diagonally to capture the enemy piece!',
        pieces: {
          e4: P,
          d5: p,
        },
        practice: {
          mode: 'move',
          from: 'e4',
          targets: ['d5'],
          praiseTa: 'அருமையான அடி! நீ Pawn-ஐ நன்றாக கற்றுக்கொண்டாய்!',
          praiseEn: 'Great capture! You mastered the Pawn!',
          comfortTa: 'Pawn குறுக்காக d5-ல் உள்ள காயை அடிக்கும்.',
          comfortEn: 'Pawn captures diagonally on d5.',
        },
      },
    ],
  },

  // 2. ROOK
  {
    id: 'rook',
    order: 2,
    titleTa: 'Rook (யானை)',
    titleEn: 'The Rook',
    subtitleTa: 'நேர்கோட்டில் பாயும் யானை',
    subtitleEn: 'The straight-line castle',
    pieceSymbol: '♖',
    steps: [
      {
        id: 'rook-intro',
        kind: 'talk',
        coachTa: 'இது Rook. கோட்டை போன்ற பலமான யானை!',
        coachEn: 'This is the Rook. Strong like a castle tower!',
        pieces: {d4: R},
        highlights: ['d4'],
        highlightTone: 'teach',
      },
      {
        id: 'rook-movement',
        kind: 'talk',
        coachTa:
          'Rook கிடைமட்டமாகவும் செங்குத்தாகவும் எத்தனை கட்டங்கள் வேண்டுமானாலும் நகரும்.',
        coachEn:
          'Rook moves straight up, down, left, or right as far as it wants!',
        pieces: {d4: R},
        highlights: [
          'd1',
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
        ],
        highlightTone: 'move',
        demo: [{from: 'd4', to: 'd7'}],
      },
      {
        id: 'rook-practice-vertical',
        kind: 'practice',
        coachTa: 'Rook-ஐ செங்குத்தாக மேலே d7-க்கு நகர்த்து!',
        coachEn: 'Move the Rook straight up to d7!',
        pieces: {d4: R},
        practice: {
          mode: 'move',
          from: 'd4',
          targets: ['d7'],
          praiseTa: 'சரியான நகர்வு! Rook நேராக பாயும்!',
          praiseEn: 'Correct! Rook zooms straight up!',
          comfortTa: 'Rook நேராக d7-க்கு செல்லும்.',
          comfortEn: 'Rook moves straight to d7.',
        },
      },
      {
        id: 'rook-practice-capture',
        kind: 'practice',
        coachTa: 'நேர்கோட்டில் உள்ள எதிரி காயை Rook-ஆல் அடி!',
        coachEn: 'Capture the enemy piece in the straight line with your Rook!',
        pieces: {
          d4: R,
          g4: p,
        },
        practice: {
          mode: 'move',
          from: 'd4',
          targets: ['g4'],
          praiseTa: 'அற்புதமான அடி! Rook பாடத்தை முடித்துவிட்டாய்!',
          praiseEn: 'Awesome capture! You completed the Rook lesson!',
          comfortTa: 'Rook வலதுபுறம் நேராக g4-க்கு சென்று அடிக்கும்.',
          comfortEn: 'Rook goes straight right to g4.',
        },
      },
    ],
  },

  // 3. KNIGHT
  {
    id: 'knight',
    order: 3,
    titleTa: 'Knight (குதிரை)',
    titleEn: 'The Knight',
    subtitleTa: 'தாவி பாயும் குதிரை',
    subtitleEn: 'The jumping horse',
    pieceSymbol: '♘',
    steps: [
      {
        id: 'knight-intro',
        kind: 'talk',
        coachTa: 'இது Knight. தாவி குதிக்கும் குதிரை!',
        coachEn: 'This is the Knight. The horse that jumps over pieces!',
        pieces: {e4: N},
        highlights: ['e4'],
        highlightTone: 'teach',
      },
      {
        id: 'knight-l-shape',
        kind: 'talk',
        coachTa:
          'Knight "L" வடிவில் மட்டுமே நகரும். மற்ற காய்களை தாண்டிச் செல்லும் ஒரே காய் இதுவே!',
        coachEn:
          'Knight moves in an "L" shape and is the only piece that can jump over others!',
        pieces: {e4: N},
        highlights: ['d6', 'f6', 'g5', 'g3', 'f2', 'd2', 'c3', 'c5'],
        highlightTone: 'move',
        demo: [{from: 'e4', to: 'f6'}],
      },
      {
        id: 'knight-practice-move',
        kind: 'practice',
        coachTa: 'Knight-ஐ "L" வடிவில் f6-க்கு நகர்த்து!',
        coachEn: 'Move the Knight in an "L" shape to f6!',
        pieces: {e4: N},
        practice: {
          mode: 'move',
          from: 'e4',
          targets: ['f6'],
          praiseTa: 'அருமை! Knight "L" வடிவில் தாவிவிட்டது!',
          praiseEn: 'Great! Knight jumped in an L-shape!',
          comfortTa:
            'Knight 2 கட்டம் மேலே சென்று 1 கட்டம் பக்கவாட்டில் திரும்பும்.',
          comfortEn: 'Knight moves 2 up and 1 to the side.',
        },
      },
      {
        id: 'knight-practice-jump-capture',
        kind: 'practice',
        coachTa: 'காய்களை தாண்டி எதிரி காயை அடிக்க Knight-ஐ நகர்த்து!',
        coachEn: 'Jump over pieces and capture the enemy with Knight!',
        pieces: {
          e4: N,
          e5: P,
          f6: p,
        },
        practice: {
          mode: 'move',
          from: 'e4',
          targets: ['f6'],
          praiseTa: 'சூப்பர்! Knight வெற்றிகரமாக தாவி அடித்துவிட்டது!',
          praiseEn: 'Super! Knight jumped and captured!',
          comfortTa: 'Knight தாவி f6-ல் உள்ள காயை அடிக்கும்.',
          comfortEn: 'Knight jumps to capture on f6.',
        },
      },
    ],
  },

  // 4. BISHOP
  {
    id: 'bishop',
    order: 4,
    titleTa: 'Bishop (மந்திரி)',
    titleEn: 'The Bishop',
    subtitleTa: 'மூலைவிட்டத்தில் பாயும் மந்திரி',
    subtitleEn: 'The diagonal explorer',
    pieceSymbol: '♗',
    steps: [
      {
        id: 'bishop-intro',
        kind: 'talk',
        coachTa: 'இது Bishop. மூலைவிட்ட தந்திரக்காரர்!',
        coachEn: 'This is the Bishop. The diagonal tactician!',
        pieces: {c1: B},
        highlights: ['c1'],
        highlightTone: 'teach',
      },
      {
        id: 'bishop-diagonal',
        kind: 'talk',
        coachTa:
          'Bishop தன் நிற சதுரங்களிலேயே மூலைவிட்டமாக எவ்வளவு தூரம் வேண்டுமானாலும் நகரும்.',
        coachEn:
          'Bishop stays on its color and moves diagonally as far as it wants!',
        pieces: {c1: B},
        highlights: ['b2', 'a3', 'd2', 'e3', 'f4', 'g5', 'h6'],
        highlightTone: 'move',
        demo: [{from: 'c1', to: 'f4'}],
      },
      {
        id: 'bishop-practice-move',
        kind: 'practice',
        coachTa: 'Bishop-ஐ மூலைவிட்டமாக f4-க்கு நகர்த்து!',
        coachEn: 'Move the Bishop diagonally to f4!',
        pieces: {c1: B},
        practice: {
          mode: 'move',
          from: 'c1',
          targets: ['f4'],
          praiseTa: 'சரியான நகர்வு! Bishop மூலைவிட்டமாக பாய்கிறது!',
          praiseEn: 'Correct! Bishop slides diagonally!',
          comfortTa: 'Bishop மூலைவிட்ட பாதையில் f4-க்கு செல்லும்.',
          comfortEn: 'Bishop goes diagonally to f4.',
        },
      },
      {
        id: 'bishop-practice-capture',
        kind: 'practice',
        coachTa: 'மூலைவிட்டத்தில் உள்ள எதிரி காயை Bishop-ஆல் அடி!',
        coachEn: 'Capture the enemy piece on the diagonal with Bishop!',
        pieces: {
          c1: B,
          f4: p,
        },
        practice: {
          mode: 'move',
          from: 'c1',
          targets: ['f4'],
          praiseTa: 'அருமை! Bishop பாடத்தை முடித்துவிட்டாய்!',
          praiseEn: 'Awesome! You mastered the Bishop!',
          comfortTa: 'Bishop f4-ல் உள்ள காயை மூலைவிட்டமாக அடிக்கும்.',
          comfortEn: 'Bishop captures diagonally on f4.',
        },
      },
    ],
  },

  // 5. QUEEN
  {
    id: 'queen',
    order: 5,
    titleTa: 'Queen (ராணி)',
    titleEn: 'The Queen',
    subtitleTa: 'பலகையின் சக்திவாய்ந்த ராணி',
    subtitleEn: 'The powerful queen',
    pieceSymbol: '♕',
    steps: [
      {
        id: 'queen-intro',
        kind: 'talk',
        coachTa: 'இது Queen. சதுரங்கப் பலகையின் மிகவும் சக்திவாய்ந்த காய்!',
        coachEn: 'This is the Queen. The most powerful piece on the board!',
        pieces: {d1: Q},
        highlights: ['d1'],
        highlightTone: 'teach',
      },
      {
        id: 'queen-powers',
        kind: 'talk',
        coachTa:
          'Queen-க்கு Rook மற்றும் Bishop இருவரின் சக்தியும் உண்டு! நேராகவும் மூலைவிட்டமாகவும் நகரும்.',
        coachEn:
          'Queen combines Rook and Bishop powers! Straight and diagonal in all directions.',
        pieces: {d4: Q},
        highlights: [
          'd1',
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
          'a1',
          'b2',
          'c3',
          'e5',
          'f6',
          'g7',
          'h8',
          'a7',
          'b6',
          'c5',
          'e3',
          'f2',
          'g1',
        ],
        highlightTone: 'move',
        demo: [{from: 'd4', to: 'g7'}],
      },
      {
        id: 'queen-practice-move',
        kind: 'practice',
        coachTa: 'Queen-ஐ மூலைவிட்டமாக g7-க்கு நகர்த்து!',
        coachEn: 'Move the Queen diagonally to g7!',
        pieces: {d4: Q},
        practice: {
          mode: 'move',
          from: 'd4',
          targets: ['g7'],
          praiseTa: 'அற்புதமான நகர்வு! Queen சக்திவாய்ந்தது!',
          praiseEn: 'Wonderful move! Queen is super strong!',
          comfortTa: 'Queen மூலைவிட்டமாக g7-க்கு செல்லும்.',
          comfortEn: 'Queen moves diagonally to g7.',
        },
      },
      {
        id: 'queen-practice-capture',
        kind: 'practice',
        coachTa: 'எதிரி காயை அடிக்க Queen-ஐ நகர்த்து!',
        coachEn: 'Move Queen to capture the enemy piece!',
        pieces: {
          d4: Q,
          d7: r,
        },
        practice: {
          mode: 'move',
          from: 'd4',
          targets: ['d7'],
          praiseTa: 'பிரமாதம்! Queen பாடத்தை முடித்துவிட்டாய்!',
          praiseEn: 'Bravo! You mastered the Queen!',
          comfortTa: 'Queen நேராக சென்று d7-ல் உள்ள காயை அடிக்கும்.',
          comfortEn: 'Queen goes straight to capture on d7.',
        },
      },
    ],
  },

  // 6. KING
  {
    id: 'king',
    order: 6,
    titleTa: 'King (ராஜா)',
    titleEn: 'The King',
    subtitleTa: 'பாதுகாக்கப்பட வேண்டிய ராஜா',
    subtitleEn: 'The king to protect',
    pieceSymbol: '♔',
    steps: [
      {
        id: 'king-intro',
        kind: 'talk',
        coachTa:
          'இது King. சதுரங்கத்தின் தலைவன்! இவரைப் பாதுகாப்பதே நமது நோக்கம்.',
        coachEn:
          'This is the King. The leader! Protecting the King is our goal.',
        pieces: {e1: K},
        highlights: ['e1'],
        highlightTone: 'teach',
      },
      {
        id: 'king-move',
        kind: 'talk',
        coachTa:
          'King சுற்றியுள்ள எந்தவொரு கட்டத்திற்கும் ஒரு நகர்வு மட்டுமே நகர முடியும்.',
        coachEn: 'King can move one square in any direction around it.',
        pieces: {e4: K},
        highlights: ['d5', 'e5', 'f5', 'f4', 'f3', 'e3', 'd3', 'd4'],
        highlightTone: 'move',
        demo: [{from: 'e4', to: 'e5'}],
      },
      {
        id: 'king-practice-move',
        kind: 'practice',
        coachTa: 'King-ஐ ஒரு கட்டம் மேலே e5-க்கு நகர்த்து!',
        coachEn: 'Move the King one square up to e5!',
        pieces: {e4: K},
        practice: {
          mode: 'move',
          from: 'e4',
          targets: ['e5'],
          praiseTa: 'சரியான நகர்வு! King பாதுகாப்பாக நகர்ந்தார்!',
          praiseEn: 'Correct move! King moved safely!',
          comfortTa: 'King ஒரு கட்டம் மட்டுமே நகர்ந்து e5-க்கு செல்வார்.',
          comfortEn: 'King moves just one square to e5.',
        },
      },
    ],
  },

  // 7. CAPTURING
  {
    id: 'capture',
    order: 7,
    titleTa: 'Capturing (காய்களை அடித்தல்)',
    titleEn: 'Capturing Pieces',
    subtitleTa: 'எதிரி காய்களை கைப்பற்றுதல்',
    subtitleEn: 'Taking enemy pieces',
    pieceSymbol: '⚔️',
    steps: [
      {
        id: 'capture-talk',
        kind: 'talk',
        coachTa:
          'எதிரி காய் இருக்கும் கட்டத்திற்கு நம் காயை நகர்த்தினால், எதிரி காய் பலகையிலிருந்து வெளியேறும்!',
        coachEn:
          'When we move our piece onto an enemy square, we capture that piece!',
        pieces: {
          c3: N,
          d5: p,
        },
        highlights: ['d5'],
        highlightTone: 'capture',
        demo: [{from: 'c3', to: 'd5'}],
      },
      {
        id: 'capture-practice-1',
        kind: 'practice',
        coachTa: 'Knight-ஆல் எதிரி காயை தாவி அடி!',
        coachEn: 'Capture the enemy piece with your Knight!',
        pieces: {
          c3: N,
          d5: p,
        },
        practice: {
          mode: 'move',
          from: 'c3',
          targets: ['d5'],
          praiseTa: 'அருமை! எதிரி காய் அவுட்!',
          praiseEn: 'Great capture! Enemy piece is out!',
          comfortTa: 'Knight c3-லிருந்து d5-க்கு தாவி அடிக்கும்.',
          comfortEn: 'Knight jumps from c3 to d5.',
        },
      },
    ],
  },

  // 8. CHECK
  {
    id: 'check',
    order: 8,
    titleTa: 'Check (செக்)',
    titleEn: 'Check!',
    subtitleTa: 'ராஜாவுக்கு ஆபத்து!',
    subtitleEn: 'King under attack!',
    pieceSymbol: '⚠️',
    steps: [
      {
        id: 'check-intro',
        kind: 'talk',
        coachTa:
          'Check என்றால் King-ஐ எதிரி காய் தாக்குகிறது என்று அர்த்தம். உடனே தப்பிக்க வேண்டும்!',
        coachEn:
          'Check means the King is under attack! King must get to safety immediately!',
        pieces: {
          e1: K,
          e8: r,
        },
        highlights: ['e1'],
        highlightTone: 'capture',
      },
      {
        id: 'check-practice-escape',
        kind: 'practice',
        coachTa:
          'King ஆபத்தில் இருக்கிறார்! அவரை பாதுகாப்பான f1 கட்டத்திற்கு நகர்த்து!',
        coachEn: 'King is in check! Move him safely to f1!',
        pieces: {
          e1: K,
          e8: r,
        },
        practice: {
          mode: 'move',
          from: 'e1',
          targets: ['f1'],
          praiseTa: 'அருமை! King ஆபத்திலிருந்து தப்பித்துவிட்டார்!',
          praiseEn: 'Awesome! King escaped from check!',
          comfortTa: 'King பக்கவாட்டில் f1-க்கு நகர்ந்து தப்பிக்கலாம்.',
          comfortEn: 'Move King to f1 to escape check.',
        },
      },
    ],
  },

  // 9. CHECKMATE
  {
    id: 'checkmate',
    order: 9,
    titleTa: 'Checkmate (செக்மேட்)',
    titleEn: 'Checkmate!',
    subtitleTa: 'வெற்றி தரும் இறுதி நகர்வு',
    subtitleEn: 'The winning move',
    pieceSymbol: '🏆',
    steps: [
      {
        id: 'checkmate-intro',
        kind: 'talk',
        coachTa:
          'Checkmate என்றால் King ஆபத்தில் இருக்கிறார், தப்பிக்க வழியே இல்லை! விளையாட்டு முடிந்தது, வெற்றி!',
        coachEn:
          'Checkmate means King is trapped and cannot escape! Game over, you win!',
        pieces: {
          e8: k,
          e7: Q,
          f7: K,
        },
        highlights: ['e8'],
        highlightTone: 'capture',
      },
      {
        id: 'checkmate-practice',
        kind: 'practice',
        coachTa: 'Queen-ஐ f7-க்கு நகர்த்தி Checkmate செய்!',
        coachEn: 'Move Queen to f7 to deliver Checkmate!',
        pieces: {
          e8: k,
          d5: Q,
          f6: K,
        },
        practice: {
          mode: 'move',
          from: 'd5',
          targets: ['f7'],
          praiseTa: 'வெற்றி! நீ Checkmate செய்து சதுரங்க நாயகனாகிவிட்டாய்!',
          praiseEn: 'Victory! You delivered Checkmate and won!',
          comfortTa: 'Queen f7-க்கு சென்று Checkmate செய்யும்.',
          comfortEn: 'Queen goes to f7 for Checkmate.',
        },
      },
    ],
  },

  // 10. CASTLING
  {
    id: 'castling',
    order: 10,
    titleTa: 'Castling (கோட்டை கட்டுதல்)',
    titleEn: 'Castling',
    subtitleTa: 'ராஜாவின் சிறப்பு பாதுகாப்பு',
    subtitleEn: 'Special king move',
    pieceSymbol: '🏰',
    steps: [
      {
        id: 'castling-intro',
        kind: 'talk',
        coachTa:
          'Castling முறையில் King 2 கட்டங்கள் நகர்ந்து, Rook அவரை தாண்டிச் சென்று பாதுகாப்பு தரும்!',
        coachEn:
          'Castling lets the King move 2 squares sideways while Rook jumps over to protect him!',
        pieces: {
          e1: K,
          h1: R,
        },
        highlights: ['g1'],
        highlightTone: 'move',
        demo: [
          {from: 'e1', to: 'g1'},
          {from: 'h1', to: 'f1'},
        ],
      },
      {
        id: 'castling-practice',
        kind: 'practice',
        coachTa: 'King-ஐ g1-க்கு நகர்த்தி Castling செய்!',
        coachEn: 'Move King to g1 to Castle!',
        pieces: {
          e1: K,
          h1: R,
        },
        practice: {
          mode: 'move',
          from: 'e1',
          targets: ['g1'],
          praiseTa: 'சூப்பர்! Castling வெற்றியடைந்தது!',
          praiseEn: 'Super! Castling completed successfully!',
          comfortTa: 'King g1-க்கு நகர்ந்தால் Castling நடக்கும்.',
          comfortEn: 'Move King to g1 to castle.',
        },
      },
    ],
  },

  // 11. MINI GAMES
  {
    id: 'mini-game',
    order: 11,
    titleTa: 'Mini Chess Games (சிறு விளையாட்டுகள்)',
    titleEn: 'Mini Chess Games',
    subtitleTa: 'சிறிய போர்க்களம்',
    subtitleEn: 'Mini battles',
    pieceSymbol: '🎮',
    steps: [
      {
        id: 'mini-intro',
        kind: 'talk',
        coachTa:
          'Pawns பந்தயம்! யார் முதலில் மறுகரை d8-க்கு அடைகிறார்களோ அவர்களே வெற்றி பெற்றவர்!',
        coachEn: 'Pawn race! Whoever reaches d8 first wins the mini game!',
        pieces: {
          d2: P,
          e7: p,
        },
        highlights: ['d8'],
        highlightTone: 'teach',
      },
      {
        id: 'mini-practice',
        kind: 'practice',
        coachTa: 'உன் Pawn-ஐ d4-க்கு நகர்த்தி பந்தயத்தைத் தொடங்கு!',
        coachEn: 'Move your Pawn to d4 to start the race!',
        pieces: {
          d2: P,
          e7: p,
        },
        practice: {
          mode: 'move',
          from: 'd2',
          targets: ['d4'],
          praiseTa: 'அருமையான தொடக்கம்!',
          praiseEn: 'Great start to the mini game!',
          comfortTa: 'Pawn-ஐ d4-க்கு 2 கட்டங்கள் நகர்த்து.',
          comfortEn: 'Move Pawn 2 squares to d4.',
        },
      },
    ],
  },

  // 12. FULL CHESS GAME
  {
    id: 'full-game',
    order: 12,
    titleTa: 'Full Chess Game (முழு விளையாட்டு)',
    titleEn: 'Full Chess Game',
    subtitleTa: 'உண்மையான சதுரங்கப் போர்',
    subtitleEn: 'The complete battle',
    pieceSymbol: '♟️',
    steps: [
      {
        id: 'full-intro',
        kind: 'talk',
        coachTa:
          'வாழ்த்துக்கள்! நீ அனைத்து காய்களையும் கற்றுக்கொண்டாய்! இப்போது முழு சதுரங்கப் போட்டியை விளையாடுவோம்!',
        coachEn:
          'Congratulations! You learned all pieces! Now let us play a full chess game!',
        pieces: {
          a1: R,
          b1: N,
          c1: B,
          d1: Q,
          e1: K,
          f1: B,
          g1: N,
          h1: R,
          a2: P,
          b2: P,
          c2: P,
          d2: P,
          e2: P,
          f2: P,
          g2: P,
          h2: P,
          a8: r,
          b8: n,
          c8: b,
          d8: q,
          e8: k,
          f8: b,
          g8: n,
          h8: r,
          a7: p,
          b7: p,
          c7: p,
          d7: p,
          e7: p,
          f7: p,
          g7: p,
          h7: p,
        },
        highlights: ['e2', 'e4'],
        highlightTone: 'move',
      },
      {
        id: 'full-practice-first-move',
        kind: 'practice',
        coachTa: 'முதல் நகர்வாக e2-வில் உள்ள Pawn-ஐ e4-க்கு நகர்த்து!',
        coachEn: 'Make your opening move by moving e2 Pawn to e4!',
        pieces: {
          a1: R,
          b1: N,
          c1: B,
          d1: Q,
          e1: K,
          f1: B,
          g1: N,
          h1: R,
          a2: P,
          b2: P,
          c2: P,
          d2: P,
          e2: P,
          f2: P,
          g2: P,
          h2: P,
          a8: r,
          b8: n,
          c8: b,
          d8: q,
          e8: k,
          f8: b,
          g8: n,
          h8: r,
          a7: p,
          b7: p,
          c7: p,
          d7: p,
          e7: p,
          f7: p,
          g7: p,
          h7: p,
        },
        practice: {
          mode: 'move',
          from: 'e2',
          targets: ['e4'],
          praiseTa:
            'சூப்பர் தொடக்கம்! நீ முழு சதுரங்க பாடத்திட்டத்தையும் வெற்றிகரமாக முடித்துவிட்டாய்!',
          praiseEn: 'Super opening! You completed the entire chess course!',
          comfortTa: 'e2-ல் உள்ள Pawn-ஐ e4-க்கு நகர்த்து.',
          comfortEn: 'Move e2 Pawn to e4.',
        },
      },
    ],
  },
];

export function getLesson(id: string): ChessLesson {
  return CHESS_LESSONS.find(l => l.id === id) ?? CHESS_LESSONS[0]!;
}

export function nextLessonId(id: string): ChessLessonId | null {
  const current = CHESS_LESSONS.find(l => l.id === id);
  if (!current) {
    return null;
  }
  const next = CHESS_LESSONS.find(l => l.order === current.order + 1);
  return next ? next.id : null;
}
