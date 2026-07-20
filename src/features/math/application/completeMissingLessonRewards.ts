import type {ChildId} from '@core/domain';
import {ModuleId} from '@core/domain';
import {
  createMmkvGamificationRepository,
  evaluateNewBadges,
  grantRewards,
  type BadgeRule,
  type CelebrationEvent,
  type GamificationSnapshot,
  type GrantResult,
} from '@core/gamification';
import {starsFromMistakes} from '@core/gamification/domain/policies/starScore';

import {
  countMissingPerfectLessons,
  getMissingProgress,
  recordMissingLessonStars,
  type MissingLessonStarResult,
} from '../data/missingProgress';
import {MISSING_LESSON_COUNT} from '../domain/missing/missingCurriculum';

export type MissingLessonRewardResult = {
  readonly missing: MissingLessonStarResult;
  readonly performanceStars: 1 | 2 | 3;
  readonly grant: GrantResult | null;
  readonly newBadges: readonly BadgeRule[];
  readonly celebrations: readonly CelebrationEvent[];
  readonly snapshot: GamificationSnapshot | null;
};

/**
 * Complete a Missing Number lesson: best stars, wallet delta, badge unlocks.
 */
export async function completeMissingLessonRewards(input: {
  readonly childId: ChildId;
  readonly lessonIndex: number;
  readonly wrongAttempts: number;
}): Promise<MissingLessonRewardResult> {
  const performanceStars = starsFromMistakes(input.wrongAttempts);
  const missing = recordMissingLessonStars(input.lessonIndex, performanceStars);

  const repo = createMmkvGamificationRepository();
  const celebrations: CelebrationEvent[] = [];
  let snapshot: GamificationSnapshot | null = null;
  let grant: GrantResult | null = null;

  const starsToGrant = missing.deltaStars;
  const xpToGrant = missing.isFirstCompletion
    ? 15
    : missing.deltaStars > 0
    ? 5
    : 0;

  if (starsToGrant > 0 || xpToGrant > 0) {
    const result = await grantRewards(repo, {
      childId: input.childId,
      source: 'lesson',
      moduleId: ModuleId.Math,
      reasonCode: `math.missing.lesson.${input.lessonIndex}.reward`,
      stars: starsToGrant,
      xp: xpToGrant,
      celebrationKey: 'lesson_complete',
    });
    if (result.ok) {
      grant = result.value;
      snapshot = result.value.snapshot;
      celebrations.push(...result.value.celebrations);
    }
  }

  if (snapshot == null) {
    const loaded = await repo.loadSnapshot(input.childId);
    if (loaded.ok) {
      snapshot = loaded.value;
    }
  }

  const progress = getMissingProgress();
  const newBadges =
    snapshot != null
      ? evaluateNewBadges({
          completedLessonCount: progress.completedLessonIndexes.length,
          perfectLessonCount: Object.values(progress.starsByLesson).filter(
            s => s >= 3,
          ).length,
          missingLessonsCompleted: progress.completedLessonIndexes.length,
          missingPerfectCount: countMissingPerfectLessons(),
          missingAllComplete:
            progress.completedLessonIndexes.length >= MISSING_LESSON_COUNT,
          currentStreak: snapshot.streak.currentStreak,
          ownedBadgeIds: new Set(snapshot.badges.map(b => b.badgeId)),
        })
      : [];

  for (const badge of newBadges) {
    const badgeGrant = await grantRewards(repo, {
      childId: input.childId,
      source: 'lesson',
      moduleId: ModuleId.Math,
      reasonCode: `badge.unlock.${badge.id}`,
      stars: 0,
      badgeId: badge.badgeId,
      celebrationKey: `badge_${badge.id}`,
    });
    if (badgeGrant.ok) {
      snapshot = badgeGrant.value.snapshot;
      celebrations.push(...badgeGrant.value.celebrations);
      grant = badgeGrant.value;
    }
  }

  try {
    const {getActiveCloudUid, scheduleProgressSync} =
      require('@infrastructure/auth') as typeof import('@infrastructure/auth');
    const uid = getActiveCloudUid();
    if (uid) {
      scheduleProgressSync(uid, 'gamification');
      scheduleProgressSync(uid, 'math');
    }
  } catch {
    // optional
  }

  return {
    missing,
    performanceStars,
    grant,
    newBadges,
    celebrations,
    snapshot,
  };
}
