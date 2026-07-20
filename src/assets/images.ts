import type {ImageSourcePropType} from 'react-native';

/** Shared fantasy path background (home / games). */
export const screenBackground: ImageSourcePropType = require('./images/png/common/screen_background.png');

/** Splash — cartoon lion riding a pencil (“Loading fun…”). */
export const splashLionLoading: ImageSourcePropType = require('./images/png/splash/lion_loading.png');

/** Welcome grid — Math tile art. */
export const welcomeMathIcon: ImageSourcePropType = require('./images/png/welcome/math.png');

/** Welcome grid — English tile art. */
export const welcomeEnglishIcon: ImageSourcePropType = require('./images/png/welcome/english.png');

/** Welcome grid — Chess tile art. */
export const welcomeChessIcon: ImageSourcePropType = require('./images/png/welcome/chess.png');

/** Welcome grid — Rewards tile art. */
export const welcomeRewardsIcon: ImageSourcePropType = require('./images/png/welcome/rewards.png');

/** Home subject grid — tile art. */
export const homeChessIcon: ImageSourcePropType = require('./images/png/welcome/chess.png');
export const homeMathIcon: ImageSourcePropType = require('./images/png/HomeGrids/math.png');
export const homeEnglishIcon: ImageSourcePropType = require('./images/png/welcome/english.png');
export const homeColorsIcon: ImageSourcePropType = require('./images/png/HomeGrids/colors.png');
export const homeShapesIcon: ImageSourcePropType = require('./images/png/HomeGrids/shapes.png');
export const homeRhymesIcon: ImageSourcePropType = require('./images/png/HomeGrids/rhymes.png');
export const homeStoryIcon: ImageSourcePropType = require('./images/png/HomeGrids/story.png');
export const homePhonicsIcon: ImageSourcePropType = require('./images/png/HomeGrids/phonics.png');

/** Home footer mascot (lion graduation splash art). */
export const homeMascotLion: ImageSourcePropType = require('./images/png/splash/lion_loading.png');

/** Shared chrome — back control (file: common/arrow_back.png). */
export const backArrowIcon: ImageSourcePropType = require('./images/png/common/arrow_back.png');

/** Leo the math coach — poses. */
export const leoWave: ImageSourcePropType = require('./images/png/leo/leo_wave.png');
export const leoThumbsUp: ImageSourcePropType = require('./images/png/leo/leo_thumbs_up.png');
export const leoCelebrate: ImageSourcePropType = require('./images/png/leo/leo_celebrate.png');
export const leoThinking: ImageSourcePropType = require('./images/png/leo/leo_thinking.png');

/** MathAdventure topic tile art. */
export const mathTopicAddition: ImageSourcePropType = require('./images/png/math/topic_addition.png');
export const mathTopicCounting: ImageSourcePropType = require('./images/png/math/topic_counting.png');
export const mathTopicOrdering: ImageSourcePropType = require('./images/png/math/topic_ordering.png');
export const mathTopicTime: ImageSourcePropType = require('./images/png/math/topic_time.png');
export const mathTopicMoney: ImageSourcePropType = require('./images/png/math/topic_money_explorer.png');

/** Chess lesson / piece art. */
export const chessBoard: ImageSourcePropType = require('./images/png/chess/chess_board.jpg');
export const chessKing: ImageSourcePropType = require('./images/png/chess/chess_king.jpg');
export const chessQueen: ImageSourcePropType = require('./images/png/chess/chess_queen.png');
export const chessKnight: ImageSourcePropType = require('./images/png/chess/chess_knight.png');
export const chessBishop: ImageSourcePropType = require('./images/png/chess/chess_bishop.png');
export const chessPawn: ImageSourcePropType = require('./images/png/chess/chess_pawn.png');
export const chessRook: ImageSourcePropType = require('./images/png/chess/chess_rook.png');

/** Child profile avatars (cartoon animals). */
export const avatarLion: ImageSourcePropType = require('./images/png/avatars/lion.png');
export const avatarPanda: ImageSourcePropType = require('./images/png/avatars/panda.png');
export const avatarRabbit: ImageSourcePropType = require('./images/png/avatars/rabbit.png');
export const avatarTiger: ImageSourcePropType = require('./images/png/avatars/tiger.png');
export const avatarMonkey: ImageSourcePropType = require('./images/png/avatars/monkey.png');
export const avatarKoala: ImageSourcePropType = require('./images/png/avatars/koala.png');
export const avatarPenguin: ImageSourcePropType = require('./images/png/avatars/penguin.png');
export const avatarFox: ImageSourcePropType = require('./images/png/avatars/fox.png');
export const avatarElephant: ImageSourcePropType = require('./images/png/avatars/elephant.png');
export const avatarOwl: ImageSourcePropType = require('./images/png/avatars/owl.png');

export type ChildAvatarId =
  | 'lion'
  | 'panda'
  | 'rabbit'
  | 'tiger'
  | 'monkey'
  | 'koala'
  | 'penguin'
  | 'fox'
  | 'elephant'
  | 'owl'
  | 'frog'
  | 'bear';

export type ChildAvatarDef = {
  readonly id: ChildAvatarId;
  readonly label: string;
  readonly emoji: string;
  readonly image: ImageSourcePropType | null;
};

/** At least 12 selectable cartoon avatars for profile setup. */
export const CHILD_AVATARS: readonly ChildAvatarDef[] = [
  {id: 'lion', label: 'Lion', emoji: '🦁', image: avatarLion},
  {id: 'panda', label: 'Panda', emoji: '🐼', image: avatarPanda},
  {id: 'rabbit', label: 'Rabbit', emoji: '🐰', image: avatarRabbit},
  {id: 'tiger', label: 'Tiger', emoji: '🐯', image: avatarTiger},
  {id: 'monkey', label: 'Monkey', emoji: '🐵', image: avatarMonkey},
  {id: 'koala', label: 'Koala', emoji: '🐨', image: avatarKoala},
  {id: 'penguin', label: 'Penguin', emoji: '🐧', image: avatarPenguin},
  {id: 'fox', label: 'Fox', emoji: '🦊', image: avatarFox},
  {id: 'elephant', label: 'Elephant', emoji: '🐘', image: avatarElephant},
  {id: 'owl', label: 'Owl', emoji: '🦉', image: avatarOwl},
  {id: 'frog', label: 'Frog', emoji: '🐸', image: null},
  {id: 'bear', label: 'Bear', emoji: '🐻', image: null},
];

export function getChildAvatar(id: string): ChildAvatarDef {
  return (
    CHILD_AVATARS.find(a => a.id === id) ?? {
      id: 'lion',
      label: 'Lion',
      emoji: '🦁',
      image: avatarLion,
    }
  );
}
