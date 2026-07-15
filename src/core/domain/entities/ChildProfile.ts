import type {IsoDateTimeString} from '@shared/types';

import type {ChildId, ParentId} from './ModuleId';

export const TARGET_AGE_MIN = 5;
export const TARGET_AGE_MAX = 8;

export type ChildProfile = {
  readonly id: ChildId;
  readonly parentId: ParentId;
  readonly displayName: string;
  /** Whole years; product targets 5–8. */
  readonly ageYears: number;
  readonly locale: 'en' | 'ta';
  readonly createdAt: IsoDateTimeString;
  readonly avatarKey: string;
};

export type ParentAccount = {
  readonly id: ParentId;
  readonly email: string;
  readonly displayName: string;
};
