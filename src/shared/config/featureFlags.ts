export type FeatureFlags = {
  readonly chessEnabled: boolean;
  readonly mathEnabled: boolean;
  readonly englishEnabled: boolean;
  readonly tamilEnabled: boolean;
  readonly scienceEnabled: boolean;
  readonly memoryEnabled: boolean;
  readonly drawingEnabled: boolean;
};

/**
 * Compile-time / env-backed flags.
 * Remote Config can override at runtime later via a FeatureFlagsPort.
 */
export const featureFlags: FeatureFlags = {
  chessEnabled: true,
  mathEnabled: true,
  englishEnabled: false,
  tamilEnabled: false,
  scienceEnabled: false,
  memoryEnabled: false,
  drawingEnabled: false,
};
