export type StoryStackParamList = {
  StoryHome: undefined;
  StoryPreview: {storyId: string};
  StoryPlayer: {storyId: string; initialSceneIndex?: number};
  StoryCompletion: {storyId: string};
  FavoriteStories: undefined;
};
