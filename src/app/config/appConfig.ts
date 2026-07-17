import {featureFlags} from '@shared/config';

import {env} from './env';

export type AppConfig = {
  readonly appName: string;
  readonly environment: 'development' | 'staging' | 'production';
  readonly featureFlags: typeof featureFlags;
  readonly firebaseEnabled: boolean;
  readonly authRequired: boolean;
  readonly googleWebClientId: string;
  readonly appVersion: string;
};

/**
 * Composition-root config. Prefer injecting ports over reading this in features.
 */
export const appConfig: AppConfig = {
  appName: 'Learning App',
  environment: env.appEnv,
  featureFlags,
  firebaseEnabled: env.firebaseEnabled,
  authRequired: env.authRequired,
  googleWebClientId: env.googleWebClientId,
  appVersion: '1.0.0',
};
