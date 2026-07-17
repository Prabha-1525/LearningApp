import {err, ok, type Result} from '@shared/lib';
import type {
  FirestoreGeneralProgress,
  FirestoreProgressBundle,
  FirestoreUserProfile,
} from '@core/domain';

import {appConfig} from '@app/config';

const DEFAULT_GENERAL: FirestoreGeneralProgress = {
  stars: 0,
  rewards: 0,
  badges: [],
  coins: 0,
  dailyStreak: 0,
  lastPlayed: null,
  completedLessons: 0,
  currentLesson: null,
  totalLearningTimeSeconds: 0,
};

function normalizeProfile(
  uid: string,
  raw: Record<string, unknown>,
): FirestoreUserProfile {
  const parent = (raw.parent as FirestoreUserProfile['parent'] | undefined) ?? {
    displayName: String(raw.displayName ?? ''),
    email: String(raw.email ?? ''),
    photoURL: (raw.photoURL as string | null) ?? null,
  };
  const legacyChild = raw.child as
    | {
        name?: string;
        avatar?: string;
        displayName?: string;
        avatarKey?: string;
        ageYears?: number;
        locale?: 'en' | 'ta';
      }
    | undefined;

  return {
    uid,
    loginType: 'google',
    parent,
    child: {
      name: legacyChild?.name ?? legacyChild?.displayName ?? '',
      avatar: legacyChild?.avatar ?? legacyChild?.avatarKey ?? '',
      ageYears: legacyChild?.ageYears ?? 6,
      locale: legacyChild?.locale ?? 'en',
    },
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    lastLogin: String(raw.lastLogin ?? new Date().toISOString()),
    appVersion: String(raw.appVersion ?? appConfig.appVersion),
    settings: (raw.settings as FirestoreUserProfile['settings']) ?? {
      language: 'English',
    },
  };
}

export type UserCloudRepository = {
  getProfile(uid: string): Promise<Result<FirestoreUserProfile | null>>;
  createOrUpdateProfile(input: {
    readonly uid: string;
    readonly parent: FirestoreUserProfile['parent'];
    readonly child: FirestoreUserProfile['child'];
  }): Promise<Result<FirestoreUserProfile>>;
  touchLastLogin(uid: string): Promise<Result<void>>;
  downloadProgress(uid: string): Promise<Result<FirestoreProgressBundle>>;
  uploadProgress(
    uid: string,
    bundle: Partial<FirestoreProgressBundle>,
  ): Promise<Result<void>>;
};

export function createUserCloudRepository(): UserCloudRepository {
  return {
    async getProfile(uid): Promise<Result<FirestoreUserProfile | null>> {
      if (!appConfig.firebaseEnabled) {
        return ok(null);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const snap = await firestore().collection('users').doc(uid).get();
        if (!snap.exists) {
          return ok(null);
        }
        return ok(
          normalizeProfile(uid, snap.data() as Record<string, unknown>),
        );
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('getProfile failed'),
        );
      }
    },

    async createOrUpdateProfile(input): Promise<Result<FirestoreUserProfile>> {
      if (!appConfig.firebaseEnabled) {
        return err(new Error('Firebase is disabled.'));
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const ref = firestore().collection('users').doc(input.uid);
        const snap = await ref.get();
        const now = new Date().toISOString();

        if (snap.exists) {
          const existing = normalizeProfile(
            input.uid,
            snap.data() as Record<string, unknown>,
          );
          const updated: FirestoreUserProfile = {
            ...existing,
            parent: input.parent,
            child: input.child,
            lastLogin: now,
            appVersion: appConfig.appVersion,
            loginType: 'google',
          };
          await ref.set(updated, {merge: true});
          return ok(updated);
        }

        const created: FirestoreUserProfile = {
          uid: input.uid,
          loginType: 'google',
          parent: input.parent,
          child: input.child,
          createdAt: now,
          lastLogin: now,
          appVersion: appConfig.appVersion,
          settings: {language: 'English'},
        };
        await ref.set(created);
        await firestore()
          .collection('users')
          .doc(input.uid)
          .collection('progress')
          .doc('general')
          .set(DEFAULT_GENERAL);
        return ok(created);
      } catch (error) {
        return err(
          error instanceof Error
            ? error
            : new Error('createOrUpdateProfile failed'),
        );
      }
    },

    async touchLastLogin(uid): Promise<Result<void>> {
      if (!appConfig.firebaseEnabled) {
        return ok(undefined);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        await firestore().collection('users').doc(uid).set(
          {
            lastLogin: new Date().toISOString(),
            appVersion: appConfig.appVersion,
          },
          {merge: true},
        );
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('touchLastLogin failed'),
        );
      }
    },

    async downloadProgress(uid): Promise<Result<FirestoreProgressBundle>> {
      if (!appConfig.firebaseEnabled) {
        return ok({
          math: null,
          chess: null,
          english: null,
          gamification: null,
          general: DEFAULT_GENERAL,
        });
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const col = firestore()
          .collection('users')
          .doc(uid)
          .collection('progress');
        const [math, chess, english, gamification, general] = await Promise.all(
          [
            col.doc('math').get(),
            col.doc('chess').get(),
            col.doc('english').get(),
            col.doc('gamification').get(),
            col.doc('general').get(),
          ],
        );
        return ok({
          math: math.exists ? math.data() : null,
          chess: chess.exists ? chess.data() : null,
          english: english.exists ? english.data() : null,
          gamification: gamification.exists ? gamification.data() : null,
          general: (general.exists
            ? general.data()
            : DEFAULT_GENERAL) as FirestoreGeneralProgress,
        });
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('downloadProgress failed'),
        );
      }
    },

    async uploadProgress(uid, bundle): Promise<Result<void>> {
      if (!appConfig.firebaseEnabled) {
        return ok(undefined);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const col = firestore()
          .collection('users')
          .doc(uid)
          .collection('progress');
        const writes: Promise<unknown>[] = [];
        if (bundle.math != null) {
          writes.push(col.doc('math').set(bundle.math, {merge: true}));
        }
        if (bundle.chess != null) {
          writes.push(col.doc('chess').set(bundle.chess, {merge: true}));
        }
        if (bundle.english != null) {
          writes.push(col.doc('english').set(bundle.english, {merge: true}));
        }
        if (bundle.gamification != null) {
          writes.push(
            col.doc('gamification').set(bundle.gamification, {merge: true}),
          );
        }
        if (bundle.general != null) {
          writes.push(col.doc('general').set(bundle.general, {merge: true}));
        }
        await Promise.all(writes);
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('uploadProgress failed'),
        );
      }
    },
  };
}
