import {err, ok, type Result} from '@shared/lib';
import type {AuthRepository, AuthSession, ChildProfile} from '@core/domain';
import {asChildId, asParentId} from '@core/domain';

import {appConfig} from '@app/config';

function mapFirebaseUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): AuthSession['parent'] {
  return {
    id: asParentId(user.uid),
    email: user.email ?? '',
    displayName: user.displayName ?? 'Parent',
  };
}

/**
 * Firebase Auth + Google Sign-In adapter (Android-first).
 * Uses the Web OAuth client ID so Firebase can verify the Google idToken.
 */
export function createFirebaseAuthRepository(): AuthRepository {
  return {
    async configure(): Promise<Result<void>> {
      if (!appConfig.firebaseEnabled) {
        return ok(undefined);
      }
      if (!appConfig.googleWebClientId) {
        return err(
          new Error(
            'GOOGLE_WEB_CLIENT_ID is missing. Set it in .env (Web client type 3 from google-services.json).',
          ),
        );
      }
      try {
        const {
          GoogleSignin,
        } = require('@react-native-google-signin/google-signin');
        GoogleSignin.configure({
          webClientId: appConfig.googleWebClientId,
          offlineAccess: false,
        });
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error
            ? error
            : new Error('Google Sign-In configure failed'),
        );
      }
    },

    async getSession(): Promise<Result<AuthSession | null>> {
      if (!appConfig.firebaseEnabled) {
        return ok(null);
      }
      try {
        const auth = require('@react-native-firebase/auth').default;
        const user = auth().currentUser;
        if (user == null) {
          return ok(null);
        }
        const token = await user.getIdToken();
        return ok({
          accessToken: token,
          parent: mapFirebaseUser(user),
        });
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('Auth getSession failed'),
        );
      }
    },

    async signInWithGoogle(): Promise<Result<AuthSession>> {
      if (!appConfig.firebaseEnabled) {
        return err(
          new Error('Firebase is disabled. Set FIREBASE_ENABLED=true.'),
        );
      }
      if (!appConfig.googleWebClientId) {
        return err(new Error('GOOGLE_WEB_CLIENT_ID is missing.'));
      }
      try {
        const {
          GoogleSignin,
        } = require('@react-native-google-signin/google-signin');
        const auth = require('@react-native-firebase/auth').default;

        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        const response = await GoogleSignin.signIn();
        if (response?.type === 'cancelled') {
          return err(new Error('Google sign-in was cancelled.'));
        }
        const idToken = response?.data?.idToken ?? response?.idToken ?? null;
        if (idToken == null) {
          return err(new Error('Google Sign-In did not return an id token.'));
        }

        const credential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(credential);
        const user = userCredential.user;
        const token = await user.getIdToken();
        return ok({
          accessToken: token,
          parent: mapFirebaseUser(user),
        });
      } catch (error: unknown) {
        try {
          const {
            statusCodes,
            isErrorWithCode,
          } = require('@react-native-google-signin/google-signin');
          if (
            isErrorWithCode?.(error) &&
            (error as {code: string}).code === statusCodes.SIGN_IN_CANCELLED
          ) {
            return err(new Error('Google sign-in was cancelled.'));
          }
        } catch {
          // ignore
        }
        return err(
          error instanceof Error ? error : new Error('Google sign-in failed'),
        );
      }
    },

    async signInWithEmail(
      email: string,
      password: string,
    ): Promise<Result<AuthSession>> {
      if (!appConfig.firebaseEnabled) {
        return err(
          new Error('Firebase is disabled. Set FIREBASE_ENABLED=true.'),
        );
      }
      try {
        const auth = require('@react-native-firebase/auth').default;
        const credential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        const user = credential.user;
        const token = await user.getIdToken();
        return ok({
          accessToken: token,
          parent: mapFirebaseUser(user),
        });
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('Sign-in failed'),
        );
      }
    },

    async signOut(): Promise<Result<void>> {
      if (!appConfig.firebaseEnabled) {
        return ok(undefined);
      }
      try {
        const auth = require('@react-native-firebase/auth').default;
        try {
          const {
            GoogleSignin,
          } = require('@react-native-google-signin/google-signin');
          await GoogleSignin.signOut();
        } catch {
          // Ignore Google sign-out errors when never signed in with Google.
        }
        await auth().signOut();
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('Sign-out failed'),
        );
      }
    },

    async listChildProfiles(
      parentId: string,
    ): Promise<Result<readonly ChildProfile[]>> {
      // v1: single child lives on users/{uid}.child — prefer UserProfileRepository.
      if (!appConfig.firebaseEnabled) {
        return ok([]);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const doc = await firestore().collection('users').doc(parentId).get();
        if (!doc.exists) {
          return ok([]);
        }
        const data = doc.data() as Record<string, unknown>;
        const child = data.child as
          | {
              name?: string;
              avatar?: string;
              displayName?: string;
              avatarKey?: string;
              ageYears?: number;
              locale?: 'en' | 'ta';
            }
          | undefined;
        if (child == null) {
          return ok([]);
        }
        return ok([
          {
            id: asChildId(parentId),
            parentId: asParentId(parentId),
            displayName: child.name ?? child.displayName ?? 'Little Learner',
            ageYears: child.ageYears ?? 6,
            locale: child.locale ?? 'en',
            createdAt: String(
              data.createdAt ?? new Date().toISOString(),
            ) as ChildProfile['createdAt'],
            avatarKey: child.avatar ?? child.avatarKey ?? 'lion',
          },
        ]);
      } catch (error) {
        return err(
          error instanceof Error
            ? error
            : new Error('listChildProfiles failed'),
        );
      }
    },
  };
}
