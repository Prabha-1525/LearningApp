import type {Result} from '@shared/lib';

import type {ChildProfile, ParentAccount} from '../entities';

export type AuthSession = {
  readonly parent: ParentAccount;
  readonly accessToken: string;
};

/**
 * Port: authentication. Infrastructure (Firebase Auth) implements this.
 */
export type AuthRepository = {
  getSession(): Promise<Result<AuthSession | null>>;
  signInWithEmail(
    email: string,
    password: string,
  ): Promise<Result<AuthSession>>;
  signOut(): Promise<Result<void>>;
  listChildProfiles(parentId: string): Promise<Result<readonly ChildProfile[]>>;
};
