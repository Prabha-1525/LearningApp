/**
 * Firestore user document — v1 one Google account → one child.
 * Path: users/{firebaseUid}
 */
export type FirestoreParentInfo = {
  readonly displayName: string;
  readonly email: string;
  readonly photoURL: string | null;
};

export type FirestoreChildInfo = {
  readonly name: string;
  readonly avatar: string;
  readonly ageYears?: number;
  readonly locale?: 'en' | 'ta';
};

export type FirestoreUserProfile = {
  readonly uid: string;
  readonly loginType: 'google';
  readonly parent: FirestoreParentInfo;
  readonly child: FirestoreChildInfo;
  readonly createdAt: string;
  readonly lastLogin: string;
  readonly appVersion: string;
  readonly settings: {
    readonly language: string;
  };
};

/** @deprecated Prefer FirestoreChildInfo — kept for transitional reads. */
export type FirestoreChildProfile = {
  readonly displayName: string;
  readonly avatarKey: string;
  readonly ageYears: number;
  readonly locale: 'en' | 'ta';
};

export type FirestoreGeneralProgress = {
  readonly stars: number;
  readonly rewards: number;
  readonly badges: readonly string[];
  readonly coins: number;
  readonly dailyStreak: number;
  readonly lastPlayed: string | null;
  readonly completedLessons: number;
  readonly currentLesson: string | null;
  readonly totalLearningTimeSeconds: number;
};

export type FirestoreProgressBundle = {
  readonly math: unknown | null;
  readonly chess: unknown | null;
  readonly english: unknown | null;
  readonly gamification: unknown | null;
  readonly general: FirestoreGeneralProgress;
};
