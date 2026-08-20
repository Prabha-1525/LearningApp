export type ScienceStackParamList = {
  Home: undefined;
  PlantsLesson: undefined;
  HumanBodyLesson: undefined;
  AnimalsLesson: undefined;
  SpaceLesson: undefined;
  WeatherLesson: undefined;
  WaterEarthLesson: undefined;
  Experiments: undefined;
  ScienceQuiz: undefined;
  ScienceComplete: {
    topicId: string;
    stars: number;
    title: string;
    nextTopicId?: string;
  };
};
