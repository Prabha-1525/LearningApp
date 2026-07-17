import type {AppDispatch} from '@app/store';
import {asChildId, asParentId} from '@core/domain';
import {createMmkvGamificationRepository} from '@core/gamification';
import {
  clearSession,
  hydrateGamification,
  setActiveChildId,
  setOnboardingComplete,
  setSession,
  upsertChild,
} from '@core/store';
import {
  createFirebaseAuthRepository,
  createUserCloudRepository,
} from '@infrastructure/firebase';
import {
  capitalizeChildName,
  clearLocalLearnerProfile,
  readLocalLearnerProfile,
  writeLocalLearnerProfile,
  type LocalLearnerProfile,
} from '@infrastructure/storage/LocalLearnerProfileStore';
import {
  collectLocalProgressBundle,
  hydrateProgressFromCloud,
  setActiveCloudUid,
  startProgressSyncListener,
} from '@infrastructure/sync/ProgressSyncService';
import {err, ok, type Result} from '@shared/lib';

export type AuthBootstrapResult = {
  readonly authenticated: boolean;
  readonly needsChildSetup: boolean;
};

export type GoogleSignInOutcome =
  | {readonly kind: 'ready'}
  | {readonly kind: 'needsChildSetup'}
  | {readonly kind: 'mergePrompt'};

function applyChildToRedux(
  dispatch: AppDispatch,
  uid: string,
  childName: string,
  avatar: string,
  createdAt: string,
  accessToken: string,
  parent: {email: string; displayName: string},
) {
  const childId = asChildId(uid);
  dispatch(
    setSession({
      parent: {
        id: asParentId(uid),
        email: parent.email,
        displayName: parent.displayName,
      },
      accessToken,
    }),
  );
  dispatch(
    upsertChild({
      id: childId,
      parentId: asParentId(uid),
      displayName: childName,
      ageYears: 6,
      locale: 'en',
      createdAt: createdAt as import('@shared/types').IsoDateTimeString,
      avatarKey: avatar,
    }),
  );
  dispatch(setActiveChildId(childId));
  dispatch(setOnboardingComplete(true));
}

async function hydrateGamificationFor(
  dispatch: AppDispatch,
  uid: string,
): Promise<void> {
  const childId = asChildId(uid);
  const repo = createMmkvGamificationRepository();
  const snapshot = await repo.loadSnapshot(childId);
  if (snapshot.ok) {
    dispatch(hydrateGamification({childId, snapshot: snapshot.value}));
  }
}

/**
 * Boot: restore Google session or local guest profile.
 */
export async function bootstrapAuthSession(
  dispatch: AppDispatch,
): Promise<Result<AuthBootstrapResult>> {
  const local = readLocalLearnerProfile();

  // Guest with completed profile — enter app offline.
  if (local.loginType === 'guest' && local.profileComplete) {
    const guestId = 'guest-local';
    applyChildToRedux(
      dispatch,
      guestId,
      local.childName,
      local.avatar,
      local.createdAt || new Date().toISOString(),
      'guest-token',
      {email: '', displayName: 'Guest'},
    );
    return ok({authenticated: true, needsChildSetup: false});
  }

  if (local.pendingChildSetup && local.firebaseUid) {
    return ok({authenticated: false, needsChildSetup: true});
  }

  const auth = createFirebaseAuthRepository();
  const configure = await auth.configure();
  if (!configure.ok) {
    // Still allow guest onboarding when Firebase isn't ready.
    return ok({authenticated: false, needsChildSetup: false});
  }

  const sessionResult = await auth.getSession();
  if (!sessionResult.ok) {
    return err(sessionResult.error);
  }
  if (sessionResult.value == null) {
    dispatch(clearSession());
    return ok({authenticated: false, needsChildSetup: false});
  }

  const uid = sessionResult.value.parent.id;
  const cloud = createUserCloudRepository();
  const profileResult = await cloud.getProfile(uid);
  if (!profileResult.ok) {
    return err(profileResult.error);
  }

  const profile = profileResult.value;
  const hasChild =
    profile != null &&
    profile.child.name.trim().length > 0 &&
    profile.child.avatar.trim().length > 0;

  if (!hasChild) {
    writeLocalLearnerProfile({
      ...local,
      loginType: 'google',
      pendingChildSetup: true,
      profileComplete: false,
      firebaseUid: uid,
      parent: {
        displayName: sessionResult.value.parent.displayName,
        email: sessionResult.value.parent.email,
        photoURL: null,
      },
    });
    dispatch(
      setSession({
        parent: sessionResult.value.parent,
        accessToken: sessionResult.value.accessToken,
      }),
    );
    return ok({authenticated: false, needsChildSetup: true});
  }

  await cloud.touchLastLogin(uid);
  const progress = await cloud.downloadProgress(uid);
  if (progress.ok) {
    await hydrateProgressFromCloud(uid, progress.value);
  }
  setActiveCloudUid(uid);

  writeLocalLearnerProfile({
    loginType: 'google',
    childName: profile!.child.name,
    avatar: profile!.child.avatar,
    createdAt: profile!.createdAt,
    lastPlayed: new Date().toISOString(),
    profileComplete: true,
    pendingChildSetup: false,
    firebaseUid: uid,
    parent: profile!.parent,
  });

  applyChildToRedux(
    dispatch,
    uid,
    profile!.child.name,
    profile!.child.avatar,
    profile!.createdAt,
    sessionResult.value.accessToken,
    profile!.parent,
  );
  await hydrateGamificationFor(dispatch, uid);
  startProgressSyncListener();
  return ok({authenticated: true, needsChildSetup: false});
}

/**
 * Google Sign-In. Existing profile → home. New → child setup.
 * Guest with local progress → merge prompt.
 */
export async function signInWithGoogleFlow(
  dispatch: AppDispatch,
): Promise<Result<GoogleSignInOutcome>> {
  const existingLocal = readLocalLearnerProfile();
  const hadGuestProgress =
    existingLocal.loginType === 'guest' && existingLocal.profileComplete;

  const auth = createFirebaseAuthRepository();
  const configure = await auth.configure();
  if (!configure.ok) {
    return err(configure.error);
  }

  const signIn = await auth.signInWithGoogle();
  if (!signIn.ok) {
    return err(signIn.error);
  }

  const authModule = require('@react-native-firebase/auth').default;
  const user = authModule().currentUser;
  const uid = signIn.value.parent.id;
  const parent = {
    displayName: signIn.value.parent.displayName,
    email: signIn.value.parent.email,
    photoURL: (user?.photoURL as string | null) ?? null,
  };

  dispatch(
    setSession({
      parent: signIn.value.parent,
      accessToken: signIn.value.accessToken,
    }),
  );

  if (hadGuestProgress) {
    writeLocalLearnerProfile({
      ...existingLocal,
      loginType: 'google',
      pendingChildSetup: !existingLocal.profileComplete,
      firebaseUid: uid,
      parent,
    });
    return ok({kind: 'mergePrompt'});
  }

  const cloud = createUserCloudRepository();
  const profileResult = await cloud.getProfile(uid);
  if (!profileResult.ok) {
    return err(profileResult.error);
  }

  const profile = profileResult.value;
  const hasChild =
    profile != null &&
    profile.child.name.trim().length > 0 &&
    profile.child.avatar.trim().length > 0;

  if (hasChild) {
    await cloud.touchLastLogin(uid);
    const progress = await cloud.downloadProgress(uid);
    if (progress.ok) {
      await hydrateProgressFromCloud(uid, progress.value);
    }
    setActiveCloudUid(uid);
    writeLocalLearnerProfile({
      loginType: 'google',
      childName: profile!.child.name,
      avatar: profile!.child.avatar,
      createdAt: profile!.createdAt,
      lastPlayed: new Date().toISOString(),
      profileComplete: true,
      pendingChildSetup: false,
      firebaseUid: uid,
      parent: profile!.parent,
    });
    applyChildToRedux(
      dispatch,
      uid,
      profile!.child.name,
      profile!.child.avatar,
      profile!.createdAt,
      signIn.value.accessToken,
      profile!.parent,
    );
    await hydrateGamificationFor(dispatch, uid);
    startProgressSyncListener();
    return ok({kind: 'ready'});
  }

  writeLocalLearnerProfile({
    loginType: 'google',
    childName: '',
    avatar: '',
    createdAt: new Date().toISOString(),
    lastPlayed: null,
    profileComplete: false,
    pendingChildSetup: true,
    firebaseUid: uid,
    parent,
  });
  return ok({kind: 'needsChildSetup'});
}

export function beginGuestSetup(): void {
  writeLocalLearnerProfile({
    loginType: 'guest',
    childName: '',
    avatar: '',
    createdAt: new Date().toISOString(),
    lastPlayed: null,
    profileComplete: false,
    pendingChildSetup: true,
    firebaseUid: null,
    parent: null,
  });
}

export async function completeChildProfileSetup(
  dispatch: AppDispatch,
  input: {readonly childName: string; readonly avatar: string},
): Promise<Result<void>> {
  const name = capitalizeChildName(input.childName);
  const local = readLocalLearnerProfile();
  const now = new Date().toISOString();

  if (local.loginType === 'google' && local.firebaseUid && local.parent) {
    const cloud = createUserCloudRepository();
    const saved = await cloud.createOrUpdateProfile({
      uid: local.firebaseUid,
      parent: local.parent,
      child: {name, avatar: input.avatar, ageYears: 6, locale: 'en'},
    });
    if (!saved.ok) {
      return err(saved.error);
    }

    const progress = await cloud.downloadProgress(local.firebaseUid);
    if (progress.ok) {
      await hydrateProgressFromCloud(local.firebaseUid, progress.value);
    }
    setActiveCloudUid(local.firebaseUid);

    const next: LocalLearnerProfile = {
      loginType: 'google',
      childName: name,
      avatar: input.avatar,
      createdAt: saved.value.createdAt,
      lastPlayed: now,
      profileComplete: true,
      pendingChildSetup: false,
      firebaseUid: local.firebaseUid,
      parent: local.parent,
    };
    writeLocalLearnerProfile(next);

    const auth = createFirebaseAuthRepository();
    const session = await auth.getSession();
    const token = session.ok && session.value ? session.value.accessToken : '';

    applyChildToRedux(
      dispatch,
      local.firebaseUid,
      name,
      input.avatar,
      saved.value.createdAt,
      token,
      local.parent,
    );
    await hydrateGamificationFor(dispatch, local.firebaseUid);
    startProgressSyncListener();
    return ok(undefined);
  }

  // Guest — local only
  const guestId = 'guest-local';
  writeLocalLearnerProfile({
    loginType: 'guest',
    childName: name,
    avatar: input.avatar,
    createdAt: local.createdAt || now,
    lastPlayed: now,
    profileComplete: true,
    pendingChildSetup: false,
    firebaseUid: null,
    parent: null,
  });
  applyChildToRedux(
    dispatch,
    guestId,
    name,
    input.avatar,
    local.createdAt || now,
    'guest-token',
    {email: '', displayName: 'Guest'},
  );
  await hydrateGamificationFor(dispatch, guestId);
  return ok(undefined);
}

/**
 * Upload guest MMKV progress to the signed-in Google account.
 */
export async function mergeGuestProgressToGoogle(
  dispatch: AppDispatch,
): Promise<Result<void>> {
  const local = readLocalLearnerProfile();
  if (!local.firebaseUid || !local.parent) {
    return err(new Error('Google account is not ready for merge.'));
  }

  const cloud = createUserCloudRepository();
  const childName = local.childName || 'Little Learner';
  const avatar = local.avatar || 'lion';

  // Migrate guest gamification snapshot to the Google uid key.
  const guestChildId = asChildId('guest-local');
  const googleChildId = asChildId(local.firebaseUid);
  const gamificationRepo = createMmkvGamificationRepository();
  const guestSnap = await gamificationRepo.loadSnapshot(guestChildId);
  if (guestSnap.ok) {
    await gamificationRepo.saveSnapshot({
      ...guestSnap.value,
      wallet: {...guestSnap.value.wallet, childId: googleChildId},
      xp: {...guestSnap.value.xp, childId: googleChildId},
      daily: {...guestSnap.value.daily, childId: googleChildId},
      streak: {...guestSnap.value.streak, childId: googleChildId},
    });
  }

  const saved = await cloud.createOrUpdateProfile({
    uid: local.firebaseUid,
    parent: local.parent,
    child: {name: childName, avatar, ageYears: 6, locale: 'en'},
  });
  if (!saved.ok) {
    return err(saved.error);
  }

  const bundle = await collectLocalProgressBundle(local.firebaseUid);
  const upload = await cloud.uploadProgress(local.firebaseUid, bundle);
  if (!upload.ok) {
    return err(upload.error);
  }

  setActiveCloudUid(local.firebaseUid);
  writeLocalLearnerProfile({
    ...local,
    loginType: 'google',
    childName,
    avatar,
    profileComplete: true,
    pendingChildSetup: false,
  });

  const auth = createFirebaseAuthRepository();
  const session = await auth.getSession();
  const token = session.ok && session.value ? session.value.accessToken : '';
  applyChildToRedux(
    dispatch,
    local.firebaseUid,
    childName,
    avatar,
    saved.value.createdAt,
    token,
    local.parent,
  );
  await hydrateGamificationFor(dispatch, local.firebaseUid);
  startProgressSyncListener();
  return ok(undefined);
}

export async function signOutAndClear(
  dispatch: AppDispatch,
): Promise<Result<void>> {
  const auth = createFirebaseAuthRepository();
  const result = await auth.signOut();
  clearLocalLearnerProfile();
  dispatch(clearSession());
  dispatch(setActiveChildId(null));
  dispatch(setOnboardingComplete(false));
  return result;
}

export {startProgressSyncListener, readLocalLearnerProfile};
