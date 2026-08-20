import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {
  isActivityUnlocked,
  type ActivityId,
} from '../../domain/policies/unlockRules';
import {
  markCapitalLearned,
  markContinentExplored,
  markCountryExplored,
  markFlagLearned,
  markLandmarkExplored,
  readWorldExplorerProgress,
  recordQuizCompleted,
  type WorldExplorerProgress,
} from '../../data/progress/worldExplorerProgress';

export function useWorldExplorerProgress() {
  const [progress, setProgress] = useState<WorldExplorerProgress>(
    readWorldExplorerProgress,
  );

  const refreshProgress = useCallback(() => {
    setProgress(readWorldExplorerProgress());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
    }, [refreshProgress]),
  );

  const checkUnlocked = useCallback(
    (activityId: ActivityId) => {
      return isActivityUnlocked(activityId, progress);
    },
    [progress],
  );

  const exploreCountry = useCallback((code: string) => {
    const updated = markCountryExplored(code);
    setProgress(updated);
  }, []);

  const learnFlag = useCallback((code: string) => {
    const updated = markFlagLearned(code);
    setProgress(updated);
  }, []);

  const exploreContinent = useCallback((continentId: string) => {
    const updated = markContinentExplored(continentId);
    setProgress(updated);
  }, []);

  const learnCapital = useCallback((code: string) => {
    const updated = markCapitalLearned(code);
    setProgress(updated);
  }, []);

  const exploreLandmark = useCallback((landmarkId: string) => {
    const updated = markLandmarkExplored(landmarkId);
    setProgress(updated);
  }, []);

  const finishQuiz = useCallback((earnedStars = 3) => {
    const updated = recordQuizCompleted(earnedStars);
    setProgress(updated);
  }, []);

  return {
    progress,
    refreshProgress,
    checkUnlocked,
    exploreCountry,
    learnFlag,
    exploreContinent,
    learnCapital,
    exploreLandmark,
    finishQuiz,
  };
}
