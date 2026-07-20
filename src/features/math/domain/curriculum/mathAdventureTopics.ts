import type {ImageSourcePropType} from 'react-native';

import {
  homeShapesIcon,
  mathTopicAddition,
  mathTopicCounting,
  mathTopicMoney,
  mathTopicOrdering,
  mathTopicTime,
} from '@assets';

import type {MathHubActivity, MathHubActivityId, MathLessonId} from './types';

export type MathAdventureTopic = MathHubActivity & {
  readonly image: ImageSourcePropType | null;
  readonly heroColor: string;
  readonly demoProgressPercent: number;
};

/**
 * MathAdventure hub grid — order and labels match product design.
 * Images are optional; missing art falls back to emoji on pastel hero.
 */
export const MATH_ADVENTURE_TOPICS: readonly MathAdventureTopic[] = [
  {
    id: 'numbers',
    icon: '🔢',
    accent: '#4DB7E8',
    heroColor: '#D6EEFF',
    titleTa: 'எண்களை கற்போம்',
    titleEn: 'Learn Numbers',
    lessonId: 'numbers',
    image: null,
    demoProgressPercent: 35,
  },
  {
    id: 'counting',
    icon: '✋',
    accent: '#FF9F1C',
    heroColor: '#F8EBD4',
    titleTa: 'எண்ணுதல்',
    titleEn: 'Counting',
    lessonId: 'counting',
    image: mathTopicCounting,
    demoProgressPercent: 60,
  },
  {
    id: 'missing',
    icon: '🔍',
    accent: '#7BC96F',
    heroColor: '#DFF3D4',
    titleTa: 'காணாமல் போன எண்',
    titleEn: 'Missing Number',
    lessonId: 'missing',
    image: null,
    demoProgressPercent: 20,
  },
  {
    id: 'addition',
    icon: '➕',
    accent: '#4DB7E8',
    heroColor: '#D6EEFF',
    titleTa: 'கூட்டல்',
    titleEn: 'Addition',
    lessonId: 'addition',
    image: mathTopicAddition,
    demoProgressPercent: 45,
  },
  {
    id: 'subtraction',
    icon: '➖',
    accent: '#FF6B4A',
    heroColor: '#F8EBD4',
    titleTa: 'கழித்தல்',
    titleEn: 'Subtraction',
    lessonId: 'subtraction',
    image: null,
    demoProgressPercent: 30,
  },
  {
    id: 'compare',
    icon: '⚖',
    accent: '#C4A05A',
    heroColor: '#F8EBD4',
    titleTa: 'ஒப்பிடுதல்',
    titleEn: 'Comparison',
    lessonId: 'compare',
    image: null,
    demoProgressPercent: 15,
  },
  {
    id: 'odd-even',
    icon: '▤',
    accent: '#4DB7E8',
    heroColor: '#D6EEFF',
    titleTa: 'ஒற்றை / இரட்டை',
    titleEn: 'Odd / Even',
    comingSoon: true,
    image: null,
    demoProgressPercent: 0,
  },
  {
    id: 'ordering',
    icon: '📈',
    accent: '#7BC96F',
    heroColor: '#DFF3D4',
    titleTa: 'வரிசைப்படுத்து',
    titleEn: 'Ordering',
    lessonId: 'sequence',
    image: mathTopicOrdering,
    demoProgressPercent: 25,
  },
  {
    id: 'patterns',
    icon: '▦',
    accent: '#C4A05A',
    heroColor: '#F8EBD4',
    titleTa: 'வடிவ வரிசை',
    titleEn: 'Patterns',
    lessonId: 'patterns',
    image: null,
    demoProgressPercent: 10,
  },
  {
    id: 'shapes',
    icon: '🔷',
    accent: '#4DB7E8',
    heroColor: '#D6EEFF',
    titleTa: 'வடிவங்கள்',
    titleEn: 'Shapes',
    lessonId: 'shapes',
    image: homeShapesIcon,
    demoProgressPercent: 40,
  },
  {
    id: 'measurements',
    icon: '📏',
    accent: '#7BC96F',
    heroColor: '#DFF3D4',
    titleTa: 'அளவீடுகள்',
    titleEn: 'Measurements',
    lessonId: 'big-small',
    image: null,
    demoProgressPercent: 5,
  },
  {
    id: 'time',
    icon: '🕐',
    accent: '#C4A05A',
    heroColor: '#F8EBD4',
    titleTa: 'நேரம்',
    titleEn: 'Time',
    comingSoon: true,
    image: mathTopicTime,
    demoProgressPercent: 0,
  },
  {
    id: 'money',
    icon: '💳',
    accent: '#7BC96F',
    heroColor: '#DFF3D4',
    titleTa: 'பணம்',
    titleEn: 'Money Explorer',
    comingSoon: true,
    image: mathTopicMoney,
    demoProgressPercent: 0,
  },
];

/** Legacy hub list — kept for any callers; prefer MATH_ADVENTURE_TOPICS. */
export const MATH_HUB_ACTIVITIES: readonly MathHubActivity[] =
  MATH_ADVENTURE_TOPICS;

export function isPlayableLessonId(
  id: MathHubActivityId | undefined,
): id is MathLessonId {
  return (
    id === 'numbers' ||
    id === 'counting' ||
    id === 'missing' ||
    id === 'sequence' ||
    id === 'matching' ||
    id === 'compare' ||
    id === 'addition' ||
    id === 'subtraction' ||
    id === 'shapes' ||
    id === 'colors' ||
    id === 'big-small' ||
    id === 'patterns' ||
    id === 'practice'
  );
}
