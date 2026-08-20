export type FeatureFlags = {
  readonly chessEnabled: boolean;
  readonly mathEnabled: boolean;
  readonly worldExplorerEnabled: boolean;
  readonly brainGamesEnabled: boolean;
  readonly englishEnabled: boolean;
  readonly tamilEnabled: boolean;
  readonly scienceEnabled: boolean;
  readonly timeEnabled: boolean;
  readonly codingEnabled: boolean;
  readonly memoryEnabled: boolean;
  readonly drawingEnabled: boolean;
  readonly shapesEnabled: boolean;
  readonly animalsEnabled: boolean;
  readonly rhymesEnabled: boolean;
  readonly storyEnabled: boolean;
  readonly phonicsEnabled: boolean;
};

/**
 * Compile-time / env-backed flags.
 * Remote Config can override at runtime later via a FeatureFlagsPort.
 */
export const featureFlags: FeatureFlags = {
  chessEnabled: true,
  mathEnabled: true,
  worldExplorerEnabled: true,
  brainGamesEnabled: true,
  englishEnabled: false,
  tamilEnabled: false,
  scienceEnabled: true,
  timeEnabled: true,
  codingEnabled: true,
  memoryEnabled: false,
  drawingEnabled: false,
  shapesEnabled: false,
  animalsEnabled: false,
  rhymesEnabled: true,
  storyEnabled: false,
  phonicsEnabled: false,
};
