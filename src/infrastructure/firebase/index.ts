import {appConfig} from '@app/config';

export type FirebaseBootstrapResult = {
  readonly enabled: boolean;
  readonly ready: boolean;
  readonly reason?: string;
};

/**
 * Decision: Firebase is optional until native config files exist.
 * Applying Google Services without google-services.json breaks Android builds,
 * so native plugins apply conditionally and JS respects FIREBASE_ENABLED.
 */
export function bootstrapFirebase(): FirebaseBootstrapResult {
  if (!appConfig.firebaseEnabled) {
    return {
      enabled: false,
      ready: false,
      reason: 'FIREBASE_ENABLED=false',
    };
  }

  try {
    // Dynamic require keeps Jest / disabled builds free of native init side effects.

    require('@react-native-firebase/app');
    return {enabled: true, ready: true};
  } catch (error) {
    return {
      enabled: true,
      ready: false,
      reason:
        error instanceof Error
          ? error.message
          : 'Firebase native module unavailable',
    };
  }
}

export {createFirebaseAuthRepository} from './authRepository';
export {createFirebaseProgressRepository} from './progressRepository';
export {createUserCloudRepository} from './userCloudRepository';
