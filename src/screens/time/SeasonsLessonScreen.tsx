import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {AppSafeAreaView, LearningHeader} from '@components';
import {SeasonsSceneView} from '../../features/time/presentation/components';
import {recordTimeTopicCompletion} from '../../features/time/data/progress/timeProgress';

export function SeasonsLessonScreen() {
  const {t} = useTranslation();

  const handleExploreAll = useCallback(() => {
    recordTimeTopicCompletion('seasons', 3);
  }, []);

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FDF2F8">
      <LearningHeader
        title={t('time.topics.seasons.title', 'Seasons')}
        subtitle="Summer, Rainy, Autumn & Winter"
        emoji="🌦️"
        accentColor="#DB2777"
        titleColor="#DB2777"
      />
      <SeasonsSceneView onExploreAll={handleExploreAll} />
    </AppSafeAreaView>
  );
}
