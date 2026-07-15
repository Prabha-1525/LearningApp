import {err, ok, type Result} from '@shared/lib';
import type {AuthRepository, AuthSession, ChildProfile} from '@core/domain';
import {asChildId, asParentId} from '@core/domain';

import {appConfig} from '@app/config';

/**
 * Firebase Auth adapter (scaffold).
 * Returns clear errors when Firebase is disabled so UI can fall back gracefully.
 */
export function createFirebaseAuthRepository(): AuthRepository {
  return {
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
          parent: {
            id: asParentId(user.uid),
            email: user.email ?? '',
            displayName: user.displayName ?? 'Parent',
          },
        });
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('Auth getSession failed'),
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
          parent: {
            id: asParentId(user.uid),
            email: user.email ?? email,
            displayName: user.displayName ?? 'Parent',
          },
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
      if (!appConfig.firebaseEnabled) {
        return ok([]);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const snap = await firestore()
          .collection('parents')
          .doc(parentId)
          .collection('children')
          .get();

        const children: ChildProfile[] = snap.docs.map(
          (doc: {
            id: string;
            data: () => {
              displayName?: string;
              ageYears?: number;
              locale?: 'en' | 'ta';
              createdAt?: string;
              avatarKey?: string;
            };
          }) => {
            const data = doc.data();
            return {
              id: asChildId(doc.id),
              parentId: asParentId(parentId),
              displayName: data.displayName ?? 'Child',
              ageYears: data.ageYears ?? 6,
              locale: data.locale ?? 'en',
              createdAt: (data.createdAt ??
                new Date().toISOString()) as ChildProfile['createdAt'],
              avatarKey: data.avatarKey ?? 'sunny',
            };
          },
        );
        return ok(children);
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
