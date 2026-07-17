import type {ChildAvatarId} from '@assets';
import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

const PROFILE_KEY = StorageKeys.module('learner', 'localProfile');

export type LoginType = 'guest' | 'google';

export type LocalParentInfo = {
  readonly displayName: string;
  readonly email: string;
  readonly photoURL: string | null;
};

export type LocalLearnerProfile = {
  readonly loginType: LoginType;
  readonly childName: string;
  readonly avatar: ChildAvatarId | string;
  readonly createdAt: string;
  readonly lastPlayed: string | null;
  readonly profileComplete: boolean;
  /** Google signed in but child setup not finished yet. */
  readonly pendingChildSetup: boolean;
  readonly firebaseUid: string | null;
  readonly parent: LocalParentInfo | null;
};

const EMPTY: LocalLearnerProfile = {
  loginType: 'guest',
  childName: '',
  avatar: '',
  createdAt: '',
  lastPlayed: null,
  profileComplete: false,
  pendingChildSetup: false,
  firebaseUid: null,
  parent: null,
};

export function readLocalLearnerProfile(): LocalLearnerProfile {
  const raw = mmkvStorage.getString(PROFILE_KEY);
  if (!raw) {
    return EMPTY;
  }
  try {
    return {...EMPTY, ...(JSON.parse(raw) as LocalLearnerProfile)};
  } catch {
    return EMPTY;
  }
}

export function writeLocalLearnerProfile(profile: LocalLearnerProfile): void {
  mmkvStorage.setString(PROFILE_KEY, JSON.stringify(profile));
}

export function clearLocalLearnerProfile(): void {
  mmkvStorage.delete(PROFILE_KEY);
}

export function capitalizeChildName(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    return '';
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function isValidChildName(value: string): boolean {
  const name = value.trim();
  if (name.length < 1 || name.length > 20) {
    return false;
  }
  return /^[A-Za-z0-9 ]+$/.test(name);
}
