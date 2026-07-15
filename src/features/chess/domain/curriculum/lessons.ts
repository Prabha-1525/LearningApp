import {
  emptyBoard,
  square,
  startingPosition,
  type PieceMap,
  type Square,
} from '../board/squares';
import type {ChessLesson, ChessLessonId} from './types';

function file(
  fileLetter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h',
): Square[] {
  return [1, 2, 3, 4, 5, 6, 7, 8].map(r =>
    square(fileLetter, r as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8),
  );
}

function rank(r: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8): Square[] {
  return (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const).map(f =>
    square(f, r),
  );
}

function lightSquaresSample(): Square[] {
  return ['b1', 'd1', 'f1', 'h1', 'a2', 'c2', 'e2', 'g2'] as Square[];
}

const boardLesson: ChessLesson = {
  id: 'board',
  order: 1,
  titleTa: 'சதுரங்க பலகை',
  titleEn: 'The Chess Board',
  subtitleTa: 'பலகையை அறிவோம்',
  subtitleEn: 'Meet the board',
  steps: [
    {
      id: 'board-hello',
      kind: 'talk',
      coachTa:
        'வணக்கம் சிறிய நண்பா! நான் உன் சதுரங்க ஆசிரியர். இன்று பலகையை பார்ப்போம்.',
      coachEn:
        'Hello little friend! I am your chess teacher. Today we look at the board.',
      pieces: startingPosition(),
    },
    {
      id: 'board-what',
      kind: 'talk',
      coachTa:
        'சதுரங்கம் ஒரு விளையாட்டு. இந்த பலகையில் 64 சதுரங்கள் உள்ளன. பார்த்தாயா?',
      coachEn: 'Chess is a game. This board has 64 squares. Can you see them?',
      pieces: startingPosition(),
      highlights: rank(4).concat(rank(5)),
      highlightTone: 'teach',
    },
    {
      id: 'board-rows',
      kind: 'talk',
      coachTa: 'கிடைமட்ட வரிசைகளை வரிசை என்கிறோம். இதோ ஒரு வரிசை ஒளிரும்!',
      coachEn: 'Sideways lines are called ranks. Watch this rank glow!',
      pieces: emptyBoard(),
      highlights: rank(2),
      highlightTone: 'move',
    },
    {
      id: 'board-cols',
      kind: 'talk',
      coachTa: 'மேலும் கீழும் உள்ள வரிசைகளை நிரல் என்கிறோம். இதோ ஒரு நிரல்!',
      coachEn: 'Up-and-down lines are called files. Here is one file!',
      pieces: emptyBoard(),
      highlights: file('e'),
      highlightTone: 'move',
    },
    {
      id: 'board-diag',
      kind: 'talk',
      coachTa: 'மூலைவிட்டம் இப்படி சாய்வாக செல்லும். பார்த்து கற்றுக்கொள்!',
      coachEn: 'A diagonal goes corner to corner like this. Watch carefully!',
      pieces: emptyBoard(),
      highlights: ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'] as Square[],
      highlightTone: 'capture',
    },
    {
      id: 'board-colors',
      kind: 'talk',
      coachTa:
        'பலகையில் வெள்ளை சதுரங்களும் கருப்பு சதுரங்களும் மாறி மாறி இருக்கும்.',
      coachEn: 'The board has light squares and dark squares, taking turns.',
      pieces: emptyBoard(),
      highlights: lightSquaresSample(),
      highlightTone: 'teach',
    },
    {
      id: 'board-orient',
      kind: 'talk',
      coachTa:
        'விளையாடும்போது, கீழ் வலது மூலையில் வெள்ளை சதுரம் இருக்க வேண்டும். வலது பக்கம் வெள்ளை!',
      coachEn:
        'When we play, the bottom-right corner should be a light square. White on the right!',
      pieces: emptyBoard(),
      highlights: ['h1'] as Square[],
      highlightTone: 'success',
    },
    {
      id: 'board-practice-light',
      kind: 'practice',
      coachTa: 'இப்போது நீ செய்! ஒரு வெள்ளை சதுரத்தை தொடு.',
      coachEn: 'Now you try! Tap a light square.',
      pieces: emptyBoard(),
      practice: {
        mode: 'tap',
        targets: lightSquaresSample(),
        praiseTa: 'அருமை! அது வெள்ளை சதுரம்.',
        praiseEn: 'Awesome! That is a light square.',
        comfortTa: 'பரவாயில்லை. வெள்ளை நிற சதுரத்தை மீண்டும் முயற்சி செய்.',
        comfortEn: 'That is okay. Try a light-colored square again.',
      },
    },
    {
      id: 'board-practice-rank',
      kind: 'practice',
      coachTa: 'நல்லது! இப்போது இந்த கீழ் வரிசையில் உள்ள ஒரு சதுரத்தை தொடு.',
      coachEn: 'Good! Now tap any square on the bottom rank.',
      pieces: emptyBoard(),
      highlights: rank(1),
      highlightTone: 'teach',
      practice: {
        mode: 'tap',
        targets: rank(1),
        praiseTa: 'சூப்பர்! அது ஒரு வரிசை.',
        praiseEn: 'Super! That is on a rank.',
        comfortTa: 'மெதுவாக பார். கீழே ஒளிரும் வரிசையில் தொடு.',
        comfortEn: 'Look slowly. Tap on the glowing bottom rank.',
      },
    },
    {
      id: 'board-done',
      kind: 'talk',
      coachTa: 'அற்புதம்! பலகையை நீ அறிந்துவிட்டாய். அடுத்து காயை பார்ப்போம்.',
      coachEn: 'Wonderful! You know the board. Next we will meet the pawn.',
      pieces: startingPosition(),
    },
  ],
};

const pawnOnly = (): PieceMap => ({e2: 'P'});

const pawnLesson: ChessLesson = {
  id: 'pawn',
  order: 2,
  titleTa: 'காய்',
  titleEn: 'The Pawn',
  subtitleTa: 'சிறிய வீரர்',
  subtitleEn: 'The little soldier',
  steps: [
    {
      id: 'pawn-hello',
      kind: 'talk',
      coachTa: 'இது காய்! சிறிய ஆனால் முக்கியமான வீரர்.',
      coachEn: 'This is a pawn! Small, but very important.',
      pieces: pawnOnly(),
      highlights: ['e2'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'pawn-place',
      kind: 'talk',
      coachTa: 'ஆட்டம் தொடங்கும்போது, காய்கள் இரண்டாம் வரிசையில் நிற்கும்.',
      coachEn: 'At the start, pawns stand on the second rank.',
      pieces: {
        a2: 'P',
        b2: 'P',
        c2: 'P',
        d2: 'P',
        e2: 'P',
        f2: 'P',
        g2: 'P',
        h2: 'P',
      },
      highlights: rank(2),
      highlightTone: 'move',
    },
    {
      id: 'pawn-demo-one',
      kind: 'demo',
      coachTa: 'காய் முன்னால் ஒரு சதுரம் நகரும். பார்!',
      coachEn: 'A pawn moves one square forward. Watch!',
      pieces: pawnOnly(),
      demo: [{from: 'e2', to: 'e3'}],
      highlights: ['e2', 'e3'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'pawn-demo-two',
      kind: 'demo',
      coachTa:
        'முதல் நகர்வில் மட்டும், காய் இரண்டு சதுரம் செல்லலாம். பார்த்தாயா?',
      coachEn: 'Only on the first move, a pawn may go two squares. See?',
      pieces: pawnOnly(),
      demo: [{from: 'e2', to: 'e4'}],
      highlights: ['e2', 'e3', 'e4'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'pawn-after',
      kind: 'talk',
      coachTa:
        'ஒரு முறை நகர்ந்த பிறகு, காய் ஒரே ஒரு சதுரம் தான் முன் செல்லும்.',
      coachEn: 'After it has moved once, a pawn goes only one square forward.',
      pieces: {e4: 'P'},
      highlights: ['e4', 'e5'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'pawn-capture-demo',
      kind: 'demo',
      coachTa:
        'காய் எதிரியை பிடிக்க சாய்வாக ஒரு சதுரம் செல்லும். இதோ ஒரு பிடிப்பு!',
      coachEn:
        'To capture, a pawn goes one square diagonally. Here is a capture!',
      pieces: {e4: 'P', d5: 'p'},
      demo: [{from: 'e4', to: 'd5'}],
      highlights: ['e4', 'd5'] as Square[],
      highlightTone: 'capture',
    },
    {
      id: 'pawn-practice-move',
      kind: 'practice',
      coachTa: 'இப்போது நீ செய்! காயை முன்னால் ஒரு சதுரத்திற்கு நகர்த்து.',
      coachEn: 'Now you try! Move the pawn one square forward.',
      pieces: {e2: 'P'},
      highlights: ['e2', 'e3'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'e2',
        targets: ['e3'],
        praiseTa: 'அருமை! காய் சரியாக நகர்ந்தது.',
        praiseEn: 'Awesome! The pawn moved correctly.',
        comfortTa: 'பரவாயில்லை. காயைத் தொட்டு, பிறகு முன் சதுரத்தைத் தொடு.',
        comfortEn: 'Okay. Tap the pawn, then tap the square in front.',
      },
    },
    {
      id: 'pawn-practice-two',
      kind: 'practice',
      coachTa: 'முதல் நகர்வு! காயை இரண்டு சதுரம் முன் அனுப்பு.',
      coachEn: 'First move! Send the pawn two squares forward.',
      pieces: {e2: 'P'},
      highlights: ['e2', 'e4'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'e2',
        targets: ['e4'],
        praiseTa: 'சூப்பர்! இரண்டு சதுர நகர்வு சரி.',
        praiseEn: 'Super! The two-square move is right.',
        comfortTa: 'காயைத் தொட்டு, இரண்டு சதுரம் முன் உள்ள இடத்தைத் தொடு.',
        comfortEn: 'Tap the pawn, then the square two steps ahead.',
      },
    },
    {
      id: 'pawn-done',
      kind: 'talk',
      coachTa: 'காய் கற்று முடிந்தது! அடுத்து யானை (ரூக்) வருகிறது.',
      coachEn: 'Pawn lesson done! Next comes the rook.',
      pieces: {e4: 'P'},
    },
  ],
};

const rookLesson: ChessLesson = {
  id: 'rook',
  order: 3,
  titleTa: 'யானை',
  titleEn: 'The Rook',
  subtitleTa: 'நேர்கோட்டில் செல்லும்',
  subtitleEn: 'Moves in straight lines',
  steps: [
    {
      id: 'rook-hello',
      kind: 'talk',
      coachTa: 'இது யானை! கோட்டை போன்ற வலிமையான காய்.',
      coachEn: 'This is the rook! Strong like a little castle.',
      pieces: {a1: 'R'},
      highlights: ['a1'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'rook-demo-h',
      kind: 'demo',
      coachTa: 'யானை கிடைமட்டமாக செல்லும். பார்!',
      coachEn: 'The rook moves sideways. Watch!',
      pieces: {a1: 'R'},
      demo: [{from: 'a1', to: 'd1'}],
      highlights: ['a1', 'b1', 'c1', 'd1'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'rook-demo-v',
      kind: 'demo',
      coachTa: 'யானை மேலும் கீழும் செல்லும். இதோ!',
      coachEn: 'The rook also moves up and down. Here!',
      pieces: {d1: 'R'},
      demo: [{from: 'd1', to: 'd5'}],
      highlights: ['d1', 'd2', 'd3', 'd4', 'd5'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'rook-practice',
      kind: 'practice',
      coachTa: 'யானையை மேலே நகர்த்து. நீ செய்!',
      coachEn: 'Move the rook upward. Your turn!',
      pieces: {a1: 'R'},
      highlights: ['a1', 'a4'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'a1',
        targets: ['a4'],
        praiseTa: 'அற்புதம்! யானை நேராக சென்றது.',
        praiseEn: 'Wonderful! The rook went straight.',
        comfortTa: 'யானையைத் தொட்டு, மேலே உள்ள இலக்கைத் தொடு.',
        comfortEn: 'Tap the rook, then tap the target square up the file.',
      },
    },
    {
      id: 'rook-done',
      kind: 'talk',
      coachTa: 'யானை புரிந்தது! அடுத்து குதிரை.',
      coachEn: 'You got the rook! Next is the knight.',
      pieces: {a4: 'R'},
    },
  ],
};

const knightLesson: ChessLesson = {
  id: 'knight',
  order: 4,
  titleTa: 'குதிரை',
  titleEn: 'The Knight',
  subtitleTa: 'எல் வடிவில் குதிக்கும்',
  subtitleEn: 'Jumps in an L shape',
  steps: [
    {
      id: 'knight-hello',
      kind: 'talk',
      coachTa: 'இது குதிரை! விசித்திரமாக நகரும் நண்பன்.',
      coachEn: 'This is the knight! A friend with a special move.',
      pieces: {b1: 'N'},
      highlights: ['b1'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'knight-demo-l',
      kind: 'demo',
      coachTa: 'குதிரை எல் வடிவில் செல்லும் — இரண்டு முன், ஒரு பக்கம். பார்!',
      coachEn: 'The knight moves in an L — two forward, one sideways. Watch!',
      pieces: {b1: 'N'},
      demo: [{from: 'b1', to: 'c3'}],
      highlights: ['b1', 'b2', 'b3', 'c3'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'knight-jump',
      kind: 'demo',
      coachTa: 'குதிரை மற்ற காய்களின் மேல் குதிக்கலாம்! அற்புதம் இல்லையா?',
      coachEn: 'The knight can jump over other pieces! Is that not cool?',
      pieces: {b1: 'N', b2: 'P', c2: 'P'},
      demo: [{from: 'b1', to: 'a3'}],
      highlights: ['b1', 'a3'] as Square[],
      highlightTone: 'capture',
    },
    {
      id: 'knight-practice',
      kind: 'practice',
      coachTa: 'குதிரையை எல் வடிவில் நகர்த்து!',
      coachEn: 'Move the knight in an L shape!',
      pieces: {b1: 'N'},
      highlights: ['b1', 'c3'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'b1',
        targets: ['c3', 'a3', 'd2'],
        praiseTa: 'சூப்பர்! எல் நகர்வு சரி.',
        praiseEn: 'Super! That L-move is right.',
        comfortTa: 'இரண்டு முன் ஒரு பக்கம் என யோசி. மீண்டும் முயற்சி செய்.',
        comfortEn: 'Think two then one. Try again.',
      },
    },
    {
      id: 'knight-done',
      kind: 'talk',
      coachTa: 'குதிரை கற்று முடிந்தது! அடுத்து ஆனே (பிஷப்).',
      coachEn: 'Knight done! Next is the bishop.',
      pieces: {c3: 'N'},
    },
  ],
};

const bishopLesson: ChessLesson = {
  id: 'bishop',
  order: 5,
  titleTa: 'ஆன்',
  titleEn: 'The Bishop',
  subtitleTa: 'மூலைவிட்டத்தில் செல்லும்',
  subtitleEn: 'Moves on diagonals',
  steps: [
    {
      id: 'bishop-hello',
      kind: 'talk',
      coachTa: 'இது ஆன்! சாய்வு வழியில் செல்லும் காய்.',
      coachEn: 'This is the bishop! It loves diagonal paths.',
      pieces: {c1: 'B'},
      highlights: ['c1'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'bishop-demo',
      kind: 'demo',
      coachTa: 'ஆன் மூலைவிட்டத்தில் நீளமாக செல்லும். பார்!',
      coachEn: 'The bishop slides along a diagonal. Watch!',
      pieces: {c1: 'B'},
      demo: [{from: 'c1', to: 'f4'}],
      highlights: ['c1', 'd2', 'e3', 'f4'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'bishop-practice',
      kind: 'practice',
      coachTa: 'ஆனை சாய்வாக நகர்த்து!',
      coachEn: 'Move the bishop diagonally!',
      pieces: {c1: 'B'},
      highlights: ['c1', 'a3'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'c1',
        targets: ['a3', 'b2', 'd2', 'e3', 'f4', 'g5', 'h6'],
        praiseTa: 'அருமை! சாய்வு நகர்வு சரி.',
        praiseEn: 'Awesome! That diagonal move is right.',
        comfortTa: 'சாய்வான பாதையில் தொடு. நான் காட்டியதை நினை.',
        comfortEn: 'Tap along the diagonal. Remember the demo.',
      },
    },
    {
      id: 'bishop-done',
      kind: 'talk',
      coachTa: 'ஆன் புரிந்தது! அடுத்து அரசி.',
      coachEn: 'Bishop understood! Next is the queen.',
      pieces: {f4: 'B'},
    },
  ],
};

const queenLesson: ChessLesson = {
  id: 'queen',
  order: 6,
  titleTa: 'அரசி',
  titleEn: 'The Queen',
  subtitleTa: 'யானை + ஆன்',
  subtitleEn: 'Rook plus bishop power',
  steps: [
    {
      id: 'queen-hello',
      kind: 'talk',
      coachTa: 'இது அரசி! மிகவும் வலிமையான காய்.',
      coachEn: 'This is the queen! The most powerful piece.',
      pieces: {d1: 'Q'},
      highlights: ['d1'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'queen-demo-r',
      kind: 'demo',
      coachTa: 'அரசி யானை போல நேராகவும் செல்லும்...',
      coachEn: 'The queen can move like a rook, straight...',
      pieces: {d1: 'Q'},
      demo: [{from: 'd1', to: 'd5'}],
      highlights: ['d1', 'd2', 'd3', 'd4', 'd5'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'queen-demo-b',
      kind: 'demo',
      coachTa: '...ஆன் போல சாய்வாகவும் செல்லும்!',
      coachEn: '...and like a bishop, on diagonals!',
      pieces: {d5: 'Q'},
      demo: [{from: 'd5', to: 'g8'}],
      highlights: ['d5', 'e6', 'f7', 'g8'] as Square[],
      highlightTone: 'capture',
    },
    {
      id: 'queen-practice',
      kind: 'practice',
      coachTa: 'அரசியை நேராகவோ சாய்வாகவோ நகர்த்து!',
      coachEn: 'Move the queen straight or diagonally!',
      pieces: {d1: 'Q'},
      highlights: ['d1', 'd4', 'h5', 'a4'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'd1',
        targets: ['d4', 'a4', 'h5', 'd2', 'c2', 'e2'],
        praiseTa: 'ராணியை போல அருமை!',
        praiseEn: 'Royal and wonderful!',
        comfortTa: 'நேர் அல்லது சாய்வு பாதையை தேர். மீண்டும் முயற்சி.',
        comfortEn: 'Pick a straight or diagonal path. Try again.',
      },
    },
    {
      id: 'queen-done',
      kind: 'talk',
      coachTa: 'அரசி கற்று முடிந்தது! கடைசியாக அரசன்.',
      coachEn: 'Queen done! Finally, the king.',
      pieces: {d4: 'Q'},
    },
  ],
};

const kingLesson: ChessLesson = {
  id: 'king',
  order: 7,
  titleTa: 'அரசன்',
  titleEn: 'The King',
  subtitleTa: 'காக்க வேண்டிய முக்கிய நண்பன்',
  subtitleEn: 'The friend we must protect',
  steps: [
    {
      id: 'king-hello',
      kind: 'talk',
      coachTa: 'இது அரசன்! மிக முக்கியமான நண்பன். அவரை நாம் காக்க வேண்டும்.',
      coachEn: 'This is the king! Our most important friend. We protect him.',
      pieces: {e1: 'K'},
      highlights: ['e1'] as Square[],
      highlightTone: 'teach',
    },
    {
      id: 'king-demo',
      kind: 'demo',
      coachTa: 'அரசன் எல்லா திசையிலும் ஒரே ஒரு சதுரம் நகரும். பார்!',
      coachEn: 'The king moves one square in any direction. Watch!',
      pieces: {e1: 'K'},
      demo: [{from: 'e1', to: 'e2'}],
      highlights: ['e1', 'd1', 'd2', 'e2', 'f2', 'f1'] as Square[],
      highlightTone: 'move',
    },
    {
      id: 'king-protect',
      kind: 'talk',
      coachTa:
        'அரசனை இழந்தால் ஆட்டம் முடியும். அதனால் மெதுவாக, பாதுகாப்பாக நகர்த்துவோம்.',
      coachEn:
        'If we lose the king, the game ends. So we move him slowly and safely.',
      pieces: {e2: 'K'},
      highlights: ['e2'] as Square[],
      highlightTone: 'success',
    },
    {
      id: 'king-practice',
      kind: 'practice',
      coachTa: 'அரசனை ஒரு சதுரம் நகர்த்து!',
      coachEn: 'Move the king one square!',
      pieces: {e1: 'K'},
      highlights: ['e1', 'e2', 'd1', 'd2', 'f1', 'f2'] as Square[],
      highlightTone: 'move',
      practice: {
        mode: 'move',
        from: 'e1',
        targets: ['e2', 'd1', 'd2', 'f1', 'f2'],
        praiseTa: 'அருமை! அரசன் பாதுகாப்பாக நகர்ந்தார்.',
        praiseEn: 'Awesome! The king moved safely.',
        comfortTa: 'ஒரே சதுரம் மட்டும். அருகில் உள்ள சதுரத்தைத் தொடு.',
        comfortEn: 'Only one square. Tap a neighbor square.',
      },
    },
    {
      id: 'king-done',
      kind: 'talk',
      coachTa:
        'அற்புதம்! எல்லா முக்கிய காய்களையும் நீ அறிந்துவிட்டாய். பெருமைப்படு!',
      coachEn: 'Wonderful! You know all the main pieces. Be proud!',
      pieces: {e2: 'K'},
    },
  ],
};

export const CHESS_LESSONS: readonly ChessLesson[] = [
  boardLesson,
  pawnLesson,
  rookLesson,
  knightLesson,
  bishopLesson,
  queenLesson,
  kingLesson,
];

export function getLesson(id: ChessLessonId): ChessLesson {
  const lesson = CHESS_LESSONS.find(item => item.id === id);
  if (!lesson) {
    throw new Error(`Unknown chess lesson: ${id}`);
  }
  return lesson;
}

export function nextLessonId(id: ChessLessonId): ChessLessonId | null {
  const index = CHESS_LESSONS.findIndex(item => item.id === id);
  const next = CHESS_LESSONS[index + 1];
  return next?.id ?? null;
}
