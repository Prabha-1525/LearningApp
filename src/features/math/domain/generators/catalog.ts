import type {ObjectPool} from './types';

export const OBJECT_POOLS: readonly ObjectPool[] = [
  {
    id: 'fruits',
    labelTa: 'பழங்கள்',
    labelEn: 'fruits',
    emojis: ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍑', '🥭'],
  },
  {
    id: 'animals',
    labelTa: 'விலங்குகள்',
    labelEn: 'animals',
    emojis: ['🐱', '🐶', '🐘', '🐰', '🐻', '🐯', '🦁', '🐼'],
  },
  {
    id: 'birds',
    labelTa: 'பறவைகள்',
    labelEn: 'birds',
    emojis: ['🐦', '🐤', '🦜', '🦆', '🐧', '🕊️', '🦉', '🐔'],
  },
  {
    id: 'vehicles',
    labelTa: 'வாகனங்கள்',
    labelEn: 'vehicles',
    emojis: ['🚗', '🚌', '🚲', '🚂', '✈️', '🚁', '🛵', '🚕'],
  },
  {
    id: 'toys',
    labelTa: 'பொம்மைகள்',
    labelEn: 'toys',
    emojis: ['🧸', '🪀', '🎈', '🪁', '🎲', '🎯', '🪅', '🛼'],
  },
  {
    id: 'balloons',
    labelTa: 'பலூன்கள்',
    labelEn: 'balloons',
    emojis: ['🎈', '🎈', '🎈', '🎈'],
  },
  {
    id: 'stars',
    labelTa: 'நட்சத்திரங்கள்',
    labelEn: 'stars',
    emojis: ['⭐', '✨', '🌟', '💫'],
  },
  {
    id: 'flowers',
    labelTa: 'பூக்கள்',
    labelEn: 'flowers',
    emojis: ['🌸', '🌻', '🌷', '🌺', '🌼', '💐', '🪷', '🌹'],
  },
  {
    id: 'fish',
    labelTa: 'மீன்கள்',
    labelEn: 'fish',
    emojis: ['🐟', '🐠', '🐡', '🦈', '🐬', '🦐', '🦞', '🐙'],
  },
  {
    id: 'school',
    labelTa: 'பள்ளி பொருட்கள்',
    labelEn: 'school items',
    emojis: ['📚', '✏️', '📏', '🎒', '🖍️', '📐', '🖊️', '📎'],
  },
  {
    id: 'sports',
    labelTa: 'விளையாட்டு',
    labelEn: 'sports',
    emojis: ['⚽', '🏀', '🏈', '🎾', '🏐', '⚾', '🥎', '🏓'],
  },
  {
    id: 'trees',
    labelTa: 'மரங்கள்',
    labelEn: 'trees',
    emojis: ['🌳', '🌲', '🌴', '🎄', '🌵', '🪴'],
  },
];

export const SHAPES = [
  {id: 'circle', emoji: '⭕', ta: 'வட்டம்', en: 'circle'},
  {id: 'square', emoji: '⬜', ta: 'சதுரம்', en: 'square'},
  {id: 'triangle', emoji: '🔺', ta: 'முக்கோணம்', en: 'triangle'},
  {id: 'star', emoji: '⭐', ta: 'நட்சத்திரம்', en: 'star'},
  {id: 'heart', emoji: '❤️', ta: 'இதயம்', en: 'heart'},
] as const;

export const COLORS = [
  {id: 'red', emoji: '🔴', ta: 'சிவப்பு', en: 'red'},
  {id: 'blue', emoji: '🔵', ta: 'நீலம்', en: 'blue'},
  {id: 'green', emoji: '🟢', ta: 'பச்சை', en: 'green'},
  {id: 'yellow', emoji: '🟡', ta: 'மஞ்சள்', en: 'yellow'},
  {id: 'orange', emoji: '🟠', ta: 'ஆரஞ்சு', en: 'orange'},
  {id: 'purple', emoji: '🟣', ta: 'ஊதா', en: 'purple'},
] as const;

export const PRAISE_EN = [
  'Great job!',
  'Excellent!',
  'Well done!',
  "You're doing great!",
];
export const COMFORT_EN = "That's okay. Let's try again.";
