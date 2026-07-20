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

import {getCountingProgress} from '../data/countingProgress';
import {
  getEquationProgress,
  recordEquationLessonStars,
  type EquationLessonStarResult,
} from '../data/equationProgress';
import {getMissingProgress} from '../data/missingProgress';
import type {EquationMode} from '../domain/equation/equationCurriculum';

export type EquationLessonRewardResult = {
  readonly equation: EquationLessonStarResult;
  readonly performanceStars: 1 | 2 | 3;
  readonly grant: GrantResult | null;
  readonly newBadges: readonly BadgeRule[];
  readonly celebrations: readonly CelebrationEvent[];
  readonly snapshot: GamificationSnapshot | null;
};

function perfectCount(starsByLesson: Readonly<Record<string, number>>): number {
  return Object.values(starsByLesson).filter(s => s >= 3).length;
}

/** Complete an Addition or Subtraction lesson. */
export async function completeEquationLessonRewards(input: {
  readonly childId: ChildId;
  readonly mode: EquationMode;
  readonly lessonIndex: number;
  readonly wrongAttempts: number;
}): Promise<EquationLessonRewardResult> {
  const performanceStars = starsFromMistakes(input.wrongAttempts);
  const equation = recordEquationLessonStars(
    input.mode,
    input.lessonIndex,
    performanceStars,
  );

  const repo = createMmkvGamificationRepository();
  const celebrations: CelebrationEvent[] = [];
  let snapshot: GamificationSnapshot | null = null;
  let grant: GrantResult | null = null;

  const starsToGrant = equation.deltaStars;
  const xpToGrant = equation.isFirstCompletion
    ? 15
    : equation.deltaStars > 0
    ? 5
    : 0;

  if (starsToGrant > 0 || xpToGrant > 0) {
    const result = await grantRewards(repo, {
      childId: input.childId,
      source: 'lesson',
      moduleId: ModuleId.Math,
      reasonCode: `math.${input.mode}.lesson.${input.lessonIndex}.reward`,
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
  const additionProgress = getEquationProgress('addition');
  const subtractionProgress = getEquationProgress('subtraction');

  const completedLessonCount =
    countingProgress.completedLessonIndexes.length +
    missingProgress.completedLessonIndexes.length +
    additionProgress.completedLessonIndexes.length +
    subtractionProgress.completedLessonIndexes.length;

  const perfectLessonCount =
    perfectCount(countingProgress.starsByLesson) +
    perfectCount(missingProgress.starsByLesson) +
    perfectCount(additionProgress.starsByLesson) +
    perfectCount(subtractionProgress.starsByLesson);

  const newBadges =
    snapshot != null
      ? evaluateNewBadges({
          completedLessonCount,
          perfectLessonCount,
          missingLessonsCompleted:
            missingProgress.completedLessonIndexes.length,
          missingPerfectCount: perfectCount(missingProgress.starsByLesson),
          missingAllComplete:
            missingProgress.completedLessonIndexes.length >= 10,
          countingLessonsCompleted:
            countingProgress.completedLessonIndexes.length,
          countingPerfectCount: perfectCount(countingProgress.starsByLesson),
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
    equation,
    performanceStars,
    grant,
    newBadges,
    celebrations,
    snapshot,
  };
}
