import type {DrawingSubModuleId} from '../features/drawing/domain/entities/drawingEntities';

export type DrawingStackParamList = {
  Home: undefined;
  Colors: undefined;
  ColorMatch: undefined;
  ColorMix: undefined;
  Coloring: undefined;
  Trace: undefined;
  Shapes: undefined;
  ObjectDrawing: undefined;
  GuidedDrawing: undefined;
  FreeDrawing: undefined;
  CreativeChallenge: undefined;
  MyGallery: undefined;
  LessonComplete: {
    subModuleId: DrawingSubModuleId;
    title: string;
    stars: number;
    score: number;
    totalQuestions: number;
    nextSubModuleId?: DrawingSubModuleId;
  };
};
