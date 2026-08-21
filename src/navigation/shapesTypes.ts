import type {ShapeSubModuleId} from '../features/shapes/domain/entities/shapeEntities';

export type ShapesStackParamList = {
  ShapesHome: undefined;
  LearnShapes: undefined;
  ShapeRecognition: undefined;
  ShapeMatching: undefined;
  ShapeProperties: undefined;
  ShapeSorting: undefined;
  ShapeCompare: undefined;
  ShapesAroundUs: undefined;
  ShapeCount: undefined;
  ShapePatterns: undefined;
  ShapePuzzles: undefined;
  ShapeChallenge: undefined;
  LessonComplete: {
    subModuleId: ShapeSubModuleId;
    title: string;
    stars: number;
    score: number;
    totalQuestions: number;
    nextSubModuleId?: ShapeSubModuleId;
  };
};
