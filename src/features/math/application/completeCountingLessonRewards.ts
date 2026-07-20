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
  getCountingProgress,
  recordCountingLessonStars,
  type CountingLessonStarResult,
} from '../data/countingProgress';
import {getMissingProgress} from '../data/missingProgress';

export type CountingLessonRewardResult = {
  readonly counting: CountingLessonStarResult;
  readonly performanceStars: 1 | 2 | 3;
  readonly grant: GrantResult | null;
  readonly newBadges: readonly BadgeRule[];
  readonly celebrations: readonly CelebrationEvent[];
  readonly snapshot: GamificationSnapshot | null;
};

/** Complete a Counting lesson: best stars, wallet delta, badge unlocks. */
export async function completeCountingLessonRewards(input: {
  readonly childId: ChildId;
  readonly lessonIndex: number;
  readonly wrongAttempts: number;
}): Promise<CountingLessonRewardResult> {
  const performanceStars = starsFromMistakes(input.wrongAttempts);
  const counting = recordCountingLessonStars(
    input.lessonIndex,
    performanceStars,
  );

  const repo = createMmkvGamificationRepository();
  const celebrations: CelebrationEvent[] = [];
  let snapshot: GamificationSnapshot | null = null;
  let grant: GrantResult | null = null;

  const starsToGrant = counting.deltaStars;
  const xpToGrant = counting.isFirstCompletion
    ? 15
    : counting.deltaStars > 0
    ? 5
    : 0;

  if (starsToGrant > 0 || xpToGrant > 0) {
    const result = await grantRewards(repo, {
      childId: input.childId,
      source: 'lesson',
      moduleId: ModuleId.Math,
      reasonCode: `math.counting.lesson.${input.lessonIndex}.reward`,
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

  const countingProgress = getCountingProgress();
  const missingProgress = getMissingProgress();
  const countingPerfect = Object.values(countingProgress.starsByLesson).filter(
    s => s >= 3,
  ).length;
  const missingPerfect = Object.values(missingProgress.starsByLesson).filter(
    s => s >= 3,
  ).length;

  const newBadges =
    snapshot != null
      ? evaluateNewBadges({
          completedLessonCount:
            countingProgress.completedLessonIndexes.length +
            missingProgress.completedLessonIndexes.length,
          perfectLessonCount: countingPerfect + missingPerfect,
          missingLessonsCompleted:
            missingProgress.completedLessonIndexes.length,
          missingPerfectCount: missingPerfect,
          missingAllComplete:
            missingProgress.completedLessonIndexes.length >= 10,
          countingLessonsCompleted:
            countingProgress.completedLessonIndexes.length,
          countingPerfectCount: countingPerfect,
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
    counting,
    performanceStars,
    grant,
    newBadges,
    celebrations,
    snapshot,
  };
}
