import type {Result} from '@shared/lib';

import type {ChildProfile, ParentAccount} from '../entities';

export type AuthSession = {
  readonly parent: ParentAccount;
  readonly accessToken: string;
};

/**
 * Port: authentication. Infrastructure (Firebase Auth + Google) implements this.
 */
export type AuthRepository = {
  configure(): Promise<Result<void>>;
  getSession(): Promise<Result<AuthSession | null>>;
  signInWithGoogle(): Promise<Result<AuthSession>>;
  signInWithEmail(
    email: string,
    password: string,
  ): Promise<Result<AuthSession>>;
  signOut(): Promise<Result<void>>;
  listChildProfiles(parentId: string): Promise<Result<readonly ChildProfile[]>>;
};
