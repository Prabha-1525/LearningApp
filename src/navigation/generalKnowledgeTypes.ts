import type {GKCategoryId} from '../features/generalKnowledge/domain/entities/gkEntities';

export type GeneralKnowledgeStackParamList = {
  Home: undefined;
  Category: {
    categoryId: GKCategoryId;
  };
  Lesson: {
    categoryId: GKCategoryId;
    lessonId: string;
  };
  FinalChallenge: undefined;
  CategoryComplete: {
    categoryId: GKCategoryId;
    categoryTitle: string;
  };
};
