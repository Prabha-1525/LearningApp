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
