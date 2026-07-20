import type {ImageSourcePropType} from 'react-native';

import {
  homeChessIcon,
  homeColorsIcon,
  homeEnglishIcon,
  homeMathIcon,
  homePhonicsIcon,
  homeRhymesIcon,
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
  readonly progressPercent: number;
  readonly showNewBadge?: boolean;
};

export const HOME_SUBJECTS: readonly HomeSubjectDef[] = [
  {
    id: 'chess',
    moduleId: ModuleId.Chess,
    titleKey: 'modules.chess.title',
    image: homeChessIcon,
    progressPercent: 25,
    showNewBadge: true,
  },
  {
    id: 'math',
    moduleId: ModuleId.Math,
    titleKey: 'modules.math.title',
    image: homeMathIcon,
    progressPercent: 75,
  },
  {
    id: 'english',
    moduleId: ModuleId.English,
    titleKey: 'modules.english.title',
    image: homeEnglishIcon,
    progressPercent: 50,
  },
  {
    id: 'drawing',
    moduleId: ModuleId.Drawing,
    titleKey: 'modules.drawing.title',
    image: homeColorsIcon,
    progressPercent: 90,
  },
  {
    id: 'shapes',
    moduleId: ModuleId.Shapes,
    titleKey: 'modules.shapes.title',
    image: homeShapesIcon,
    progressPercent: 60,
  },
  {
    id: 'animals',
    moduleId: ModuleId.Animals,
    titleKey: 'modules.animals.title',
    image: null,
    progressPercent: 40,
  },
  {
    id: 'rhymes',
    moduleId: ModuleId.Rhymes,
    titleKey: 'modules.rhymes.title',
    image: homeRhymesIcon,
    progressPercent: 10,
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
];
