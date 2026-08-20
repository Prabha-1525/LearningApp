import type {ImageSourcePropType} from 'react-native';

import {
  homeChessIcon,
  homeColorsIcon,
  homeEnglishIcon,
  homeMathIcon,
  homePhonicsIcon,
  homeShapesIcon,
  homeStoryIcon,
} from '@assets';
import {ModuleId} from '@core/domain';

/**
 * Visual catalog for the Home subject grid (order matches product design).
 * Progress percents are display placeholders until module progress is wired.
 */
export type HomeSubjectDef = {
  readonly id: string;
  readonly moduleId: ModuleId;
  readonly titleKey: string;
  readonly image: ImageSourcePropType | null;
  readonly emoji?: string;
  readonly backgroundColor?: string;
  readonly progressPercent: number;
  readonly showNewBadge?: boolean;
};

export const HOME_SUBJECTS: readonly HomeSubjectDef[] = [
  {
    id: 'chess',
    moduleId: ModuleId.Chess,
    titleKey: 'modules.chess.title',
    image: homeChessIcon,
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'math',
    moduleId: ModuleId.Math,
    titleKey: 'modules.math.title',
    image: homeMathIcon,
    progressPercent: 0,
  },
  {
    id: 'worldExplorer',
    moduleId: ModuleId.WorldExplorer,
    titleKey: 'modules.worldExplorer.title',
    image: null,
    emoji: '🌍',
    backgroundColor: '#E0F2FE',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'brainGames',
    moduleId: ModuleId.BrainGames,
    titleKey: 'modules.brainGames.title',
    image: null,
    emoji: '🧠',
    backgroundColor: '#EEF2FF',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'science',
    moduleId: ModuleId.Science,
    titleKey: 'modules.science.title',
    image: null,
    emoji: '🔬',
    backgroundColor: '#ECFDF5',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'time',
    moduleId: ModuleId.Time,
    titleKey: 'modules.time.title',
    image: null,
    emoji: '🕐',
    backgroundColor: '#F0F9FF',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'coding',
    moduleId: ModuleId.Coding,
    titleKey: 'modules.coding.title',
    image: null,
    emoji: '🧩',
    backgroundColor: '#EEF2FF',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'english',
    moduleId: ModuleId.English,
    titleKey: 'modules.english.title',
    image: homeEnglishIcon,
    progressPercent: 0,
  },
  {
    id: 'drawing',
    moduleId: ModuleId.Drawing,
    titleKey: 'modules.drawing.title',
    image: homeColorsIcon,
    progressPercent: 0,
  },
  {
    id: 'shapes',
    moduleId: ModuleId.Shapes,
    titleKey: 'modules.shapes.title',
    image: homeShapesIcon,
    progressPercent: 0,
  },
  {
    id: 'animals',
    moduleId: ModuleId.Animals,
    titleKey: 'modules.animals.title',
    image: null,
    emoji: '🦁',
    backgroundColor: '#FEF3C7',
    progressPercent: 0,
  },
  {
    id: 'rhymes',
    moduleId: ModuleId.Rhymes,
    titleKey: 'modules.rhymes.title',
    image: null,
    emoji: '🎵',
    backgroundColor: '#FDF4FF',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'story',
    moduleId: ModuleId.Story,
    titleKey: 'modules.story.title',
    image: homeStoryIcon,
    progressPercent: 0,
  },
  {
    id: 'phonics',
    moduleId: ModuleId.Phonics,
    titleKey: 'modules.phonics.title',
    image: homePhonicsIcon,
    progressPercent: 0,
  },
  {
    id: 'lifeSkills',
    moduleId: ModuleId.LifeSkills,
    titleKey: 'modules.lifeSkills.title',
    image: null,
    emoji: '😊',
    backgroundColor: '#ECFDF5',
    progressPercent: 0,
    showNewBadge: true,
  },
  {
    id: 'generalKnowledge',
    moduleId: ModuleId.GeneralKnowledge,
    titleKey: 'modules.generalKnowledge.title',
    image: null,
    emoji: '🗣️',
    backgroundColor: '#FEF3C7',
    progressPercent: 0,
    showNewBadge: true,
  },
];
