import {
  parseSquare,
  pieceColor,
  pieceType,
  square,
  type PieceMap,
  type Square,
} from '../board/squares';

export function getLegalMovesForSquare(
  from: Square,
  pieces: PieceMap,
): readonly Square[] {
  const current = pieces[from];
  if (!current) {
    return [];
  }

  const parsed = parseSquare(from);
  if (!parsed) {
    return [];
  }
  const fileLetter = from.charAt(0);
  const rankNum = Number(from.charAt(1));
  const fileIndex = fileLetter.charCodeAt(0) - 'a'.charCodeAt(0);
  const color = pieceColor(current);
  const type = pieceType(current);
  const legal: Square[] = [];

  const isEnemy = (sq: Square): boolean => {
    const target = pieces[sq];
    return target != null && pieceColor(target) !== color;
  };

  const isEmpty = (sq: Square): boolean => {
    return pieces[sq] == null;
  };

  const addSquareIfValid = (fIdx: number, rNum: number): boolean => {
    if (fIdx < 0 || fIdx > 7 || rNum < 1 || rNum > 8) {
      return false;
    }
    const fStr = String.fromCharCode('a'.charCodeAt(0) + fIdx) as
      | 'a'
      | 'b'
      | 'c'
      | 'd'
      | 'e'
      | 'f'
      | 'g'
      | 'h';
    const targetSq = square(fStr, rNum as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8);
    if (isEmpty(targetSq)) {
      legal.push(targetSq);
      return true;
    }
    if (isEnemy(targetSq)) {
      legal.push(targetSq);
    }
    return false;
  };

  const addDirectionalMoves = (directions: Array<[number, number]>) => {
    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      if (!dir) continue;
      const [df, dr] = dir;
      let curF = fileIndex + df;
      let curR = rankNum + dr;
      while (curF >= 0 && curF <= 7 && curR >= 1 && curR <= 8) {
        const keepGoing = addSquareIfValid(curF, curR);
        if (!keepGoing) {
          break;
        }
        curF += df;
        curR += dr;
      }
    }
  };

  switch (type) {
    case 'pawn': {
      const dir = color === 'white' ? 1 : -1;
      const startRank = color === 'white' ? 2 : 7;

      // Single step forward
      const f1Rank = rankNum + dir;
      if (f1Rank >= 1 && f1Rank <= 8) {
        const f1Sq = square(
          fileLetter as 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h',
          f1Rank as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        );
        if (isEmpty(f1Sq)) {
          legal.push(f1Sq);

          // Double step on first move
          if (rankNum === startRank) {
            const f2Rank = rankNum + 2 * dir;
            const f2Sq = square(
              fileLetter as 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h',
              f2Rank as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
            );
            if (isEmpty(f2Sq)) {
              legal.push(f2Sq);
            }
          }
        }
      }

      // Diagonal captures
      const diagFiles = [fileIndex - 1, fileIndex + 1];
      for (let i = 0; i < diagFiles.length; i++) {
        const dfIdx = diagFiles[i];
        if (dfIdx !== undefined && dfIdx >= 0 && dfIdx <= 7) {
          const dfStr = String.fromCharCode('a'.charCodeAt(0) + dfIdx) as
            | 'a'
            | 'b'
            | 'c'
            | 'd'
            | 'e'
            | 'f'
            | 'g'
            | 'h';
          const diagRank = rankNum + dir;
          if (diagRank >= 1 && diagRank <= 8) {
            const diagSq = square(
              dfStr,
              diagRank as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
            );
            if (isEnemy(diagSq)) {
              legal.push(diagSq);
            }
          }
        }
      }
      break;
    }

    case 'rook': {
      addDirectionalMoves([
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]);
      break;
    }

    case 'bishop': {
      addDirectionalMoves([
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      break;
    }

    case 'queen': {
      addDirectionalMoves([
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      break;
    }

    case 'knight': {
      const offsets: Array<[number, number]> = [
        [1, 2],
        [2, 1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [2, -1],
        [-1, -2],
        [-2, -1],
      ];
      for (let i = 0; i < offsets.length; i++) {
        const off = offsets[i];
        if (off) {
          addSquareIfValid(fileIndex + off[0], rankNum + off[1]);
        }
      }
      break;
    }

    case 'king': {
      const offsets: Array<[number, number]> = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
      for (let i = 0; i < offsets.length; i++) {
        const off = offsets[i];
        if (off) {
          addSquareIfValid(fileIndex + off[0], rankNum + off[1]);
        }
      }
      // Castling kingside (g1/g8)
      if (color === 'white' && from === 'e1') {
        if (
          isEmpty('f1') &&
          isEmpty('g1') &&
          pieces.h1 &&
          pieceType(pieces.h1) === 'rook'
        ) {
          legal.push('g1');
        }
      }
      break;
    }
  }

  return legal;
}

export function isMoveLegal(
  from: Square,
  to: Square,
  pieces: PieceMap,
): boolean {
  const legalMoves = getLegalMovesForSquare(from, pieces);
  return legalMoves.includes(to);
}
